import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import agency_model from "../models/agencyModel.js";

const agency_router = new express.Router();

const salt = 10;


// Agency register api
agency_router.post("/api/agencyRegister", async (req, res) => {
    console.log("Request body:", req.body);
  
    try {
      const { agency, location, contact, contactEmail } = req.body;
  
      // Fetch the current registration count for serial number
      const agencyCount = await agency_model.countDocuments();
      const serialNumber = (agencyCount + 1).toString().padStart(3, "0"); // Ensure three digits
      const agencyId = `A${serialNumber}`; // Generate regId in md1sno format
  
      // Validate input
      if (!agency || !location || !contactEmail || !contact) {
        return res.status(400).json({
          Status: "Failed",
          msg: "all details are required",
        });
      }
  
      const password = "123";
  
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
        const agencyData = new agency_model({
          ...req.body,
          agencyId: agencyId,
          password: hash, // Store the hashed password
        });
  
        const result = await agencyData.save();
        console.log("agency saved:", result);
  
        res.status(201).json({
          Status: "Success",
          msg: `Agency Registered successfully.\nAgency ID: ${agency}.`,
        });
      });
    } catch (error) {
      console.error("Error saving agency Data:", error);
      res.status(500).json({
        Status: "Failed",
        msg: `Error saving agency. Error: ${error.message}`,
      });
    }
  });
  
  // Get API to fetch all agencies
  agency_router.get("/api/getAgencies", async (req, res) => {
    try {
      const agencies = await agency_model.find(); // Fetch all agencies from the database
      res.status(200).json({
        Status: "Success",
        data: agencies,
      });
    } catch (error) {
      console.error("Error fetching agencies:", error);
      res.status(500).json({
        Status: "Failed",
        msg: `Error fetching agencies. Error: ${error.message}`,
      });
    }
  });
  
  // Agency Login API
  agency_router.post("/api/agencyLogin", async (req, res) => {
    console.log("Request body:", req.body);
  
    const agencyId = req.body.agencyId;
    const password = req.body.password;
  
    if (!agencyId || !password) {
      return res.status(400).json({
        Status: "Failed",
        msg: "agecnyId and password are required",
      });
    }
  
    try {
      // Query the database to find the super admin by sAdminId
      const agencyData = await agency_model.findOne({ agencyId });
  
      if (!agencyData) {
        return res.status(404).json({
          Status: "Failed",
          msg: "agency not found",
        });
      }
  
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, agencyData.password, async (err, isMatch) => {
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
  
        if (agencyData.passwordReset > 0) {
          const name = agencyData.agencyId;
          const token = jwt.sign(
            { name },
            "jwt-unique-private-key-shouldBeInENV",
            {
              expiresIn: "1d",
            }
          );
  
          // counting logins by agency
          await agency_model.findOneAndUpdate(
            { agencyId: agencyId },
            { $set: { logins: (agencyData.logins || 0) + 1 } },
            { new: true } // Return the updated document
          );
  
          res.cookie("agencytoken", token, { secure: false });
  
          // Login successful
          res.status(200).json({
            Status: "Success",
            msg: "Login successful as Agency.",
          });
        } else {
          // Login successful
          res.status(200).json({
            Status: "Reset Password",
            msg: "Login successful as Agency.",
          });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        Status: "Failed",
        msg: `An error occurred: ${error.message}`,
      });
    }
  });
  
  // Update agency Password
  agency_router.put("/api/reset_password", async (req, res) => {
    const { agencyId, oldPassword, password } = req.body;
  
    console.log(req.body);
  
    if (!agencyId || !oldPassword || !password) {
      return res.status(400).json({
        Status: "Failed",
        message: "missing details",
      });
    }
  
    try {
      // Check if the agency exists
      const agencyData = await agency_model.findOne({ agencyId });
      if (!agencyData) {
        return res.status(404).json({
          Status: "Failed",
          message: "Agency not found",
        });
      }
  
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(oldPassword, agencyData.password, async (err, isMatch) => {
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
  
        // Hash the password
        const saltRounds = 10; // Define salt rounds
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({
              Status: "Error",
              msg: "Error hashing password",
            });
          }
  
          // Update the password and increment passwordReset
          const updatedEntry = await agency_model.findOneAndUpdate(
            { agencyId },
            {
              $set: {
                password: hash,
                passwordReset: (agencyData.passwordReset || 0) + 1, // Handle missing field
              },
            },
            { new: true } // Return the updated document
          );
  
          const name = agencyData.agencyId;
          const token = jwt.sign(
            { name },
            "jwt-unique-private-key-shouldBeInENV",
            {
              expiresIn: "1d",
            }
          );
  
          res.cookie("agencytoken", token, { secure: false });
  
          res.status(200).json({
            Status: "Success",
            message: "Password reset successfully",
            data: updatedEntry,
          });
        });
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        Status: "Error",
        message: "Server error",
        error: error.message,
      });
    }
  });
  
  //verify agency
  const verifyAgency = (req, res, next) => {
    const token = req.cookies.agencytoken;
  
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
  
  agency_router.get("/agencyHome", verifyAgency, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
  });
  
  export default agency_router;
