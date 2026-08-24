const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  port: String,
  congestion: String,
  color: String,
  fill: String,
  wait: String,
  cost: String,
  status: String,
  risk: String,
  coords: [Number],
  curWidth: Number,
  foreWidth: Number,
  trend: String
});

module.exports = mongoose.model('Port', portSchema);
