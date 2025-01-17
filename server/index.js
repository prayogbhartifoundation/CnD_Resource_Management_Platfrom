import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import superAdmin_model from "./models/superAdminModel.js";
import agency_model from "./models/agencyModel.js";
import plant_model from "./models/plantModel.js";

const salt = 10;

const app = express();

// Increase the request size limit
app.use(express.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = "cnd_db";

// Connect to MongoDB
mongoose
  .connect(`mongodb://127.0.0.1:27017/${db}`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Super Admin register api
app.post("/api/superAdminRegister", async (req, res) => {
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
app.post("/api/superAdminLogin", async (req, res) => {
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

app.get("/superAdminHome", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});


// ------------------------------------------------------------------------------------------------------------------

// Agency register api
app.post("/api/agencyRegister", async (req, res) => {
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
app.get("/api/getAgencies", async (req, res) => {
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
app.post("/api/agencyLogin", async (req, res) => {
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
app.put("/api/reset_password", async (req, res) => {
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

app.get("/agencyHome", verifyAgency, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});



// ------------------------------------------------------------------------------------------------------------------

// plant level api

// Plant register api
app.post("/api/plantRegister", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { location, contact, contactEmail, agencyId } = req.body;

    // Fetch the current registration count for serial number
    const plantCount = await plant_model.countDocuments();
    const serialNumber = (plantCount + 1).toString().padStart(3, "0"); // Ensure three digits
    const plantId = `P${serialNumber}`; // Generate regId in md1sno format

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
app.get("/api/getPlants", async (req, res) => {
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

// Plant Login API

app.post("/api/plantLogin", async (req, res) => {
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
app.put("/api/reset_password_plant", async (req, res) => {
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
        const updatedEntry = await agency_model.findOneAndUpdate(
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

app.get("/plantHome", verifyPlant, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.listen(8081, "0.0.0.0", () => {
  console.log("running on port 8081 ...");
});

// change token name for super admin and agency
