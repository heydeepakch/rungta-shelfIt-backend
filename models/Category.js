const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  description: { type: String },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category; 