import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otherLogin_model from "../models/otherLogins_model.js";

const outsideDelhi_router = express.Router();

// Login API
outsideDelhi_router.post("/api/otherLogin", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ Status: "Failed", msg: "Missing credentials" });
  }

  try {
    const user = await otherLogin_model.findOne({ userId });

    if (!user) {
      return res.status(404).json({ Status: "Failed", msg: "User not found" });
    }

    if (user.passwordReset > 0) {
      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (err) return res.status(500).json({ Status: "Error", msg: "Error comparing passwords" });

        if (!isMatch) {
          return res.status(401).json({ Status: "Failed", msg: "Invalid credentials" });
        }

        const token = jwt.sign({ name: user.userId }, "jwt-otherLogin-secret", { expiresIn: "1d" });

        await otherLogin_model.findOneAndUpdate(
          { userId },
          { $set: { logins: (user.logins || 0) + 1 } },
          { new: true }
        );

        res.cookie("otherLogintoken", token, { secure: false });
        res.status(200).json({ Status: "Success", msg: "Login successful", user: user.userId });
      });
    } else if (user.passwordReset === 0 && password === "123") {
      res.status(200).json({ Status: "Reset Password", msg: "Initial login", user: user.userId });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ Status: "Error", msg: "Server error" });
  }
});

// Password Reset API
outsideDelhi_router.put("/api/otherLogin/reset_password", async (req, res) => {
  const { userId, oldPassword, password } = req.body;

  if (!userId || !oldPassword || !password) {
    return res.status(400).json({ Status: "Failed", msg: "Missing fields" });
  }

  try {
    const user = await otherLogin_model.findOne({ userId });

    if (!user) {
      return res.status(404).json({ Status: "Failed", msg: "User not found" });
    }

    if (oldPassword !== "123" && user.passwordReset === 0) {
      return res.status(401).json({ Status: "Failed", msg: "Invalid initial password" });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) return res.status(500).json({ Status: "Error", msg: "Hashing error" });

      const updated = await otherLogin_model.findOneAndUpdate(
        { userId },
        { $set: { password: hash, passwordReset: (user.passwordReset || 0) + 1 } },
        { new: true }
      );

      const token = jwt.sign({ name: user.userId }, "jwt-otherLogin-secret", { expiresIn: "1d" });
      res.cookie("otherLogintoken", token, { secure: false });

      res.status(200).json({
        Status: "Success",
        message: "Password reset successfully",
        user: updated.userId,
        data: updated,
      });
    });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ Status: "Error", msg: "Server error" });
  }
});

// Auth Middleware
const verifyOtherLogin = (req, res, next) => {
  const token = req.cookies.otherLogintoken;

  if (!token) return res.json({ Error: "Not authenticated" });

  jwt.verify(token, "jwt-otherLogin-secret", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid token" });

    req.name = decoded.name;
    next();
  });
};

// Protected Route
outsideDelhi_router.get("/api/otherLogin/home", verifyOtherLogin, (req, res) => {
  res.json({ Status: "Success", name: req.name });
});

export default outsideDelhi_router;
