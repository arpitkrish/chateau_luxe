const express = require('express');
const { Facility, FacilityBooking } = require('../models/Facility');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available time slots for a facility on a date
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    if (!facility.availableDays.includes(dayOfWeek)) {
      return res.json({ availableSlots: [] });
    }

    // Get booked slots for that date
    const booked = await FacilityBooking.find({ facility: req.params.id, date, status: 'booked' });
    const bookedSlots = booked.map(b => b.timeSlot);
    const availableSlots = facility.timeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book facility
router.post('/book', auth, async (req, res) => {
  try {
    const { facilityId, date, timeSlot, paymentId, razorpayOrderId } = req.body;
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Check if slot is available
    const existing = await FacilityBooking.findOne({ facility: facilityId, date, timeSlot, status: { $in: ['pending', 'confirmed'] } });
    if (existing) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const booking = new FacilityBooking({
      user: req.user._id,
      facility: facilityId,
      date,
      timeSlot,
      paymentId,
      razorpayOrderId,
      status: paymentId ? 'confirmed' : 'pending',
      paymentStatus: paymentId ? 'paid' : 'pending'
    });
    await booking.save();
    res.status(201).json({ message: 'Facility booked', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user facility bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    console.log('User ID for facilities:', req.user._id);
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit
    const sort = { createdAt: -1 }; // Most recent first

    let query = FacilityBooking.find({ user: req.user._id }).sort(sort);

    if (limit > 0) {
      query = query.limit(limit);
    }

    const bookings = await query;
    console.log('Found facility bookings:', bookings.length);

    // Populate facilities separately to avoid potential issues
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const populated = await FacilityBooking.findById(booking._id).populate('facility');
          return populated;
        } catch (populateError) {
          console.error('Error populating facility booking:', populateError);
          return booking;
        }
      })
    );

    res.json(populatedBookings);
  } catch (error) {
    console.error('Error fetching facility bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;