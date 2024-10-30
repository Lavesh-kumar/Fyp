const mongoose = require('mongoose');

const connectionString = process.env.DB; // Replace with your connection string

const connect = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

module.exports = connect;