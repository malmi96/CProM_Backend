const mongoose = require('mongoose');

const materialPaymentSchema = mongoose.Schema({
  materialType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  stageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true,
  },
  supplierName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  quantityBought: { type: Number, required: true },
});

module.exports = mongoose.model('MaterialPayment', materialPaymentSchema);
