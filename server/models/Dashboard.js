const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  value: { type: String, required: true },
  trend: { type: String },
  subtext: { type: String },
  isPositive: { type: Boolean }
});

const routeAvailabilitySchema = new mongoose.Schema({
  id: Number,
  route: String,
  availability: String,
  estFreight: String,
  trend: String
});

const dashboardSchema = new mongoose.Schema({
  kpis: {
    predictedAvgFreight: kpiSchema,
    totalCargoDemand: kpiSchema,
    recommendedCharterWindow: kpiSchema,
    estimatedSavings: kpiSchema
  },
  routeAvailability: [routeAvailabilitySchema],
  optimizationRec: {
    action: String,
    dates: String,
    expectedFreight: String,
    cargoQty: String,
    estTotalCost: String,
    potentialSavings: String
  },
  costBreakdown: [{
    name: String,
    value: Number,
    fill: String,
    percent: String
  }],
  recentAlerts: [{
    id: Number,
    type: { type: String },
    text: String,
    date: String
  }]
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
