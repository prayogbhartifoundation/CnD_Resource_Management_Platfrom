import { Schema, model } from "mongoose";

const newsSchema = new Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true }, // agencyId
  date: { type: Date, default: Date.now },
});

export default model("news", newsSchema);
