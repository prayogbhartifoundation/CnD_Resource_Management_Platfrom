import { Schema, model } from "mongoose";

const outsideDelhiSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "staff", "manager", etc.
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  logins: { type: Number, default: 0 },
  passwordReset: { type: Number, default: 0 },
});

const outsideDelhi_model = model("outsideDelhi", outsideDelhiSchema);

export default outsideDelhi_model;
