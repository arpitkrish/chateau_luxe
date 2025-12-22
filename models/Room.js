const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'Deluxe', 'Suite'
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [String], // e.g., ['WiFi', 'AC', 'TV']
  available: { type: Boolean, default: true },
  image: { type: String } // path to image
});

module.exports = mongoose.model('Room', roomSchema);