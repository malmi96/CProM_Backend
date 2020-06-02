const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
  supplierName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: Number, required: true },
  supplyDelay: { type: Number },
  reorderDelay: { type: Number },
});

module.exports = mongoose.model('Supplier', supplierSchema);
