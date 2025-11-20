# ML Service Integration

## Overview

The application integrates with an ML (Machine Learning) service for product recommendations. The ML service should run on `http://127.0.0.1:3001` and provide recommendation endpoints.

## API Endpoints

### GET /recommendations/:productId

Returns an array of recommended products based on the given product ID.

**Request:**
```
GET http://127.0.0.1:3001/recommendations/123
```

**Response:**
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

## Mock ML Service (for Development)

For development and testing purposes, you can use the provided mock ML service.

### Running the Mock Service

```bash
cd ml-service-mock
node server.js
```

The mock service will:
- Run on port 3001
- Return a simple list of recommended products
- Work even when the database is not available

## Event Tracking

The application tracks user events including:
- `view` - When a user views a product page
- `add_to_cart` - When a user adds a product to their cart

Events are stored in the `event` table in the database and can be used by the ML service to improve recommendations.

## Database Schema

The event tracking table schema:

```sql
CREATE TABLE event (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    user_session VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Integration Notes

- If the ML service is not available, the application will gracefully handle the error and display no recommendations
- The ML service proxy is configured in `nuxt.config.ts` under `/ml/**` routes
- Session IDs are generated and stored in localStorage for tracking user behavior across sessions
