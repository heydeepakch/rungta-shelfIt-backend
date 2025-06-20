const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  const { name, email, password, college, major, year, location } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    college,
    major,
    year,
    location,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      major: user.major,
      year: user.year,
      location: user.location,
      avatar: user.avatar,
      joinDate: user.joinDate,
      verified: user.verified,
      rating: user.rating,
      totalSales: user.totalSales,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      major: user.major,
      year: user.year,
      location: user.location,
      avatar: user.avatar,
      joinDate: user.joinDate,
      verified: user.verified,
      rating: user.rating,
      totalSales: user.totalSales,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      major: user.major,
      year: user.year,
      location: user.location,
      joinDate: user.joinDate,
      verified: user.verified,
      rating: user.rating,
      totalSales: user.totalSales,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile }; 