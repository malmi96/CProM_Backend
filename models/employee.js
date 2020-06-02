const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  employeeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nic: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  contactNo: { type: Number, required: true },
  designation: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
