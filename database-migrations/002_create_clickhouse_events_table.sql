-- Migration: Create event tracking table in ClickHouse
-- Description: This table stores user events for analytics and ML recommendations
--              Demonstrates ClickHouse's support for structured and semi-structured data
-- Date: 2025-11-24

CREATE TABLE IF NOT EXISTS events (
    event_id UUID DEFAULT generateUUIDv4(),
    event_type String COMMENT 'Type of event: view, add_to_cart, search, filter_applied, product_comparison, etc.',
    product_id Int32 COMMENT 'ID of the product associated with the event (0 for non-product events)',
    user_session String COMMENT 'Session identifier for tracking users across requests',
    event_metadata String DEFAULT '{}' COMMENT 'JSON string containing structured/semi-structured event data',
    created_at DateTime DEFAULT now() COMMENT 'When the event occurred',
    
    -- Indexes for better query performance
    INDEX idx_product_id product_id TYPE minmax GRANULARITY 4,
    INDEX idx_event_type event_type TYPE set(0) GRANULARITY 4,
    INDEX idx_user_session user_session TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
ORDER BY (created_at, event_type)
PARTITION BY toYYYYMM(created_at)
TTL created_at + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;

-- Example queries:
-- Get all product views: 
-- SELECT * FROM events WHERE event_type = 'view' LIMIT 100;

-- Get events for a specific product: 
-- SELECT * FROM events WHERE product_id = 123 LIMIT 100;

-- Get user session history: 
-- SELECT * FROM events WHERE user_session = 'session_xyz' LIMIT 100;

-- Query search events with metadata (demonstrates structured data support):
-- SELECT 
--     event_id,
--     event_type,
--     user_session,
--     JSONExtractString(event_metadata, 'query') as search_query,
--     JSONExtractInt(event_metadata, 'resultsCount') as results_count,
--     JSONExtractString(event_metadata, 'deviceType') as device_type,
--     created_at
-- FROM events 
-- WHERE event_type = 'search' 
-- ORDER BY created_at DESC 
-- LIMIT 100;

-- Analyze search patterns by device type:
-- SELECT 
--     JSONExtractString(event_metadata, 'deviceType') as device_type,
--     count() as search_count,
--     avg(JSONExtractInt(event_metadata, 'resultsCount')) as avg_results
-- FROM events 
-- WHERE event_type = 'search'
-- GROUP BY device_type;

-- Find popular search queries:
-- SELECT 
--     JSONExtractString(event_metadata, 'query') as search_query,
--     count() as search_count,
--     avg(JSONExtractInt(event_metadata, 'resultsCount')) as avg_results
-- FROM events 
-- WHERE event_type = 'search' AND search_query != ''
-- GROUP BY search_query
-- ORDER BY search_count DESC
-- LIMIT 20;
