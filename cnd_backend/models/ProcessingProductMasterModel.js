import mongoose from 'mongoose';

const processingProductMasterSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  formSubmissions: [
    {
      date: {
        type: Date,
        required: true,
      },
      quantity: Number,
      percentage: Number,
      remarks: String,
    },
  ],
}, { timestamps: true });

const ProcessingProductMaster = mongoose.model('ProcessingProductMaster', processingProductMasterSchema);
export default ProcessingProductMaster;
