const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/food',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const foods = JSON.parse(data);
      console.log(`Total food items: ${foods.length}`);

      // Count items by category
      const categories = {};
      foods.forEach(food => {
        categories[food.category] = (categories[food.category] || 0) + 1;
      });

      console.log('Items by category:');
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} items`);
      });

      // Show some new items
      console.log('\nNew items added:');
      const newItems = ['Samosa', 'Pakora', 'Chicken Tikka', 'Fish Curry', 'Mutton Rogan Josh', 'Dal Makhani', 'Chana Masala', 'Pani Puri', 'Kachori', 'Jalebi', 'Ras Gulla', 'Kulfi', 'Coffee', 'Fresh Juice', 'Mocktail', 'Thandai'];
      foods.filter(food => newItems.includes(food.name)).forEach(food => {
        console.log(`  - ${food.name} (${food.category}) - ₹${food.price}`);
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