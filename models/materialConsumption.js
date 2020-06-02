const mongoose = require('mongoose');

const materialConsumptionSchema = mongoose.Schema({
  materialType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  consumedQuantity: { type: Number, required: true },
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
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  'MaterialConsumption',
  materialConsumptionSchema
);
