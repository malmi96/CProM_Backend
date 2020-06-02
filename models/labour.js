const mongoose = require('mongoose');

const labourSchema = mongoose.Schema({
  labourName: { type: String, required: true },
  labourType: { type: String, required: true },
  labourNIC: { type: String, required: true },
  labourContactNo: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  labourAddress: { type: String }
});

module.exports = mongoose.model('Labour', labourSchema);
