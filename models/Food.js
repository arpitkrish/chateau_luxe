const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., 'Appetizer', 'Main Course', 'Dessert', 'Beverage'
  image: { type: String },
  available: { type: Boolean, default: true },
  ingredients: [String], // New: list of ingredients
  spicy: { type: Boolean, default: false }, // New: if spicy
  vegetarian: { type: Boolean, default: false } // New: if vegetarian
});

module.exports = mongoose.model('Food', foodSchema);