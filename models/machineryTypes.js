const mongoose = require('mongoose');

const machineryTypeSchema = mongoose.Schema({
  machineryType: { type: String, required: true },
});

module.exports = mongoose.model('MachineryType', machineryTypeSchema);
