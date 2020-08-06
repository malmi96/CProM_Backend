const mongoose = require('mongoose');

const machineryPaymentSchema = mongoose.Schema({
  machineryName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machinery',
    required: true,
  },
  supplierName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  paymentType: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('MachineryPayment', machineryPaymentSchema);
