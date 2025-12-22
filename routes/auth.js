const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { FacilityBooking } = require('../models/Facility');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered', user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Logged in', user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// Get profile
router.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});

// Get user statistics for profile dashboard
router.get('/profile/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get room bookings count
    const roomBookingsCount = await Booking.countDocuments({ user: userId });

    // Get facility bookings count
    const facilityBookingsCount = await FacilityBooking.countDocuments({ user: userId });

    // Get food orders count
    const foodOrdersCount = await Order.countDocuments({ user: userId });

    // Calculate total bookings (room + facility)
    const totalBookings = roomBookingsCount + facilityBookingsCount;

    // Calculate loyalty points (simple calculation: 10 points per booking/order)
    const loyaltyPoints = (totalBookings * 10) + (foodOrdersCount * 5);

    res.json({
      totalBookings,
      totalOrders: foodOrdersCount,
      loyaltyPoints,
      roomBookings: roomBookingsCount,
      facilityBookings: facilityBookingsCount
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;