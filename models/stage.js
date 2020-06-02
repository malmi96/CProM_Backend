const mongoose = require('mongoose');

const stageSchema = mongoose.Schema({
  stageName: { type: String, required: true },
  stageSupervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Labour',
    required: true
  },
  stageStartedDate: { type: Date, default: Date.now },
  stageEndingDate: { type: Date },
  stageStatus: { type: String },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
});

module.exports = mongoose.model('Stage', stageSchema);
