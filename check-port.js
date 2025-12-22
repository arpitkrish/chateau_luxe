const net = require('net');

// Simple port check
function checkPort(port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.connect(port, 'localhost', () => {
      console.log(`✅ Port ${port} is open and accepting connections`);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', (err) => {
      console.log(`❌ Port ${port} connection failed: ${err.message}`);
      reject(err);
    });

    socket.setTimeout(5000, () => {
      console.log(`❌ Port ${port} connection timeout`);
      socket.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testConnection() {
  console.log('🔍 Checking if port 3000 is accessible...');

  try {
    await checkPort(3000);
    console.log('');
    console.log('🎉 Port 3000 is working! Your HTTPS server should be accessible.');
    console.log('🌐 Try opening: https://localhost:3000');
    console.log('');
    console.log('⚠️  Remember: You may see a security warning for self-signed certificate.');
    console.log('   Click "Advanced" → "Proceed to localhost (unsafe)" to continue.');
  } catch (error) {
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: node server.js');
    console.log('2. Check firewall settings');
    console.log('3. Try a different port if 3000 is blocked');
  }
}

testConnection();