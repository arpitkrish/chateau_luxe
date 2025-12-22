const express = require('express');
const Food = require('../models/Food');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get menu with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, vegetarian, spicy } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (vegetarian === 'true') query.vegetarian = true;
    if (spicy === 'true') query.spicy = true;
    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Food.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place order with cart support
router.post('/order', auth, async (req, res) => {
  try {
    const { items, paymentId, razorpayOrderId } = req.body; // items: [{ foodId, quantity }]
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food || !food.available) continue;
      const price = food.price * item.quantity;
      totalPrice += price;
      orderItems.push({
        food: item.foodId,
        quantity: item.quantity,
        price
      });
    }
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      paymentId,
      razorpayOrderId,
      paymentStatus: paymentId ? 'paid' : 'pending'
    });
    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit
    const sort = { createdAt: -1 }; // Most recent first

    let query = Order.find({ user: req.user._id }).populate('items.food').sort(sort);

    if (limit > 0) {
      query = query.limit(limit);
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;