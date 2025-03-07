import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import superAdmin_model from "../models/superAdminModel.js";

const sadmin_router = new express.Router();

const salt = 10;

// Super Admin register api
sadmin_router.post("/api/superAdminRegister", async (req, res) => {
    console.log("Request body:", req.body);
  
    try {
      const { sAdminId, password } = req.body;
  
      // Validate input
      if (!sAdminId || !password) {
        return res.status(400).json({
          Status: "Failed",
          msg: "sAdminId and password are required",
        });
      }
  
      // Hash the password
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({
            Status: "Error",
            msg: "Error hashing password",
          });
        }
  
        // Create and save the super admin record
        const superAdminData = new superAdmin_model({
          ...req.body,
          password: hash, // Store the hashed password
        });
  
        const result = await superAdminData.save();
        console.log("SuperAdmin saved:", result);
  
        res.status(201).json({
          Status: "Success",
          msg: `Registered successfully as SuperAdmin.\nYour Registration ID: ${sAdminId}\n\n** Save your Registration ID.`,
        });
      });
    } catch (error) {
      console.error("Error saving superAdminData:", error);
      res.status(500).json({
        Status: "Failed",
        msg: `Error saving registration. Error: ${error.message}`,
      });
    }
  });
  
  // Super Admin Login API
  sadmin_router.post("/api/superAdminLogin", async (req, res) => {
    console.log("Request body:", req.body);
  
    const sAdminId = req.body.sAdminId;
    const password = req.body.password;
  
    if (!sAdminId || !password) {
      return res.status(400).json({
        Status: "Failed",
        msg: "sAdminId and password are required",
      });
    }
  
    try {
      // Query the database to find the super admin by sAdminId
      const superAdminData = await superAdmin_model.findOne({ sAdminId });
  
      if (!superAdminData) {
        return res.status(404).json({
          Status: "Failed",
          msg: "Super Admin not found",
        });
      }
  
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, superAdminData.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({
            Status: "Error",
            msg: "Error during password comparison",
          });
        }
  
        if (!isMatch) {
          return res.status(401).json({
            Status: "Failed",
            msg: "Invalid credentials",
          });
        }
  
        const name = superAdminData.sAdminId;
        const token = jwt.sign({ name }, "jwt-unique-private-key-shouldBeInENV", {
          expiresIn: "1d",
        });
  
        res.cookie("token", token, { secure: false });
  
        // Login successful
        res.status(200).json({
          Status: "Success",
          msg: "Login successful as SuperAdmin.",
        });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        Status: "Failed",
        msg: `An error occurred: ${error.message}`,
      });
    }
  });
  
  const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.json({ Error: "You are not authenticated" });
    } else {
      jwt.verify(
        token,
        "jwt-unique-private-key-shouldBeInENV",
        (err, decoded) => {
          if (err) {
            return res.json({ Error: "Token is not correct" });
          } else {
            req.name = decoded.name;
            next();
          }
        }
      );
    }
  };
  
  sadmin_router.get("/superAdminHome", verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
  });
  
  export default sadmin_router;
