// models/User.js
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  mobile: String,
  email: String,
  organisation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('User', userSchema);
