const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book a room
router.post('/book', auth, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentId, razorpayOrderId } = req.body;
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ message: 'Room not available' });
    }
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * days;
    const booking = new Booking({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      paymentId,
      razorpayOrderId,
      status: paymentId ? 'confirmed' : 'pending',
      paymentStatus: paymentId ? 'paid' : 'pending'
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    console.log('User ID:', req.user._id);
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit
    const sort = { createdAt: -1 }; // Most recent first

    let query = Booking.find({ user: req.user._id }).populate('room').sort(sort);

    if (limit > 0) {
      query = query.limit(limit);
    }

    const bookings = await query;
    console.log('Found bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;