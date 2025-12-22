require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addNewFoods = async () => {
  await connectDB();

  const newFoods = [
    // Additional Appetizers
    {
      name: 'Samosa',
      description: 'Crispy fried pastry filled with spiced potatoes and peas',
      price: 80,
      category: 'Appetizer',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Potatoes', 'Peas', 'Spices', 'Pastry'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Pakora',
      description: 'Assorted vegetable fritters dipped in chickpea batter',
      price: 120,
      category: 'Appetizer',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Mixed Vegetables', 'Chickpea Flour', 'Spices'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Chicken Tikka',
      description: 'Tender chicken pieces marinated in yogurt and spices',
      price: 280,
      category: 'Appetizer',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Chicken', 'Yogurt', 'Red Chilies', 'Ginger'],
      spicy: true,
      vegetarian: false
    },
    // Additional Main Courses
    {
      name: 'Fish Curry',
      description: 'Fresh fish cooked in coconut milk with aromatic spices',
      price: 320,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Fish', 'Coconut Milk', 'Spices', 'Curry Leaves'],
      spicy: true,
      vegetarian: false
    },
    {
      name: 'Mutton Rogan Josh',
      description: 'Kashmiri style mutton curry with Kashmiri chilies',
      price: 380,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Mutton', 'Kashmiri Chilies', 'Yogurt', 'Spices'],
      spicy: true,
      vegetarian: false
    },
    {
      name: 'Dal Makhani',
      description: 'Creamy black lentils slow-cooked with butter and cream',
      price: 220,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Black Lentils', 'Butter', 'Cream', 'Spices'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Chana Masala',
      description: 'Chickpeas cooked with tomatoes and aromatic spices',
      price: 180,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Chickpeas', 'Tomatoes', 'Onions', 'Spices'],
      spicy: true,
      vegetarian: true
    },
    // Additional Desserts
    {
      name: 'Pani Puri',
      description: 'Hollow puris filled with spiced water, tamarind chutney and potatoes',
      price: 100,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Puris', 'Potatoes', 'Tamarind', 'Spices'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Kachori',
      description: 'Deep-fried pastry filled with spiced lentils and potatoes',
      price: 90,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Lentils', 'Potatoes', 'Spices', 'Pastry'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Jalebi',
      description: 'Crispy, deep-fried spirals soaked in saffron syrup',
      price: 130,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Flour', 'Sugar', 'Saffron', 'Ghee'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Ras Gulla',
      description: 'Spongy cheese dumplings in light sugar syrup',
      price: 140,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Milk', 'Sugar', 'Cardamom'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Kulfi',
      description: 'Indian ice cream made with condensed milk and nuts',
      price: 160,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Condensed Milk', 'Nuts', 'Cardamom', 'Saffron'],
      spicy: false,
      vegetarian: true
    },
    // Additional Beverages
    {
      name: 'Coffee',
      description: 'Freshly brewed aromatic coffee',
      price: 120,
      category: 'Beverage',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Coffee Beans', 'Milk', 'Sugar'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Fresh Juice',
      description: 'Freshly squeezed seasonal fruit juice',
      price: 150,
      category: 'Beverage',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Seasonal Fruits', 'Sugar'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Mocktail',
      description: 'Refreshing non-alcoholic mixed drink',
      price: 180,
      category: 'Beverage',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Mixed Fruits', 'Soda', 'Herbs'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Thandai',
      description: 'Traditional Indian cold drink with nuts and spices',
      price: 140,
      category: 'Beverage',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Milk', 'Nuts', 'Spices', 'Saffron'],
      spicy: false,
      vegetarian: true
    }
  ];

  try {
    await Food.insertMany(newFoods);
    console.log(`${newFoods.length} new food items added successfully`);
  } catch (error) {
    console.error('Error adding new foods:', error);
  }

  process.exit(0);
};

addNewFoods().catch(console.error);