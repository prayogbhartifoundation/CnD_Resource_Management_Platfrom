import { Schema, model } from "mongoose";

// Define the schema
const downloadSchema = new Schema(
  {
    path: { type: String, required: true },
    category: { type: String, required: true },
    agency: { type: String },
    downloads: [
      {
        name: String,
        email: String,
        ip: String,
        downloadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Create the model
const download_model = model("downloads", downloadSchema);

export default download_model;
