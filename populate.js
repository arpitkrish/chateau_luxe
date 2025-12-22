require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Food = require('./models/Food');
const { Facility } = require('./models/Facility');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const populateDB = async () => {
  await connectDB();

  // Drop database to start fresh
  await mongoose.connection.db.dropDatabase();
  console.log('Database dropped');

  // Add rooms
  const rooms = [
    {
      type: 'Deluxe Room',
      price: 12000,
      capacity: 2,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
      available: true,
      image: '/images/deluxe-room.jpg'
    },
    {
      type: 'Suite',
      price: 20000,
      capacity: 4,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      available: true,
      image: '/images/suite.jpg'
    },
    {
      type: 'Standard Room',
      price: 8000,
      capacity: 2,
      amenities: ['WiFi', 'AC', 'TV'],
      available: true,
      image: '/images/standard-room.jpg'
    },
    {
      type: 'Executive Suite',
      price: 28000,
      capacity: 6,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi'],
      available: true,
      image: '/images/executive-suite.jpg'
    },
    {
      type: 'Presidential Suite',
      price: 40000,
      capacity: 8,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Private Chef'],
      available: true,
      image: '/images/presidential-suite.jpg'
    },
    {
      type: 'Family Suite',
      price: 25000,
      capacity: 5,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Kitchen'],
      available: true,
      image: '/images/family-suite.jpg'
    }
  ];

  await Room.insertMany(rooms);
  console.log('Rooms added');

  const foods = [
    {
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      price: 350,
      category: 'Main Course',
      image: '/images/butter-chicken.jpg',
      available: true,
      ingredients: ['Chicken', 'Butter', 'Cream', 'Spices'],
      spicy: false,
      vegetarian: false
    },
    {
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese grilled to perfection',
      price: 250,
      category: 'Appetizer',
      image: '/images/paneer-tikka.jpg',
      available: true,
      ingredients: ['Paneer', 'Yogurt', 'Spices'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Biryani',
      description: 'Fragrant basmati rice with spices and meat',
      price: 300,
      category: 'Main Course',
      image: '/images/biryani.jpg',
      available: true,
      ingredients: ['Basmati Rice', 'Chicken/Mutton', 'Spices', 'Onions'],
      spicy: true,
      vegetarian: false
    },
    {
      name: 'Ras Malai',
      description: 'Soft cheese dumplings in sweetened cardamom syrup',
      price: 150,
      category: 'Dessert',
      image: '/images/ras-malai.jpg',
      available: true,
      ingredients: ['Milk', 'Sugar', 'Cardamom'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 80,
      category: 'Beverage',
      image: '/images/masala-chai.jpg',
      available: true,
      ingredients: ['Tea', 'Milk', 'Spices', 'Ginger'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Palak Paneer',
      description: 'Spinach and cottage cheese curry',
      price: 280,
      category: 'Main Course',
      image: '/images/palak-paneer.jpg',
      available: true,
      ingredients: ['Spinach', 'Paneer', 'Spices', 'Cream'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Chicken 65',
      description: 'Spicy, deep-fried chicken bites',
      price: 220,
      category: 'Appetizer',
      image: '/images/chicken-65.jpg',
      available: true,
      ingredients: ['Chicken', 'Red Chilies', 'Garlic', 'Curry Leaves'],
      spicy: true,
      vegetarian: false
    },
    {
      name: 'Gulab Jamun',
      description: 'Warm milk dumplings in rose syrup',
      price: 120,
      category: 'Dessert',
      image: '/images/gulab-jamun.jpg',
      available: true,
      ingredients: ['Milk', 'Sugar', 'Rose Water'],
      spicy: false,
      vegetarian: true
    },
    {
      name: 'Aloo Gobi',
      description: 'Potatoes and cauliflower with Indian spices',
      price: 200,
      category: 'Main Course',
      image: '/images/aloo-gobi.jpg',
      available: true,
      ingredients: ['Potatoes', 'Cauliflower', 'Onions', 'Spices'],
      spicy: true,
      vegetarian: true
    },
    {
      name: 'Lassi',
      description: 'Traditional yogurt-based drink',
      price: 100,
      category: 'Beverage',
      image: '/images/lassi.jpg',
      available: true,
      ingredients: ['Yogurt', 'Sugar', 'Cardamom'],
      spicy: false,
      vegetarian: true
    },
    // Additional Appetizers
    {
      name: 'Samosa',
      description: 'Crispy fried pastry filled with spiced potatoes and peas',
      price: 80,
      category: 'Appetizer',
      image: 'https://images.unsplash.com/photo-1601050690298-85ee44c31195?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1626132647523-66c4c1b5c6b7?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=center',
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
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&crop=center',
      available: true,
      ingredients: ['Milk', 'Nuts', 'Spices', 'Saffron'],
      spicy: false,
      vegetarian: true
    }
  ];
  await Food.insertMany(foods);
  console.log('Foods added');

  // Add facilities
  const facilities = [
    {
      name: 'Swimming Pool',
      description: 'Outdoor pool with lounge chairs',
      price: 0,
      capacity: 50,
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop&crop=center',
      timeSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      name: 'Gym',
      description: 'Fully equipped fitness center',
      price: 0,
      capacity: 20,
      image: '/images/gym.jpg',
      timeSlots: ['06:00-07:00', '07:00-08:00', '08:00-09:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      name: 'Spa',
      description: 'Relaxing spa treatments',
      price: 2000,
      capacity: 5,
      image: '/images/spa.jpg',
      timeSlots: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    {
      name: 'Conference Room',
      description: 'Meeting room for events',
      price: 5000,
      capacity: 30,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
      timeSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      name: 'Parking',
      description: 'Secure parking lot',
      price: 200,
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop&crop=center',
      timeSlots: ['00:00-23:59'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  ];

  await Facility.insertMany(facilities);
  console.log('Facilities added');

  console.log('Database populated');
  process.exit(0);
};

populateDB().catch(console.error);