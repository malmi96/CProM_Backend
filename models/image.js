const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  imagePath: { type: String, required: true },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  stageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true
  },
  Date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
