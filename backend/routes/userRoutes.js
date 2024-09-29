const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
// server.js or app.js
require('dotenv').config();



// Register User
router.post('/register', async (req, res) => {
  const { name, rollNumber, password } = req.body;
  try {
    const user = new User({ name, rollNumber, password });
    await user.save();
    res.status(201).json({ message: 'User Registered!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;
  try {
    const user = await User.findOne({ rollNumber });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name, rollNumber: user.rollNumber });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;
