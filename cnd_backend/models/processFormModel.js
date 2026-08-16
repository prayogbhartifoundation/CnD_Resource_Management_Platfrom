import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productQty: {
    type: Number,
    required: true,
    min: 0
  },
  productPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  remarks: {
    type: String,
    default: ''
  }
});

const processFormSchema = new Schema({
  dateOfSubmission: {
    type: Date,
    default: Date.now
  },
  processQty: {
    type: Number,
    required: true,
    min: 0
  },
  manualEntry: {
    type: Boolean,
    default: false
  },
  products: {
    type: [productSchema],
    default: []
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const ProcessingForm_model = model('ProcessingForm', processFormSchema);

export default ProcessingForm_model;
