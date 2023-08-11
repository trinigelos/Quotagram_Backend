// auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
require("dotenv").config();
const SECRET_KEY_JWT = `${process.env.SECRET_KEY_JWT}`;

// Signup route
router.post('/signup', async (req, res) => {

  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }


    if (!password) {
      return res.status(400).json({message: "NO CONTRASENA"})
    }
    // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
    

    // Create the new user
    const newUser = new User({ username, email, password: hashedPassword });
    console.log({ newUser });
    const newUser1 = await newUser.save();
    console.log(newUser1);

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log({ SECRET_KEY_JWT });
    // Create and send a JWT token for user authentication
    const token = jwt.sign({ userId: user._id }, SECRET_KEY_JWT, { expiresIn: '4h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
