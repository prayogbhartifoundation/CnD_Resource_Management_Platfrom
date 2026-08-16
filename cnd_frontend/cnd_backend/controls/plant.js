import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

import plant_model from "../models/plantModel.js";
import agency_model from "../models/agencyModel.js";

const plant_router = new express.Router();

const salt = 10;

// plant level api

// Plant register api
plant_router.post("/api/plantRegister", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { location, contact, contactEmail, agencyId } = req.body;

    // Fetch the current registration count for serial number
    const plantCount = await plant_model.countDocuments();
    const serialNumber = (plantCount + 1).toString().padStart(3, "0"); // Ensure three digits
    const plantId = `${agencyId}_P${serialNumber}`; // Generate regId in md1sno format

    // Validate input
    if (!location || !contactEmail || !contact || !agencyId) {
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
      const plantData = new plant_model({
        ...req.body,
        plantId: plantId,
        password: hash, // Store the hashed password
      });

      const result = await plantData.save();
      console.log("plant saved:", result);

      // Update the agency_model by pushing the new plantId into plants array
      const updateAgency = await agency_model.findOneAndUpdate(
        { agencyId: agencyId },
        { $push: { plants: { plantId: plantId } } },
        { new: true }
      );

      if (!updateAgency) {
        return res.status(404).json({
          Status: "Failed",
          msg: "Agency not found",
        });
      }

      console.log("Agency updated:", updateAgency);

      res.status(201).json({
        Status: "Success",
        msg: `Plant Registered successfully.\nPlant ID: ${plantId}.`,
      });
    });
  } catch (error) {
    console.error("Error saving plant Data:", error);
    res.status(500).json({
      Status: "Failed",
      msg: `Error saving plant. Error: ${error.message}`,
    });
  }
});

// Get API to fetch all plants
plant_router.get("/api/getPlants", async (req, res) => {
  console.log();

  try {
    const plants = await plant_model.find(); // Fetch all agencies from the database
    res.status(200).json({
      Status: "Success",
      data: plants,
    });
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({
      Status: "Failed",
      msg: `Error fetching plants. Error: ${error.message}`,
    });
  }
});

// Get API to fetch a plant by plantId using POST method
plant_router.post("/api/getPlant", async (req, res) => {
  console.log(req.body);

  try {
    const { plantId } = req.body;

    if (!plantId) {
      return res.status(400).json({
        Status: "Failed",
        msg: "Missing required field: plantId",
      });
    }

    const plant = await plant_model.findOne({ plantId });

    if (!plant) {
      return res.status(404).json({
        Status: "Failed",
        msg: "Plant not found",
      });
    }

    res.status(200).json({
      Status: "Success",
      data: plant,
    });
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({
      Status: "Failed",
      msg: `Error fetching plant. Error: ${error.message}`,
    });
  }
});

plant_router.put("/api/updatePlant/:plantId", async (req, res) => {
  const { plantId } = req.params;
  const { contact, contactEmail, phone, installedWasteCap, mapLoc, vidLink, address } = req.body;

  console.log(req.body);
  

  try {
    const updated = await plant_model.findOneAndUpdate(
      { plantId },
      { contact, contactEmail, phone, installedWasteCap, mapLoc, vidLink, address },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        Status: "Failed",
        msg: "Plant not found",
      });
    }

    res.status(200).json({
      Status: "Success",
      msg: "Plant info updated successfully",
      updated,
    });
  } catch (error) {
    res.status(500).json({
      Status: "Error",
      msg: "Update failed: " + error.message,
    });
  }
});

// Plant Login API

plant_router.post("/api/plantLogin", async (req, res) => {
  console.log("Request body:", req.body);

  const plantId = req.body.plantId;
  const password = req.body.password;

  if (!plantId || !password) {
    return res.status(400).json({
      Status: "Failed",
      msg: "plantId and password are required",
    });
  }

  try {
    // Query the database to find the super admin by sAdminId
    const plantData = await plant_model.findOne({ plantId });

    if (!plantData) {
      return res.status(404).json({
        Status: "Failed",
        msg: "agency not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, plantData.password, async (err, isMatch) => {
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

      if (plantData.passwordReset > 0) {
        const plantname = plantData.plantId;
        const token = jwt.sign(
          { plantname },
          "jwt-unique-private-key-shouldBeInENV",
          {
            expiresIn: "1d",
          }
        );

        // counting logins by agency
        await plant_model.findOneAndUpdate(
          { plantId: plantId },
          { $set: { logins: (plantData.logins || 0) + 1 } },
          { new: true } // Return the updated document
        );

        res.cookie("planttoken", token, { secure: false });

        // Login successful
        res.status(200).json({
          Status: "Success",
          msg: "Login successful as Plant.",
          user: plantId,
        });
      } else {
        // Login successful
        res.status(200).json({
          Status: "Reset Password",
          msg: "Login successful as Plant.",
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

// Update plant Password
plant_router.put("/api/reset_password_plant", async (req, res) => {
  const { plantId, oldPassword, password } = req.body;

  console.log(req.body);

  if (!plantId || !oldPassword || !password) {
    return res.status(400).json({
      Status: "Failed",
      message: "missing details",
    });
  }

  try {
    // Check if the agency exists
    const plantData = await plant_model.findOne({ plantId });
    if (!plantData) {
      return res.status(404).json({
        Status: "Failed",
        message: "Plant not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(oldPassword, plantData.password, async (err, isMatch) => {
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
        const updatedEntry = await plant_model.findOneAndUpdate(
          { plantId },
          {
            $set: {
              password: hash,
              passwordReset: (plantData.passwordReset || 0) + 1, // Handle missing field
            },
          },
          { new: true } // Return the updated document
        );

        const plantname = plantData.plantId;
        const planttoken = jwt.sign(
          { plantname },
          "jwt-unique-private-key-shouldBeInENV",
          {
            expiresIn: "1d",
          }
        );

        res.cookie("planttoken", planttoken, { secure: false });

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

const verifyPlant = (req, res, next) => {
  const planttoken = req.cookies.planttoken;

  if (!planttoken) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(
      planttoken,
      "jwt-unique-private-key-shouldBeInENV",
      (err, decoded) => {
        if (err) {
          return res.json({ Error: "Token is not correct" });
        } else {
          req.name = decoded.plantname;
          next();
        }
      }
    );
  }
};

plant_router.get("/api/plantHome", verifyPlant, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

plant_router.post("/api/update_mohua_status", async (req, res) => {
  try {
    console.log(req.body);

    const { plantId, depDetails } = req.body;

    if (!plantId || !Array.isArray(depDetails) || depDetails.length === 0) {
      return res.status(400).json({
        message: "Invalid request: Missing required fields or incorrect format",
      });
    }

    // Fetch plant document
    const plant = await plant_model.findOne({ plantId });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // Get today's date and cycle details
    const today = moment();
    const isFirstHalf = today.date() <= 15;

    const startOfCycle = isFirstHalf
      ? today.clone().startOf("month") // 1st of the month
      : today.clone().startOf("month").add(15, "days"); // 16th of the month

    const endOfCycle = isFirstHalf
      ? today.clone().startOf("month").add(14, "days") // 15th of the month
      : today.clone().endOf("month"); // Last day of the month

    // const startOfCycle = isFirstHalf ? today.startOf('month') : today.date(16);
    // const endOfCycle = isFirstHalf ? today.date(15) : today.endOf('month');

    console.log("isFirstHalf", isFirstHalf);
    console.log("startOfCycle", startOfCycle);
    console.log("endOfCycle", endOfCycle);

    // Process each department entry
    depDetails.forEach(({ newEntry, entryDate, dep }) => {
      console.log(newEntry, "--", entryDate, "--", dep);

      if (!newEntry.trim() || !entryDate.trim() || !dep.trim()) {
        return; // Skip invalid or empty entries
      }

      const entryMoment = moment(entryDate);
      if (!entryMoment.isValid()) {
        return; // Skip invalid dates
      }

      let department = plant.mohuaStatus.find((d) => d.dep === dep);

      if (!department) {
        // Create a new department object
        department = {
          dep,
          total: "0",
          annual: "0",
          last15days: "0",
          entry: [],
        };

        // Push it into the array and update the reference to the actual object inside plant.mohuaStatus
        plant.mohuaStatus.push(department);
        department = plant.mohuaStatus[plant.mohuaStatus.length - 1]; // Get the last inserted department
      }

      console.log(department);

      // Update values based on cycle
      if (entryMoment.isBetween(startOfCycle, endOfCycle, "day", "[]")) {
        department.annual =
          (parseInt(department.annual) || 0) + parseInt(newEntry);
      } else {
        department.annual =
          (parseInt(department.annual) || 0) +
          (parseInt(department.annual) || 0);
        department.annual = parseInt(newEntry);
      }

      // Push new entry
      department.entry.push({ value: newEntry, entryDate });
    });

    // Save the updated plant data
    await plant.save();

    return res.status(200).json({ Status: "Success", data: plant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Status: "Internal Server Error", error });
  }
});

export default plant_router;
