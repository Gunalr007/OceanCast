const mongoose = require('mongoose');

const demandSchema = new mongoose.Schema({
  commodityData: [{
    name: String,
    percent: Number,
    value: Number,
    fill: String
  }],
  totalDemand: Number,
  regionData: [{
    region: String,
    demand: Number
  }],
  forecastData: [{
    commodity: String,
    current: Number,
    forecast: Number,
    change: Number,
    trend: String
  }]
});

module.exports = mongoose.model('Demand', demandSchema);
