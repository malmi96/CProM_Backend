const mongoose = require('mongoose');

const equipmentSchema = mongoose.Schema({
  equipmentType: { type: String, required: true },
  equipmentQuantity: { type: Number, required: true }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
