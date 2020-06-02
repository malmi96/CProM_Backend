const mongoose = require('mongoose');

const utilityPaymentSchema = mongoose.Schema({
  billType: { type: String, required: true },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  stageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true
  },
  billDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('UtilityPayment', utilityPaymentSchema);
