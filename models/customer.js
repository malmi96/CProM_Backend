const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nic: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  contactNo: { type: Number, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Customer', customerSchema);
