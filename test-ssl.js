const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Test SSL connection using TLS
function testSSLConnection() {
  console.log('🧪 Testing SSL connection to localhost:3000...');

  const options = {
    host: 'localhost',
    port: 3000,
    rejectUnauthorized: false, // Allow self-signed certificates
    timeout: 5000
  };

  const socket = tls.connect(options, () => {
    console.log('✅ SSL Connection successful!');
    console.log(`🔒 Protocol: ${socket.getProtocol()}`);
    console.log(`🔐 Cipher: ${socket.getCipher().name}`);

    // Send a simple HTTP request
    socket.write('GET / HTTP/1.1\r\n');
    socket.write('Host: localhost\r\n');
    socket.write('Connection: close\r\n');
    socket.write('\r\n');
  });

  let response = '';
  socket.on('data', (data) => {
    response += data.toString();
  });

  socket.on('end', () => {
    console.log('📄 Response received');
    console.log('');
    console.log('🎉 SSL Certificate setup is working correctly!');
    console.log('');
    console.log('🌐 To access your application:');
    console.log('   https://localhost:3000');
    console.log('');
    console.log('⚠️  Browser Warning: You may see a "Not Secure" warning due to self-signed certificate.');
    console.log('   Click "Advanced" and "Proceed to localhost (unsafe)" to continue.');
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.error('❌ SSL Connection failed:', err.message);
    console.error('Error code:', err.code);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: node server.js');
    console.log('2. Check that certificate files exist in certificates/ folder');
    console.log('3. Verify port 3000 is not blocked by firewall');
    console.log('4. Try accessing https://localhost:3000 in your browser');
  });

  socket.on('timeout', () => {
    console.error('❌ Connection timeout after 5 seconds');
    socket.destroy();
  });
}

// Check certificate files
function checkCertificates() {
  const certPath = path.join(__dirname, 'certificates', 'cert.pem');
  const keyPath = path.join(__dirname, 'certificates', 'key.pem');

  console.log('🔍 Checking certificate files...');

  if (fs.existsSync(certPath)) {
    console.log('✅ Certificate file found: certificates/cert.pem');
  } else {
    console.log('❌ Certificate file missing: certificates/cert.pem');
  }

  if (fs.existsSync(keyPath)) {
    console.log('✅ Private key file found: certificates/key.pem');
  } else {
    console.log('❌ Private key file missing: certificates/key.pem');
  }

  console.log('');
}

checkCertificates();
testSSLConnection();