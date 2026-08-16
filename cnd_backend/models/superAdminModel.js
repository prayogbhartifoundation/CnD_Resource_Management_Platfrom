import { Schema, model } from "mongoose";

// Define the schema
const superAdminSchema = new Schema({
  sAdminId: { type: String, required: true }, // e.g., 'Delegate'
  password: { type: String, required: true }, // e.g., '010535'
});

// Create the model
const superAdmin_model = model("super_admins", superAdminSchema);

export default superAdmin_model;
