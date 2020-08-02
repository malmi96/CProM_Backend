const mongoose = require('mongoose');

const machinerySchema = mongoose.Schema({
  machineryName: { type: String, required: true },
  machineryType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MachineryType',
    required: true,
  },
  machineryCondition: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Machinery', machinerySchema);
