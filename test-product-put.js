const http = require('http');

const putData = JSON.stringify({
  name: "Emerald Silk Ensemble",
  slug: "emerald-silk-ensemble",
  description: "Luxury pure silk stitched ensemble.",
  price: 15000,
  salePrice: null,
  sizes: ["S", "M", "L", "XL"],
  sizeChartUrl: null,
  isFeatured: true,
  isActive: true,
  categoryId: "cmq2b68c90001a6vk08m9a7n2", // Category ID from check-db.js
  images: ["/images/product-emerald.png"],
  sizeStocks: [
    { size: "S", stock: 10 },
    { size: "M", stock: 15 },
    { size: "L", stock: 20 },
    { size: "XL", stock: 5 }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/products/cmq2azixy00061wq66df9qvzs', // Product ID CUID from check-db.js
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': putData.length
  }
};

console.log("Sending PUT to /api/products/[id]...");
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(putData);
req.end();
