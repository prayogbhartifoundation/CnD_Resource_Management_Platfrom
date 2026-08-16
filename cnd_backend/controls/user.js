// routes/user.js
import express from "express";
import userModel from "../models/userModel.js";

const user_router = express.Router();

// get_all_users
user_router.get("/api/user/all", async (req, res) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

user_router.post("/api/user/register", async (req, res) => {
  try {
    const { mobile, name, email, organisation } = req.body;

    // Check if mobile already exists
    const existingUser = await userModel.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered, please login."
      });
    }

    // Create new user
    const user = new userModel({ name, email, mobile, organisation });
    await user.save();

    res.status(201).json({
      success: true,
      user
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

user_router.post("/api/user/login", async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await userModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ success: false, message: "Mobile not registered" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default user_router;
