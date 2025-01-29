const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");

const auth = () => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ message: "You are not authorizated", code: "2" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.User = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid", code: "2" });
    }
  };
};

module.exports = auth;
