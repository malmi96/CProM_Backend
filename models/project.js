const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  projectName: { type: String, required: true },
  projectLocation: { type: String, required: true },
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  startedDate: { type: Date, default: Date.now },
  projectedEndingDate: { type: Date },
  projectStatus: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
