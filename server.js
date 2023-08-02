// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/quotagram';
const authRoutes = require('./routes/auth');
const User = require('./models/User');

// Middleware to parse incoming request bodies as JSON
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

 
app.use('/api/auth', authRoutes);

// Route to handle user signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create a new user object and save it to the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Return success response
    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Houston! Something went real bad!', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user with the provided username exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided password matches the user's stored password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // At this point, login should be successful.
    // You can implement JWT or other authentication mechanisms here if needed.

    // Return success response
    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Houston! Something went real bad!', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

