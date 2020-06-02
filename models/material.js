const mongoose = require('mongoose');

const materialSchema = mongoose.Schema({
  materialType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  criticalLevel: { type: Number, required: true }
});

module.exports = mongoose.model('Material', materialSchema);
