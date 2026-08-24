const mongoose = require('mongoose');

const trendItemSchema = new mongoose.Schema({
  month: String,
  actual: Number,
  forecast: Number
});

const trendSchema = new mongoose.Schema({
  bunkerData: [trendItemSchema],
  bdiData: [trendItemSchema],
  freightData: [trendItemSchema]
});

module.exports = mongoose.model('Trend', trendSchema);
