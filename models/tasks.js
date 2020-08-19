const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  stageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true,
  },
  taskName: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String },
});

module.exports = mongoose.model('Task', taskSchema);
