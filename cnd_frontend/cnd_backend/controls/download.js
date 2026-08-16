import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import download_model from "../models/downloadModel.js";
import { fileURLToPath } from "url";

const download_router = new express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../doc_uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in 'doc_uploads' folder
  },
  filename: (req, file, cb) => {
    let filePath = path.join(uploadDir, file.originalname);

    // Check if file exists, if so, append a number (e.g., "file(1).pdf")
    if (fs.existsSync(filePath)) {
      const fileExt = path.extname(file.originalname); // Get file extension
      const fileName = path.basename(file.originalname, fileExt); // Get file name without extension

      let counter = 1;
      while (
        fs.existsSync(path.join(uploadDir, `${fileName}(${counter})${fileExt}`))
      ) {
        counter++;
      }

      filePath = path.join(uploadDir, `${fileName}(${counter})${fileExt}`);
    }

    cb(null, path.basename(filePath)); // Save the new filename
  },
});

const upload = multer({ storage });

// Upload Route
download_router.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    const { category, agency } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Save only relative path in MongoDB
    const savedFiles = await Promise.all(
      files.map((file) =>
        download_model.create({
          path: `doc_uploads/${file.filename}`,
          category,
          agency,
        })
      )
    );

    res
      .status(201)
      .json({ message: "Files uploaded successfully", files: savedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed", error });
  }
});

download_router.get("/api/files", async (req, res) => {
  try {
    const files = await download_model.find();
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Failed to fetch files", error });
  }
});

// Log download activity
download_router.post("/api/logDownload", async (req, res) => {
  try {
    const { filePath, name, email } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const file = await download_model.findOne({ path: filePath });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.downloads.push({ name, email, ip });
    await file.save();

    res.status(200).json({ message: "Download logged" });
  } catch (err) {
    console.error("Download log error:", err);
    res.status(500).json({ message: "Failed to log download" });
  }
});


export default download_router;
