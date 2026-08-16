import { Schema, model } from "mongoose";

// Define the schema
const agencySchema = new Schema(
  {
    agencyId: { type: String, required: true },
    password: { type: String, required: true },
    agency: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    incharge: { type: String, },
    contactEmail: { type: String, required: true },
    mapLoc: { type: String },
    logins: { type: Number, default: 0 },
    logo: { type: String, default: "default.png" },
    passwordReset: { type: Number, default: 0 },
    operationDetails: { type: String, default: "default.png" },
    role: { type: String, required: true }, // e.g., "staff", "manager", etc.
    contactDetails:[{name:{type:String},email:{type:String},phone:{type:String},designation:{type:String}}],
   
    wasteProcessingDetails: {
      installedWasteCap: { type: Number, default: 0 },
      contactEmail: { type: String },
      mobile: { type: String },
      contactPerson: { type: String },
      processedMaterials: [
        {
          name: { type: String },
          img: { type: String },
          qty: { type: Number, default: 0 },
        },
      ],
    },
    
    complianceTestReports: [
      {
        name: { type: String,  }, // Original file name
        type: { type: String,  }, // File extension/type
        filePath: { type: String,  }, // Server path of the file
        comments: { type: String, default: "" },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
      },
    ],
    
    testReports: [
      {
        name: { type: String,  }, // Original file name
        type: { type: String,  }, // File extension/type
        filePath: { type: String,  }, // Server path of the file
        comments: { type: String, default: "" },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
      },
    ],
    
    momReports: [
      {
        name: { type: String,  }, // Original file name
        type: { type: String,  }, // File extension/type
        filePath: { type: String,  }, // Server path of the file
        comments: { type: String, default: "" },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
      },
    ],
    
    otherReports: [
      {
        name: { type: String,  }, // Original file name
        type: { type: String,  }, // File extension/type
        filePath: { type: String,  }, // Server path of the file
        comments: { type: String, default: "" },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
      },
    ],

    plants: [
      {
        plantId: { type: String },
      },
    ],
    mohuaStatus: [
      {
        dep: { type: String },
        target: [
          {
            name: { type: String },
            value: { type: String },
            status: { type: String },
          },
        ],
      },
    ],
    updates: [
      {
        updatedBy: { type: String },
        updatedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Create the model
const agency_model = model("agencies", agencySchema);

export default agency_model;
