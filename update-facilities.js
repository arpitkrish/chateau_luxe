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

const updateFacilityImages = async () => {
  await connectDB();

  try {
    // Update Swimming Pool
    const swimmingResult = await Facility.updateOne(
      { name: 'Swimming Pool' },
      { image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop&crop=center' }
    );
    console.log('Swimming Pool update result:', swimmingResult.modifiedCount > 0 ? 'Updated' : 'Not found or already up to date');

    // Update Conference Room
    const conferenceResult = await Facility.updateOne(
      { name: 'Conference Room' },
      { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center' }
    );
    console.log('Conference Room update result:', conferenceResult.modifiedCount > 0 ? 'Updated' : 'Not found or already up to date');

    // Update Parking
    const parkingResult = await Facility.updateOne(
      { name: 'Parking' },
      { image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop&crop=center' }
    );
    console.log('Parking update result:', parkingResult.modifiedCount > 0 ? 'Updated' : 'Not found or already up to date');

  } catch (error) {
    console.error('Error updating facility images:', error);
  }

  process.exit(0);
};

updateFacilityImages().catch(console.error);