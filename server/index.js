import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import prod_router from "./controls/product.js";
import plant_router from "./controls/plant.js";
import agency_router from "./controls/agency.js";
import sadmin_router from "./controls/superAdmin.js";

const app = express();

// Increase the request size limit
app.use(express.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.json());
app.use(
  cors({
    origin: "*",
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


app.use(prod_router)
app.use(plant_router)
app.use(agency_router)
app.use(sadmin_router)

// ------------------------------------------------------------------------------------------------------------------

app.listen(8081, "0.0.0.0", () => {
  console.log("running on port 8081 ...");
});