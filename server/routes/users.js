const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users except current user
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username email avatar isOnline lastSeen')
      .sort({ username: 1 });

    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username email avatar isOnline lastSeen')
    .limit(10);

    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
