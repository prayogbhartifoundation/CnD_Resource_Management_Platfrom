// models/User.js
import { Schema, model } from 'mongoose';

const utilSchema = new Schema({
  notification: String,
  mobile: String,
  email: String,
  overview: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Util', utilSchema);
