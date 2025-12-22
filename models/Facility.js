const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Parking', 'Swimming Pool'
  description: { type: String },
  price: { type: Number, default: 0 }, // 0 if free
  capacity: { type: Number }, // max bookings per slot
  image: { type: String },
  timeSlots: [{ type: String }], // e.g., ['09:00-10:00', '10:00-11:00']
  availableDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }] // days available
});


const facilityBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports.Facility = mongoose.model('Facility', facilitySchema);
module.exports.FacilityBooking = mongoose.model('FacilityBooking', facilityBookingSchema);