const http = require('http');

function testAPI(endpoint, name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const items = JSON.parse(data);
          console.log(`${name}: ${items.length} items found`);
          if (items.length > 0) {
            console.log(`  Sample: ${items[0].name || items[0].type}`);
          }
          resolve(items);
        } catch (error) {
          console.error(`Error parsing ${name} response:`, error);
          console.log('Raw response:', data.substring(0, 200));
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Request error for ${name}:`, error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${name}`));
    });

    req.end();
  });
}

async function testAllAPIs() {
  try {
    console.log('Testing APIs...\n');

    await testAPI('/api/food', 'Food');
    await testAPI('/api/rooms', 'Rooms');
    await testAPI('/api/facilities', 'Facilities');

    console.log('\nAll APIs tested successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAllAPIs();