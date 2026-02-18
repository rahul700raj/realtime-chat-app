const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get conversation between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar')
    .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark messages as read
router.put('/read/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
