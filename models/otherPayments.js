const mongoose = require('mongoose');

const otherPaymentSchema = mongoose.Schema({
  billType: { type: String, required: true },
  paymentInfo: { type: String },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  stageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
  },
  billDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('OtherPayment', otherPaymentSchema);
