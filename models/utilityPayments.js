const mongoose = require('mongoose');

const utilityPaymentSchema = mongoose.Schema({
  paymentType: { type: String, required: true },
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
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model('UtilityPayment', utilityPaymentSchema);
