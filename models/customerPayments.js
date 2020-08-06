const mongoose = require('mongoose');

const customerPaymentSchema = mongoose.Schema({
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  paymentDate: { type: Date, default: Date.now },
  paymentType: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('CustomerPayment', customerPaymentSchema);
