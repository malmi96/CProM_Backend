const mongoose = require('mongoose');

const machinerySchema = mongoose.Schema({
  machineryName: { type: String, required: true },
  machineryType: { type: String, required: true },
  machineryCondition: { type: String, required: true }
});

module.exports = mongoose.model('Machinery', machinerySchema);
