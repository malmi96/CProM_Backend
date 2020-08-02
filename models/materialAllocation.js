const mongoose = require('mongoose');

const materialAllocationSchema = mongoose.Schema({
  materialName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  quantity: { type: Number, required: true },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('materialAllocation', materialAllocationSchema);
