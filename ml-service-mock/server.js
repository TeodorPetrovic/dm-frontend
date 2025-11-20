const http = require('http');

const PORT = 3001;

// Mock product data for recommendations
const mockProducts = [
  {
    product_id: 1,
    slug: "recommended-product-1",
    name: "Recommended Product 1",
    description: "This is a great product you might like!",
    img_url: "https://picsum.photos/seed/rec1/400/400"
  },
  {
    product_id: 2,
    slug: "recommended-product-2",
    name: "Recommended Product 2",
    description: "Another excellent choice based on your interests.",
    img_url: "https://picsum.photos/seed/rec2/400/400"
  },
  {
    product_id: 3,
    slug: "recommended-product-3",
    name: "Recommended Product 3",
    description: "Customers who viewed this also liked this.",
    img_url: "https://picsum.photos/seed/rec3/400/400"
  }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // Handle recommendations endpoint
  if (url.pathname.startsWith('/recommendations/')) {
    const productId = url.pathname.split('/')[2];
    
    console.log(`[ML Service] Received recommendation request for product ID: ${productId}`);
    
    // Return random subset of mock products (excluding the requested product)
    const recommendations = mockProducts
      .filter(p => p.product_id.toString() !== productId)
      .slice(0, 2); // Return 2 recommendations
    
    res.writeHead(200);
    res.end(JSON.stringify(recommendations));
    return;
  }

  // Health check endpoint
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'ML Recommendations Mock' }));
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock ML Service running at http://127.0.0.1:${PORT}/`);
  console.log(`Health check: http://127.0.0.1:${PORT}/health`);
  console.log(`Recommendations: http://127.0.0.1:${PORT}/recommendations/:productId`);
});
