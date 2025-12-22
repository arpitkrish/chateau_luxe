const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Skip if already connected (for testing)
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', error.message);
    // Don't exit the process, just log the error
    console.log('⚠️  Continuing without database connection...');
  }
};

module.exports = connectDB;