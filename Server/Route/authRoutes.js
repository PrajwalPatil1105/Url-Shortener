const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const authRoutes = express.Router();
const User = require("../Model/Userschema");

authRoutes.post("/signup", async (req, res) => {
  const { name, email, password, mobile } = req.body;
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(409).json({ message: "User Already Exists", code: "0" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashpassword,
    mobile,
  });
  await newUser.save();
  return res.status(201).json({
    message: "Account Created Successfully",
    code: "1",
  });
});

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const isMatch = await bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const token = jwt.sign(
      { id: isUser._id, name: isUser.name },
      process.env.JWT_SECRET
    );
    res.json({ token, message: "Login Successfull", code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = authRoutes;
