// models/Visit.js
import { Schema, model } from 'mongoose';

const visitSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
});

export default model('Visit', visitSchema);
