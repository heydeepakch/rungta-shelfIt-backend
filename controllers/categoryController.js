const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCategory = async (req, res) => {
  const { name, icon, description } = req.body;

  const category = new Category({
    name,
    icon,
    description,
  });

  try {
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category data' });
  }
};

module.exports = {
  getCategories,
  createCategory,
}; 