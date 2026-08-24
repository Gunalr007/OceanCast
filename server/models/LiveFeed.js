const mongoose = require('mongoose');

const liveFeedSchema = new mongoose.Schema({
  id: Number,
  time: String,
  port: String,
  commodity: String,
  origin: String,
  cargo: String,
  freight: String,
  prediction: String,
  decision: String,
  freshness: String,
  savings: String,
  color: String
});

module.exports = mongoose.model('LiveFeed', liveFeedSchema);
