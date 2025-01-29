const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = new mongoose.model("User", Userschema);
module.exports = User;
