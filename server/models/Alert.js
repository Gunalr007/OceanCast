const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  id: Number,
  time: String,
  type: { type: String },
  title: String,
  subtitle: String,
  desc: String,
  confidence: Number,
  actionText: String,
  bg: String
});

module.exports = mongoose.model('Alert', alertSchema);
