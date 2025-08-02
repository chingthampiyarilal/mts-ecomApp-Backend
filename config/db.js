const mongoose = require('mongoose');
require('dotenv').config(); 


const connectDB = async () => {
  try {
  
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,  
    });

    console.log('MongoDB Connected to MTS-App database');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);  
  }
};

module.exports = connectDB;
