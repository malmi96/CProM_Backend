const mongoose = require('mongoose');

const customerPaymentSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('CustomerPayment', customerPaymentSchema);
