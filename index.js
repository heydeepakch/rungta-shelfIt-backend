const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const Category = require('./models/Category');

dotenv.config();

const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) {
      return;
    }

    const categoriesToSeed = [
        { name: 'Textbooks', icon: '📚', description: 'Find your course textbooks.' },
        { name: 'Electronics', icon: '💻', description: 'Laptops, phones, and more.' },
        { name: 'Furniture', icon: '🛋️', description: 'Desks, chairs, and dorm essentials.' },
        { name: 'Clothing', icon: '👕', description: 'Apparel for every style.' },
        { name: 'Bikes & Scooters', icon: '🚲', description: 'Get around campus easily.' },
        { name: 'Supplies', icon: '✏️', description: 'Notebooks, pens, and other school supplies.' },
        { name: 'Other', icon: '📦', description: 'Miscellaneous items.' }
    ];

    await Category.insertMany(categoriesToSeed);
    console.log('Categories have been seeded');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

connectDB().then(() => {
  seedCategories();
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 