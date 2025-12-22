const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const { FacilityBooking } = require('../models/Facility');
const Order = require('../models/Order');

const router = express.Router();

// Get all bookings for admin panel
router.get('/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name type price')
      .sort({ createdAt: -1 });

    const facilityBookings = await FacilityBooking.find()
      .populate('user', 'name email')
      .populate('facility', 'name type price')
      .sort({ createdAt: -1 });

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
      facilityBookings,
      orders
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// Update booking status
router.put('/bookings/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('room', 'name type price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
});

// Update facility booking status
router.put('/facility-bookings/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await FacilityBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('facility', 'name type price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Facility booking not found' });
    }

    res.json({
      success: true,
      message: `Facility booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Error updating facility booking status:', error);
    res.status(500).json({ success: false, message: 'Failed to update facility booking status' });
  }
});

module.exports = router;