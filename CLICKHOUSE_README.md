# ClickHouse Integration for Event Tracking

This document describes the ClickHouse integration for event tracking in the DM Frontend application.

## Overview

The application uses a dual-database architecture:
- **MySQL** (with Drizzle ORM) - For core Nuxt data (products, categories, SEO)
- **ClickHouse** (with native client) - For high-performance event tracking and analytics

## Why ClickHouse?

ClickHouse is optimized for:
- Fast analytical queries on large datasets
- Time-series data (events ordered by timestamp)
- Structured and semi-structured data (JSON metadata)
- High-throughput inserts
- Efficient storage with compression

## Event Types

The system tracks the following event types:

### Basic Events
- `view` - Product page views
- `add_to_cart` - Items added to cart

### Advanced Events (with structured metadata)
- `search` - Search queries with rich context (query, results, device type, etc.)
- `filter_applied` - Filter applications with filter details
- `product_comparison` - Product comparisons with comparison attributes

## Structured Data Support

ClickHouse excels at handling both structured and semi-structured data through its `event_metadata` JSON field.

### Example: Search Event Metadata

```json
{
  "query": "laptop",
  "timestamp": 1700000000000,
  "resultsCount": 15,
  "filters": {
    "category": "electronics",
    "priceRange": "500-1000"
  },
  "sortBy": "relevance",
  "page": 1,
  "clickedPosition": 3,
  "timeSpent": 5432,
  "deviceType": "desktop",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "referrer": "https://google.com"
}
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS events (
    event_id UUID DEFAULT generateUUIDv4(),
    event_type String,
    product_id Int32,
    user_session String,
    event_metadata String DEFAULT '{}',
    created_at DateTime DEFAULT now(),
    INDEX idx_product_id product_id TYPE minmax GRANULARITY 4,
    INDEX idx_event_type event_type TYPE set(0) GRANULARITY 4,
    INDEX idx_user_session user_session TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
ORDER BY (created_at, event_type)
PARTITION BY toYYYYMM(created_at)
TTL created_at + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;
```

### Key Features:
- **Partitioning**: Data is partitioned by month for efficient queries
- **TTL**: Automatic data deletion after 1 year
- **Indexes**: Optimized indexes for common query patterns
- **Ordering**: Sorted by timestamp and event type for fast range queries

## Usage

### Tracking Events from Frontend

```typescript
// Simple event tracking
import { useEventTracking } from '~/composables/useShoppingCart';

const { trackEvent } = useEventTracking();
trackEvent('view', productId);
```

### Tracking Search Events with Metadata

```typescript
import { useSearchTracking } from '~/composables/useSearchTracking';

const { trackSearch } = useSearchTracking();

trackSearch('laptop', 0, {
  resultsCount: 15,
  sortBy: 'relevance',
  deviceType: 'desktop',
  timeSpent: 5000
});
```

### Querying Events with JSON Functions

```sql
-- Extract and analyze search queries
SELECT 
    JSONExtractString(event_metadata, 'query') as search_query,
    count() as search_count,
    avg(JSONExtractInt(event_metadata, 'resultsCount')) as avg_results
FROM events 
WHERE event_type = 'search' AND search_query != ''
GROUP BY search_query
ORDER BY search_count DESC
LIMIT 20;

-- Analyze by device type
SELECT 
    JSONExtractString(event_metadata, 'deviceType') as device_type,
    count() as event_count,
    countIf(event_type = 'search') as searches,
    countIf(event_type = 'add_to_cart') as cart_additions
FROM events
GROUP BY device_type;

-- Search funnel analysis
SELECT 
    user_session,
    countIf(event_type = 'search') as searches,
    countIf(event_type = 'view') as views,
    countIf(event_type = 'add_to_cart') as cart_adds
FROM events
GROUP BY user_session
HAVING searches > 0;
```

## API Endpoint

**POST /api/event/track**

Request body:
```json
{
  "event_type": "search",
  "product_id": 0,
  "user_session": "session_123_abc",
  "event_metadata": {
    "query": "laptop",
    "resultsCount": 15,
    "deviceType": "desktop"
  }
}
```

Response:
```json
{
  "success": true
}
```

## Setup

### 1. Install ClickHouse

**Using Docker:**
```bash
docker run -d --name clickhouse-server \
  -p 8123:8123 -p 9000:9000 \
  --ulimit nofile=262144:262144 \
  clickhouse/clickhouse-server
```

**Using Package Manager:**
```bash
# Ubuntu/Debian
sudo apt-get install -y clickhouse-server clickhouse-client

# macOS
brew install clickhouse
```

### 2. Create Database and Table

```bash
clickhouse-client < database-migrations/002_create_clickhouse_events_table.sql
```

### 3. Configure Environment

Add to `.env`:
```
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DATABASE=default
```

## Performance Considerations

- **Batch Inserts**: For high-volume scenarios, consider batching events
- **Materialized Views**: Create materialized views for frequently accessed aggregations
- **Compression**: ClickHouse automatically compresses data efficiently
- **Memory**: Ensure adequate memory for query processing (8GB+ recommended)

## Monitoring Queries

```sql
-- Check table size
SELECT 
    formatReadableSize(sum(bytes)) as size,
    count() as parts,
    sum(rows) as rows
FROM system.parts
WHERE table = 'events' AND active;

-- Recent events
SELECT * FROM events ORDER BY created_at DESC LIMIT 10;

-- Event type distribution
SELECT event_type, count() as count 
FROM events 
GROUP BY event_type 
ORDER BY count DESC;
```

## Migration from MySQL

The old MySQL event table is kept for backward compatibility but is no longer used. All new events are written to ClickHouse.

To migrate existing data from MySQL to ClickHouse:

```sql
-- Export from MySQL
mysqldump -u root -p dm event --tab=/tmp --fields-terminated-by=','

-- Import to ClickHouse (adjust format as needed)
-- This is a manual process requiring data transformation
```
