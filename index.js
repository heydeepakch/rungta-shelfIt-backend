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
        { name: 'TextBooks', icon: '📚', description: 'Find your course textbooks.' },
        { name: 'Electronics', icon: '💻', description: 'Laptops, phones, and more.' },
        { name: 'Supplies', icon: '✏️', description: 'Notebooks, pens, and other school supplies.' },
        { name: 'Dental Items', icon: '🦷', description: 'Dental equipment and supplies.' },
        { name: 'Others', icon: '📦', description: 'Miscellaneous items.' }
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