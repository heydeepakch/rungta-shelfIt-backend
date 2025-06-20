const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  condition: { type: String, required: true },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  college: { type: String },
  datePosted: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
  views: { type: Number, default: 0 },
});

const Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad; 