const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  route: { type: String, required: true },
  capacity: { type: String, required: true },
  availStr: { type: String, required: true },
  availColor: { type: String, required: true },
  curFreight: { type: Number, required: true },
  predFreight: { type: Number, required: true },
  score: { type: Number, required: true },
  eta: { type: String, required: true },
  origin: { type: [Number], required: true },
  dest: { type: [Number], required: true },
  isBestMatch: { type: Boolean, required: true }
});

module.exports = mongoose.model('Vessel', vesselSchema);
