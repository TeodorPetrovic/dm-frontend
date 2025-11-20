# Mock ML Recommendation Service

A simple HTTP server that mocks an ML recommendation service for development and testing.

## Running the Service

```bash
node server.js
```

The service will start on `http://127.0.0.1:3001`

## Endpoints

### GET /recommendations/:productId

Returns mock product recommendations for the given product ID.

**Example:**
```bash
curl http://127.0.0.1:3001/recommendations/1
```

### GET /health

Health check endpoint.

**Example:**
```bash
curl http://127.0.0.1:3001/health
```

## Notes

- This is a mock service for development only
- Returns random product recommendations from a predefined list
- Does not require a database or ML model
- Supports CORS for local development
