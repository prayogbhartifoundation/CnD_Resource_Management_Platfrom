import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import prod_router from "./controls/product.js";
import plant_router from "./controls/plant.js";
import agency_router from "./controls/agency.js";
import sadmin_router from "./controls/superAdmin.js";
import fileUploadrouter from "./controls/fileUpload.js";

import path from "path"
import { fileURLToPath } from "url";
import download_router from "./controls/download.js";
import deptOfftakeRouter from "./controls/deptOfftake.js";
import newsRouter from "./controls/news.js";
import user_router from "./controls/user.js";
import visit_router from "./controls/visit.js";
import processingFormRouter from "./controls/ProcessingForm.js";
import vnnrouter from "./controls/vnnWeighBridgeData.js";
import util_router from "./controls/util.js";

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Increase the request size limit
app.use(express.json({ limit: "150mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "150mb" }));
// app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://192.168.240.190:3001",
      "http://192.168.1.36:3000",
      "http://192.168.1.36",
      "http://192.168.1.34:3000",
      "http://192.168.1.34",
      "http://localhost:8081",
      "http://localhost:8081:3000",
      "https://cndofftakencr.in",
      "https://cnd-frontend-q1js.vercel.app",
      "https://cndofftakencr.in:8081"
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/doc_uploads", express.static("doc_uploads"));

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
app.use(fileUploadrouter)
app.use(download_router)
app.use(deptOfftakeRouter)
app.use(newsRouter);
app.use(user_router);
app.use(visit_router)
app.use(processingFormRouter)
app.use(vnnrouter)
app.use(util_router)

// ------------------------------------------------------------------------------------------------------------------

// Serve the uploads folder

// app.listen(5000, () => console.log("Server running on port 5000"));

app.listen(8081, "0.0.0.0", () => {
  console.log("running on port 8081 ...");
});