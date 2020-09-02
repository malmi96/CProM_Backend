const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNo: { type: Number, required: true },
  message: { type: String },
  date: { type: Date, required: true },
  status: {type: String}
});

module.exports = mongoose.model('Inquiry', inquirySchema);
