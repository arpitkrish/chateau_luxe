const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/facilities',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const facilities = JSON.parse(data);
      console.log('Current facilities in database:');
      facilities.forEach(facility => {
        console.log(`${facility.name}: ${facility.image}`);
      });
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();