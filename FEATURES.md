# New Features Documentation

This document describes the new features added to the DM Frontend application.

## Features Overview

1. **Event Tracking System** - Track user interactions for analytics and ML
2. **Product Recommendations** - ML-powered product recommendations
3. **Shopping Cart** - Full-featured shopping cart with state management

---

## 1. Event Tracking System

### Overview
The event tracking system captures user interactions with products for analytics and machine learning purposes, using ClickHouse database for high-performance analytics.

### Tracked Events
- `view` - When a user views a product page
- `add_to_cart` - When a user adds a product to their shopping cart
- `search` - When a user searches for products (with rich metadata)
- `filter_applied` - When filters are applied to product listings
- `product_comparison` - When products are compared

### Implementation

#### Database Schema (ClickHouse)
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

#### Structured and Semi-Structured Data Support
ClickHouse supports complex event metadata through JSON strings stored in the `event_metadata` field:

**Search Event Example:**
```json
{
  "query": "laptop",
  "timestamp": 1700000000000,
  "resultsCount": 15,
  "filters": {"category": "electronics", "priceRange": "500-1000"},
  "sortBy": "relevance",
  "page": 1,
  "clickedPosition": 3,
  "timeSpent": 5432,
  "deviceType": "desktop",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

**Filter Applied Event Example:**
```json
{
  "filterType": "category",
  "filterValue": "electronics",
  "appliedFilters": {"category": "electronics", "brand": "Apple"},
  "timestamp": 1700000000000
}
```

**Product Comparison Event Example:**
```json
{
  "productIds": [123, 456, 789],
  "comparisonAttributes": ["price", "rating", "features"],
  "productCount": 3,
  "timestamp": 1700000000000
}
```

#### API Endpoint
**POST /api/event/track**

Request body:
```json
{
  "event_type": "view",
  "product_id": 123,
  "user_session": "session_abc123"
}
```

#### Usage in Code
```typescript
import { useEventTracking } from '~/composables/useShoppingCart';

const { trackEvent } = useEventTracking();

// Track a product view
trackEvent('view', productId);

// Track add to cart
trackEvent('add_to_cart', productId);
```

### Session Management
- User sessions are automatically generated and stored in localStorage
- Session ID format: `session_[timestamp]_[random]`
- Sessions persist across browser sessions

---

## 2. Product Recommendations

### Overview
ML-powered product recommendations appear on product detail pages, showing relevant products based on the currently viewed item.

### Implementation

#### API Endpoint
**GET /api/recommendations/:productId**

Returns an array of recommended products:
```json
[
  {
    "product_id": 456,
    "slug": "recommended-product",
    "name": "Recommended Product",
    "description": "Product description",
    "img_url": "https://example.com/image.jpg"
  }
]
```

#### ML Service Integration
- The application expects an ML service running on `http://127.0.0.1:3001`
- Proxy configured in `nuxt.config.ts` under `/ml/**`
- Graceful degradation: If ML service is unavailable, no recommendations are shown

#### Mock ML Service
For development, use the provided mock service:
```bash
cd ml-service-mock
node server.js
```

#### Usage on Product Pages
Recommendations are automatically fetched and displayed on product detail pages when available.

---

## 3. Shopping Cart

### Overview
A complete shopping cart implementation with state management, allowing users to add, remove, and manage products.

### Features
- Add products to cart from shop or product pages
- View cart with all items
- Update quantities
- Remove items
- Clear entire cart
- Persistent state across page navigation
- Cart badge in header showing item count

### Implementation

#### State Management
The cart uses Nuxt's `useState` for reactive state management:

```typescript
const { 
  cart,           // Array of cart items
  addToCart,      // Add a product
  removeFromCart, // Remove a product
  updateQuantity, // Update item quantity
  clearCart,      // Clear all items
  totalItems,     // Total number of items (computed)
  totalPrice      // Total price (computed)
} = useShoppingCart();
```

#### Cart Item Interface
```typescript
interface CartItem {
  product_id: number;
  slug: string;
  name: string;
  img_url: string;
  price: number;
  quantity: number;
}
```

#### Adding to Cart
```typescript
addToCart({
  product_id: product.product_id,
  slug: product.slug,
  name: product.name,
  img_url: product.img_url,
  price: 15,
});
```

#### Cart Page
View and manage cart at `/cart`

#### Header Badge
The navigation header shows a badge with the cart item count, linking to the cart page.

---

## Setup Instructions

### 1. Database Setup

#### MySQL Database (for products, categories, SEO data)
The application uses MySQL with Drizzle ORM for core Nuxt data:
```bash
mysql -u root -p dm < database-migrations/001_create_event_table.sql
```

#### ClickHouse Database (for event tracking)
Event tracking now uses ClickHouse for high-performance analytics:
```bash
# Option 1: Using clickhouse-client CLI
clickhouse-client --query "$(cat database-migrations/002_create_clickhouse_events_table.sql)"

# Option 2: Using HTTP interface
cat database-migrations/002_create_clickhouse_events_table.sql | curl 'http://localhost:8123/' --data-binary @-

# Option 3: Direct query via clickhouse-client
clickhouse-client < database-migrations/002_create_clickhouse_events_table.sql
```

### 2. Environment Configuration
Copy `.env.sample` to `.env` and configure both databases:
```bash
cp .env.sample .env
```

Edit `.env` with your database credentials:
```
# MySQL Configuration (for Nuxt data)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dm
DB_USER=root
DB_PASSWORD=your_password

# ClickHouse Configuration (for event tracking)
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DATABASE=default
```

### 3. Start ML Service (Optional)
For recommendations to work, start the ML service:
```bash
cd ml-service-mock
node server.js
```

### 4. Start Application
```bash
npm run dev
```

---

## File Structure

```
app/
├── composables/
│   ├── useShoppingCart.ts       # Shopping cart composable with event tracking
│   └── useSearchTracking.ts     # Search event tracking (demonstrates structured data)
├── pages/
│   ├── cart/
│   │   └── index.vue            # Cart page
│   ├── product/
│   │   └── [slug].vue           # Product page (with tracking & recommendations)
│   └── shop/
│       └── index.vue            # Shop page (with search and add to cart)
└── layouts/
    └── default.vue              # Layout with cart badge

server/
├── api/
│   ├── event/
│   │   └── track.post.ts        # Event tracking endpoint (ClickHouse)
│   └── recommendations/
│       └── [id].get.ts          # Recommendations endpoint
└── database/
    ├── connection.ts            # MySQL connection (Drizzle ORM)
    ├── clickhouse-connection.ts # ClickHouse connection
    └── schemas/
        ├── event.schema.ts      # Event schema (legacy, not used)
        ├── product.schema.ts    # Product schema (MySQL)
        └── seo.schema.ts        # SEO schema (MySQL)

ml-service-mock/
├── server.js                    # Mock ML service
└── README.md

database-migrations/
├── 001_create_event_table.sql           # MySQL event table (legacy)
└── 002_create_clickhouse_events_table.sql # ClickHouse events table
```
```

---

## Performance Considerations

### Event Tracking
- Events are tracked asynchronously
- Failed event tracking does not block user interactions
- Session IDs are cached in localStorage

### Recommendations
- Recommendations are fetched on component mount
- Failed requests are caught and logged
- No recommendations shown if service is unavailable

### Shopping Cart
- Cart state is stored in memory (Nuxt useState)
- Cart persists across navigation within the same session
- Cart data is reactive and updates immediately

---

## Future Enhancements

Potential improvements:
1. Persist cart to localStorage or database
2. User authentication and cart synchronization
3. More event types (search, filter, purchase)
4. Advanced ML recommendations based on user history
5. A/B testing for recommendation algorithms
6. Analytics dashboard for event data
7. Cart abandonment tracking
8. Product wishlist functionality
