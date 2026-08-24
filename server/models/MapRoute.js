const mongoose = require('mongoose');

const mapRouteSchema = new mongoose.Schema({
  id: String,
  name: String,
  origin: String,
  destination: String,
  // waypoints: realistic maritime corridor coordinates [lat, lng][]
  waypoints: [[Number]],
  // path: kept for backward compat (same as waypoints)
  path: [[Number]],
  color: String,
  distanceNm: Number,   // nautical miles
  etaDays: Number,      // estimated sailing days at ~13 knots average
  vesselType: String,   // primary cargo/vessel category
  corridor: String,     // notable maritime corridor used (e.g. "Suez Canal")
});

module.exports = mongoose.model('MapRoute', mapRouteSchema);
