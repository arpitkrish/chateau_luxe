require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const path = require('path');
const https = require('https');
const fs = require('fs');
const Logger = require('./utils/logger');
const FileHandler = require('./utils/fileHandler');
const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const foodRoutes = require('./routes/food');
const facilityRoutes = require('./routes/facilities');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const { auth, adminAuth } = require('./middleware/auth');

// Models
const User = require('./models/User');
const Booking = require('./models/Booking');
const { FacilityBooking } = require('./models/Facility');
const Room = require('./models/Room');
const { Facility } = require('./models/Facility');

const app = express();
const logger = new Logger();

// Initialize Redis client
let redisClient;
try {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
  });
  
  redisClient.connect().catch((err) => {
    console.warn('⚠️  Redis connection failed, running without caching:', err.message);
    redisClient = null;
  });
} catch (error) {
  console.warn('⚠️  Redis not available, running without caching:', error.message);
  redisClient = null;
}

// Connect to MongoDB (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch((error) => {
    console.error('Database connection failed:', error);
    console.log('⚠️  Continuing without database connection...');
  });
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  store: redisClient ? new RedisStore({ client: redisClient }) : undefined,
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Redis Caching Middleware
const cache = (duration) => {
  return async (req, res, next) => {
    // Skip caching if Redis is not available
    if (!redisClient) {
      return next();
    }
    
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`Cache hit for: ${key}`);
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original send method
      const originalSend = res.json;
      
      // Override json method to cache response
      res.json = function(data) {
        if (redisClient) {
          redisClient.setEx(key, duration, JSON.stringify(data));
          console.log(`Cache set for: ${key}`);
        }
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Cache invalidation functions
const invalidateCache = async (pattern) => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Invalidated cache keys: ${keys.join(', ')}`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files with cache headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', cache(process.env.CACHE_TTL || 3600), roomRoutes); // Cache rooms for 1 hour
app.use('/api/food', cache(process.env.CACHE_TTL || 1800), foodRoutes); // Cache food for 30 minutes
app.use('/api/facilities', cache(process.env.CACHE_TTL || 3600), facilityRoutes); // Cache facilities for 1 hour
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Auth check endpoint
app.get('/api/auth/check', auth, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Home page
app.get('/', async (req, res) => {
  try {
    // Check if user is authenticated by verifying token
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('name email role');
      } catch (error) {
        // Token is invalid, user remains null
        console.log('Invalid token, user not authenticated');
      }
    }

    res.render('index', { title: 'Chateau Luxe', user });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('index', { title: 'Chateau Luxe', user: null });
  }
});

// Rooms page
app.get('/rooms', async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('name email role');
      } catch (error) {
        // Token is invalid
      }
    }

    res.render('rooms', { title: 'Rooms - Chateau Luxe', user });
  } catch (error) {
    console.error('Rooms page error:', error);
    res.render('rooms', { title: 'Rooms - Chateau Luxe', user: null });
  }
});

// Food page
app.get('/food', async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('name email role');
      } catch (error) {
        // Token is invalid
      }
    }

    res.render('food', { title: 'Dining - Chateau Luxe', user });
  } catch (error) {
    console.error('Food page error:', error);
    res.render('food', { title: 'Dining - Chateau Luxe', user: null });
  }
});

// Facilities page
app.get('/facilities', async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('name email role');
      } catch (error) {
        // Token is invalid
      }
    }

    res.render('facilities', { title: 'Facilities - Chateau Luxe', user });
  } catch (error) {
    console.error('Facilities page error:', error);
    res.render('facilities', { title: 'Facilities - Chateau Luxe', user: null });
  }
});

// Contact page
app.get('/contact', async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('name email role');
      } catch (error) {
        // Token is invalid
      }
    }

    res.render('contact', { title: 'Contact - Chateau Luxe', user });
  } catch (error) {
    console.error('Contact page error:', error);
    res.render('contact', { title: 'Contact - Chateau Luxe', user: null });
  }
});

// Profile page
app.get('/profile', auth, (req, res) => {
  res.render('profile', { title: 'Profile - Chateau Luxe', user: req.user });
});

// My bookings page
app.get('/my-bookings', auth, (req, res) => {
  res.render('my-bookings', { title: 'My Bookings - Chateau Luxe', user: req.user });
});

// My orders page
app.get('/my-orders', auth, (req, res) => {
  res.render('my-orders', { title: 'My Orders - Chateau Luxe', user: req.user });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Register page
app.get('/register', (req, res) => {
  res.render('register');
});

// Checkout page
app.get('/checkout', auth, (req, res) => {
  res.render('checkout', { title: 'Checkout - Chateau Luxe', user: req.user });
});

// Payment success page
app.get('/payment-success', auth, (req, res) => {
  const orderId = req.query.order_id;
  res.render('payment-success', { title: 'Payment Success - Chateau Luxe', user: req.user, orderId });
});

// Admin panel
app.get('/admin/bookings', auth, adminAuth, (req, res) => {
  res.render('admin-bookings', { title: 'Admin Panel - Chateau Luxe', user: req.user });
});

// Integration tests page
app.get('/integration-tests', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'integration-tests.html'));
});

// Redis showcase page
app.get('/redis-showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'redis-showcase.html'));
});

// Create Razorpay order
app.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Check if Razorpay keys are configured (skip in development)
    if (process.env.NODE_ENV !== 'development' && (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
        process.env.RAZORPAY_KEY_ID.includes('YOUR') ||
        process.env.RAZORPAY_KEY_SECRET.includes('your'))) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.'
      });
    }

    let order;
    if (process.env.NODE_ENV === 'development') {
      // Mock order for development
      order = {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR'
      };
    } else {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      order = await razorpay.orders.create(options);
    }

    // Store order details in database (you might want to create an Order model)
    // For now, we'll just return the order

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Verify Razorpay payment
app.post('/verify-payment', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      items
    } = req.body;

    // Skip signature verification in development mode
    if (process.env.NODE_ENV !== 'development') {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
      }
    }

    // Payment verified successfully - now create bookings and orders
    const Booking = require('./models/Booking');
    const { FacilityBooking } = require('./models/Facility');
    const Room = require('./models/Room');
    const { Facility } = require('./models/Facility');
    const Order = require('./models/Order');
    const Food = require('./models/Food');

    const createdBookings = [];
    const createdFacilityBookings = [];
    const createdOrders = [];

    // Process each item in the cart
    for (const item of items) {
      if (item.type === 'room') {
        // Create room booking
        const room = await Room.findById(item.id);
        if (!room) {
          console.error(`Room not found: ${item.id}`);
          continue;
        }

        const booking = new Booking({
          user: req.user._id,
          room: item.id,
          checkIn: new Date(item.details.checkIn),
          checkOut: new Date(item.details.checkOut),
          guests: parseInt(item.details.guests) || 1,
          totalPrice: parseFloat(item.price),
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        });

        await booking.save();
        createdBookings.push(booking);
        console.log(`Created room booking: ${booking._id}`);

      } else if (item.type === 'facility') {
        // Create facility booking
        const facility = await Facility.findById(item.id);
        if (!facility) {
          console.error(`Facility not found: ${item.id}`);
          continue;
        }

        const facilityBooking = new FacilityBooking({
          user: req.user._id,
          facility: item.id,
          date: new Date(item.details.date),
          timeSlot: item.details.timeSlot,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        });

        await facilityBooking.save();
        createdFacilityBookings.push(facilityBooking);
        console.log(`Created facility booking: ${facilityBooking._id}`);

      } else if (item.type === 'food') {
        // Create food order
        const food = await Food.findById(item.id);
        if (!food || !food.available) {
          console.error(`Food item not found or unavailable: ${item.id}`);
          continue;
        }

        const orderItems = [{
          food: item.id,
          quantity: item.quantity,
          price: food.price * item.quantity
        }];

        const order = new Order({
          user: req.user._id,
          items: orderItems,
          totalPrice: food.price * item.quantity,
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          paymentStatus: 'paid'
        });

        await order.save();
        createdOrders.push(order);
        console.log(`Created food order: ${order._id}`);
      }
    }

    console.log(`Created ${createdBookings.length} room bookings, ${createdFacilityBookings.length} facility bookings, and ${createdOrders.length} food orders`);

    // Invalidate relevant caches after creation
    if (createdBookings.length > 0) {
      await invalidateCache('cache:/api/rooms*');
    }
    if (createdFacilityBookings.length > 0) {
      await invalidateCache('cache:/api/facilities*');
    }
    if (createdOrders.length > 0) {
      await invalidateCache('cache:/api/food*');
    }

    // Set session flags for UI refresh (will be checked by frontend)
    // Note: This is a simple approach - in production, you might use WebSockets or Server-Sent Events

    res.json({
      success: true,
      message: 'Payment verified successfully and bookings/orders created',
      paymentId: razorpay_payment_id || `mock_payment_${Date.now()}`,
      orderId: razorpay_order_id || `mock_order_${Date.now()}`,
      bookingsCreated: createdBookings.length,
      facilityBookingsCreated: createdFacilityBookings.length,
      ordersCreated: createdOrders.length
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Dashboard - redirect to home page
app.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', { title: 'Dashboard - Chateau Luxe', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

// Export app for testing
module.exports = app;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // SSL Certificate options
let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem'))
  };
  console.log('✅ SSL certificates loaded successfully');
} catch (error) {
  console.error('❌ Error loading SSL certificates:', error.message);
  console.log('🔄 Falling back to HTTP server...');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🔓 HTTP Server running on port ${PORT} (SSL certificates not found)`);
    console.log(`🌐 Access your application at: http://localhost:${PORT}`);
  });
  process.exit(0);
}

// Start HTTPS server
const server = https.createServer(sslOptions, app);

server.on('listening', () => {
  console.log(`🔒 HTTPS Server running securely on port ${PORT}`);
  console.log(`🌐 Access your application at: https://localhost:${PORT}`);
  console.log(`⚠️  Note: Your browser may show a security warning for self-signed certificate`);
});

server.on('error', (error) => {
  console.error('❌ HTTPS Server error:', error.message);
  console.error('Error code:', error.code);
  if (error.code === 'EACCES') {
    console.log('🔄 Port access denied, trying HTTP fallback...');
    app.listen(3001, () => {
      console.log(`🔓 HTTP Server running on port 3001 (fallback)`);
      console.log(`🌐 Access your application at: http://localhost:3001`);
    });
  } else {
    console.log('🔄 Trying HTTP fallback due to SSL error...');
    app.listen(3001, () => {
      console.log(`🔓 HTTP Server running on port 3001 (fallback)`);
      console.log(`🌐 Access your application at: http://localhost:3001`);
    });
  }
});

server.listen(PORT);
}