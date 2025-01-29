const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalLink: {
    type: String,
    required: true,
  },
  hashedLink: {
    type: String,
    unique: true,
  },
  remark: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  mobileClicks: {
    type: Number,
    default: 0,
  },
  desktopClicks: {
    type: Number,
    default: 0,
  },
  tabletClicks: {
    type: Number,
    default: 0,
  },
  clickDetails: [
    {
      requestId: { type: String },
      ipAddress: {
        type: String,
      },
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      clickedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Link = new mongoose.model("Link", LinkSchema);
module.exports = Link;
