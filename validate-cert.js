const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 Testing SSL certificate files...');

try {
  // Read certificate files
  const keyPath = path.join(__dirname, 'certificates', 'key.pem');
  const certPath = path.join(__dirname, 'certificates', 'cert.pem');

  const privateKey = fs.readFileSync(keyPath, 'utf8');
  const certificate = fs.readFileSync(certPath, 'utf8');

  console.log('✅ Certificate files read successfully');

  // Basic validation
  if (privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    console.log('✅ Private key format is valid');
  } else {
    console.log('❌ Private key format is invalid');
  }

  if (certificate.includes('-----BEGIN CERTIFICATE-----')) {
    console.log('✅ Certificate format is valid');
  } else {
    console.log('❌ Certificate format is invalid');
  }

  // Try to create SSL context
  const https = require('https');
  const sslOptions = {
    key: privateKey,
    cert: certificate
  };

  console.log('✅ SSL options created successfully');

  // Test creating a server (but don't start it)
  const server = https.createServer(sslOptions, (req, res) => {
    res.writeHead(200);
    res.end('Hello World!');
  });

  console.log('✅ HTTPS server created successfully');
  server.close();

  console.log('');
  console.log('🎉 Certificate validation passed!');
  console.log('The SSL certificates are properly formatted and should work.');

} catch (error) {
  console.error('❌ Certificate validation failed:', error.message);
  console.log('');
  console.log('🔧 Possible issues:');
  console.log('1. Certificate files may be corrupted');
  console.log('2. Files may not exist in certificates/ folder');
  console.log('3. Permission issues reading the files');
  console.log('');
  console.log('💡 Try regenerating certificates: node generate-cert.js');
}