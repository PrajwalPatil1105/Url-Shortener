const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const User = require("../Model/Userschema");
const Link = require("../Model/Linkschema");
const UAParser = require("ua-parser-js");
const auth = require("../Middleware/auth.js");
dotenv.config();

router.get("/DashboardData", auth(), async (req, res) => {
  try {
    let userId = req.User?.id;
    const UserData = await Link.find({ user: userId });
    if (!UserData) {
      res.status(404).json({ messahe: "User Not Found", code: "0" });
    }
    res.json({ UserData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/userlinks", auth(), async (req, res) => {
  try {
    const userId = req.User?.id;
    const { remark = "", page = 1, limit = 6 } = req.query;
    let filter = { user: userId };
    if (remark) {
      filter.remark = { $regex: remark, $options: "i" };
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const totalCount = await Link.countDocuments(filter);
    const links = await Link.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    if (!links || links.length === 0) {
      return res.status(200).json({
        message: "No links found",
        UserData: [],
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          totalCount: 0,
        },
      });
    }
    const totalPages = Math.ceil(totalCount / limitNumber);
    res.json({
      UserData: links,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/create", auth(), async (req, res) => {
  try {
    const { originalLink, remark, expiryDate } = req.body;

    let hashedLink = nanoid(8);
    let linkExists = true;

    while (linkExists) {
      const existingLink = await Link.findOne({ hashedLink });
      if (!existingLink) {
        linkExists = false;
      } else {
        hashedLink = nanoid(8);
      }
    }

    const shortUrl = `https://url-shortener-92ga.onrender.com/url/redirect/${hashedLink}`;

    const newLink = new Link({
      user: req.User.id,
      originalLink,
      hashedLink: shortUrl,
      remark,
      expiryDate: expiryDate || null,
      totalClicks: 0,
      clickDetails: [],
    });
    await newLink.save();

    return res.status(201).json({
      message: "Link created successfully",
      code: "1",
      data: {
        shortUrl,
        hashedLink,
        originalLink,
        remark,
        expiryDate,
      },
    });
  } catch (error) {
    console.error("Error creating link:", error);
    return res.status(500).json({
      message: "Internal server error",
      code: "0",
    });
  }
});

router.get("/redirect/:hashedLink", async (req, res) => {
  try {
    const { hashedLink } = req.params;
    const fullHashedLink = `https://url-shortener-92ga.onrender.com/url/redirect/${hashedLink}`;

    const link = await Link.findOne({ hashedLink: fullHashedLink });
    if (!link) {
      return res.status(410).render("linknotfound");
    }

    if (link.expiryDate && new Date() > new Date(link.expiryDate).getTime()) {
      return res.status(410).render("linkexpiree");
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    let deviceType = "Desktop";
    if (result.device.type === "mobile") deviceType = "Mobile";
    if (result.device.type === "tablet") deviceType = "Tablet";

    const clickDetail = {
      ipAddress: req.ip,
      browser: result.browser.name,
      os: result.os.name,
      clickedAt: Date.now(),
    };

    const updateFields = {
      $inc: { totalClicks: 1 },
      $push: { clickDetails: clickDetail },
    };

    if (deviceType === "Mobile") {
      updateFields.$inc.mobileClicks = 1;
    } else if (deviceType === "Desktop") {
      updateFields.$inc.desktopClicks = 1;
    } else if (deviceType === "Tablet") {
      updateFields.$inc.tabletClicks = 1;
    }

    await Link.findByIdAndUpdate(link._id, updateFields);
    return res.redirect(link.originalLink);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({
      message: "Internal server error",
      code: "0",
    });
  }
});

router.delete("/dellinks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLink = await Link.findByIdAndDelete(id);
    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the link", error });
  }
});

router.delete("/delUser", auth(), async (req, res) => {
  try {
    const id = req.User?.id;
    const deletedLink = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the link", error });
  }
});

router.get("/editlinkdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const editlink = await Link.findById(id);
    if (!editlink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(editlink);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the link", error });
  }
});

router.get("/editUserdata", auth(), async (req, res) => {
  try {
    const id = req.User?.id;
    const edituser = await User.findById(id);
    if (!edituser) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(edituser);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the link", error });
  }
});

router.put("/editinglink/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { originalLink, remark, expiryDate } = req.body;
    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { originalLink, remark, expiryDate },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Link updated successfully", updatedLink });
  } catch (error) {
    res.status(500).json({ message: "Error updating the link", error });
  }
});

router.put("/edituserdata", auth(), async (req, res) => {
  try {
    const id = req.User.id;
    const { name, email, mobile } = req.body;
    const updatedLink = await User.findByIdAndUpdate(
      id,
      { name, email, mobile },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Link updated successfully", updatedLink });
  } catch (error) {
    res.status(500).json({ message: "Error updating the link", error });
  }
});

router.get("/clickanalytics", auth(), async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.User?.id);
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Link.aggregate([
      { $match: { user: userId } },
      { $unwind: "$clickDetails" },
      { $count: "total" },
    ]);
    const clickAnalytics = await Link.aggregate([
      { $match: { user: userId } },
      {
        $unwind: {
          path: "$clickDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          originalLink: 1,
          hashedLink: 1,
          remark: 1,
          ipAddress: "$clickDetails.ipAddress",
          browser: "$clickDetails.browser",
          os: "$clickDetails.os",
          clickedAt: "$clickDetails.clickedAt",
        },
      },

      { $sort: { clickedAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);
    const total = totalCount.length > 0 ? totalCount[0].total : 0;
    const totalPages = Math.ceil(total / parseInt(limit));
    res.json({
      success: true,
      data: clickAnalytics,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalClicks: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching click analytics",
      error: error.message,
    });
  }
});

module.exports = router;
