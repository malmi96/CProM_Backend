const mongoose = require('mongoose');

const stageProgressSchema = mongoose.Schema({
  stageName: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true, },
  progress: {type: Number, required: true}
});

module.exports = mongoose.model('StageProgress', stageProgressSchema);