const mongoose = require('mongoose');

const materialSchema = mongoose.Schema({
  materialCategory: { type: String, required: true },
  materialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  unitCost: { type: Number, required: true },
});

module.exports = mongoose.model('Material', materialSchema);
