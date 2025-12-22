const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing minimal HTTPS server...');

// SSL Certificate options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem'))
};

const server = https.createServer(sslOptions, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from HTTPS server!\n');
});

server.listen(3000, () => {
  console.log('✅ Minimal HTTPS server started on port 3000');
  console.log('🌐 Test URL: https://localhost:3000');
  console.log('Press Ctrl+C to stop the server');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});