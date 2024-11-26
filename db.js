// db.js
const mongoose = require('mongoose');

// Set up the connection string
const mongoURI = 'mongodb://localhost:27017/mydatabase';  // Replace with your actual MongoDB URI

// Function to connect to MongoDB
const connectDB = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
};

// Export the connection function
module.exports = connectDB;
