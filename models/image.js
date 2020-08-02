const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  imageName: { type: String, required: true },
  imagePath: { type: String, required: true },
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
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Image', imageSchema);
