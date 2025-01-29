const mongoose = require("mongoose");

const connectDB = async () => {
  const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log("Connected Successfully to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
