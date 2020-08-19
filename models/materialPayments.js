const mongoose = require('mongoose');

const materialPaymentSchema = mongoose.Schema({
  materialName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  supplierName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model('MaterialPayment', materialPaymentSchema);
