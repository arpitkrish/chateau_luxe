require('dotenv').config();
const mongoose = require('mongoose');
const { Facility } = require('./models/Facility');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const updateSwimmingPoolImage = async () => {
  await connectDB();

  try {
    const result = await Facility.updateOne(
      { name: 'Swimming Pool' },
      { image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop&crop=center' }
    );

    if (result.modifiedCount > 0) {
      console.log('Swimming pool image updated successfully');
    } else {
      console.log('Swimming pool facility not found or image already up to date');
    }
  } catch (error) {
    console.error('Error updating swimming pool image:', error);
  }

  process.exit(0);
};

updateSwimmingPoolImage().catch(console.error);