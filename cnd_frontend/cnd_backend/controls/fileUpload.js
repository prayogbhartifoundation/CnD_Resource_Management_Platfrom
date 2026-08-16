import express from "express";
import multer from "multer";
import agency_model from "../models/agencyModel.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import prod_model from "../models/productModel.js";

const fileUploadRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the prod uploads directory exists
const prodImgDir = path.join(__dirname, "../assets/prods");
if (!fs.existsSync(prodImgDir)) {
  fs.mkdirSync(prodImgDir, { recursive: true });
}

// Ensure the agency uploads directory exists
const agencyImgDir = path.join(__dirname, "../assets/agency");
if (!fs.existsSync(agencyImgDir)) {
  fs.mkdirSync(agencyImgDir, { recursive: true });
}

// Ensure the doc uploads directory exists
const docUploadDir = path.join(__dirname, "../uploads/doc_uploads");
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

// Ensure the testReport uploads directory exists
const testReportUploadDir = path.join(__dirname, "../uploads/testReports_uploads");
if (!fs.existsSync(testReportUploadDir)) {
  fs.mkdirSync(testReportUploadDir, { recursive: true });
}

// Ensure the momReport uploads directory exists
const momReportUploadDir = path.join(__dirname, "../uploads/momReports_uploads");
if (!fs.existsSync(momReportUploadDir)) {
  fs.mkdirSync(momReportUploadDir, { recursive: true });
}

// Ensure the momReport uploads directory exists
const otherReportUploadDir = path.join(__dirname, "../uploads/otherReports_uploads");
if (!fs.existsSync(otherReportUploadDir)) {
  fs.mkdirSync(otherReportUploadDir, { recursive: true });
}

// Ensure the logo logoUploadDir directory exists
const logoUploadDir = path.join(__dirname, "../uploads/logo");
if (!fs.existsSync(logoUploadDir)) {
  fs.mkdirSync(logoUploadDir, { recursive: true });
}

// Ensure the opUploadDir directory exists
const opUploadDir = path.join(__dirname, "../uploads/operation");
if (!fs.existsSync(opUploadDir)) {
  fs.mkdirSync(opUploadDir, { recursive: true });
}

// doc Storage Configuration
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, docUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    // console.log("file : ", file);

    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// test report Storage Configuration
const testReportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, testReportUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    // console.log("file : ", file);

    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// test report Storage Configuration
const momReportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, momReportUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    // console.log("file : ", file);

    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// test report Storage Configuration
const otherReportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, otherReportUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    // console.log("file : ", file);

    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// logoStorage Configuration
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// opStorage Configuration
const opStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, opUploadDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// File Upload Filter (Restrict to PDF, DOC, XLS, etc.)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/JPG",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Middleware for single file upload
const logoUpload = multer({ storage: logoStorage, fileFilter });
const opUpload = multer({ storage: opStorage, fileFilter });

// Middleware for multiple file uploads (Compliance Reports)
const multipleDocUpload = multer({ storage: docStorage,limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  }, fileFilter }).array(
  "complianceFiles",
  10
);


// Middleware for multiple test report uploads 
const multipleTestUpload = multer({ storage: testReportStorage,limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  }, fileFilter }).array(
  "testFiles",
  10
);


// Middleware for multiple test report uploads 
const multipleMOMUpload = multer({ storage: momReportStorage,limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  }, fileFilter }).array(
  "momFiles",
  10
);


// Middleware for multiple test report uploads 
const multipleOtherUpload = multer({ storage: otherReportStorage,limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  }, fileFilter }).array(
  "otherFiles",
  10
);



// prodStorage Configuration
const prodStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, prodImgDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// agencyStorage Configuration
const agencyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, agencyImgDir); // Ensure uploads are stored in /uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const prodImgUpload = multer({ storage: prodStorage, fileFilter });
const agencyImgUpload = multer({ storage: agencyStorage, fileFilter });



// 📌 Upload Logo
fileUploadRouter.post(
  "/api/upload/logo/:agencyId",
  agencyImgUpload.single("logo"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      console.log("uploading logo : ", req.file);

      const agencyId = req.params.agencyId;
      const filePath = `/assets/agency/${req.file.filename}`;

      console.log(filePath);

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $set: { logo: filePath } },
        { new: true }
      );

      res.json({ success: true, filePath, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading logo" });
    }
  }
);

// 📌 Upload Operation Image
fileUploadRouter.post(
  "/api/upload/operation/:agencyId",
  opUpload.single("operationImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      console.log("uploading operation image : ", req.file);

      const agencyId = req.params.agencyId;
      const filePath = `/uploads/operation/${req.file.filename}`;

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $set: { operationDetails: filePath } },
        { new: true }
      );

      res.json({ success: true, filePath, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading operation image" });
    }
  }
);











// --------------------------------------------------------------------------------

// 📌 Upload Compliance Reports
fileUploadRouter.post(
  "/api/upload/compliance/:agencyId",
  multipleDocUpload,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded" });

      const agencyId = req.params.agencyId;
      // console.log("doc uploading : ", req.files);

      const uploadedFiles = req.files.map((file) => ({
        name: file.originalname,
        type: path.extname(file.originalname),
        filePath: `/uploads/doc_uploads/${file.filename}`, // Store file location
        comments: "",
        downloads: 0,
        views: 0,
        uploadedAt: new Date(),
      }));

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $push: { complianceTestReports: { $each: uploadedFiles } } },
        { new: true }
      );

      res.json({ success: true, uploadedFiles, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading compliance reports" });
    }
  }
);

// 📌 Upload test Reports
fileUploadRouter.post(
  "/api/upload/testReports/:agencyId",
  multipleTestUpload,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded" });

      const agencyId = req.params.agencyId;
      // console.log("doc uploading : ", req.files);

      const uploadedFiles = req.files.map((file) => ({
        name: file.originalname,
        type: path.extname(file.originalname),
        filePath: `/uploads/testReports_uploads/${file.filename}`, // Store file location
        comments: "",
        downloads: 0,
        views: 0,
        uploadedAt: new Date(),
      }));

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $push: { testReports: { $each: uploadedFiles } } },
        { new: true }
      );

      res.json({ success: true, uploadedFiles, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading test reports" });
    }
  }
);

// 📌 Upload MOM Reports
fileUploadRouter.post(
  "/api/upload/momReports/:agencyId",
  multipleMOMUpload,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded" });

      const agencyId = req.params.agencyId;
      // console.log("doc uploading : ", req.files);

      const uploadedFiles = req.files.map((file) => ({
        name: file.originalname,
        type: path.extname(file.originalname),
        filePath: `/uploads/momReports_uploads/${file.filename}`, // Store file location
        comments: "",
        downloads: 0,
        views: 0,
        uploadedAt: new Date(),
      }));

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $push: { momReports: { $each: uploadedFiles } } },
        { new: true }
      );

      res.json({ success: true, uploadedFiles, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading compliance reports" });
    }
  }
);

// 📌 Upload Other Reports
fileUploadRouter.post(
  "/api/upload/otherReports/:agencyId",
  multipleOtherUpload,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded" });

      const agencyId = req.params.agencyId;
      // console.log("doc uploading : ", req.files);

      const uploadedFiles = req.files.map((file) => ({
        name: file.originalname,
        type: path.extname(file.originalname),
        filePath: `/uploads/otherReports_uploads/${file.filename}`, // Store file location
        comments: "",
        downloads: 0,
        views: 0,
        uploadedAt: new Date(),
      }));

      const updatedAgency = await agency_model.findOneAndUpdate(
        { agencyId },
        { $push: { otherReports: { $each: uploadedFiles } } },
        { new: true }
      );

      res.json({ success: true, uploadedFiles, updatedAgency });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading compliance reports" });
    }
  }
);

// --------------------------------------------------------------------------------













// 📌 Upload Operation Image
fileUploadRouter.post(
  "/api/upload/prodImg/:prodId",
  prodImgUpload.single("prodImg"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      console.log("uploading product image : ", req.file);

      const prodId = req.params.prodId;
      const filePath = `/assets/prods/${req.file.filename}`;

      const updatedProd = await prod_model.findOneAndUpdate(
        { prodId },
        { $set: { prodImg: filePath } },
        { new: true }
      );

      res.json({ success: true, filePath, updatedProd });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading operation image" });
    }
  }
);


// 📌 Serve Uploaded Files
fileUploadRouter.use("/api/uploads/doc_uploads", express.static(docUploadDir));
fileUploadRouter.use("/api/uploads/logo", express.static(logoUploadDir));
fileUploadRouter.use("/api/uploads/operation", express.static(opUploadDir));

fileUploadRouter.use("/api/assets/prods", express.static(prodImgDir));
fileUploadRouter.use("/api/assets/agency", express.static(agencyImgDir));

export default fileUploadRouter;
