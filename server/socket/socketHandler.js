const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

// Store active socket connections
const userSockets = new Map();

const socketHandler = (io) => {
  // Socket.io middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    // Store socket connection
    userSockets.set(socket.userId, socket.id);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, { 
      isOnline: true,
      lastSeen: new Date()
    });

    // Broadcast user online status
    io.emit('user-status', { 
      userId: socket.userId, 
      isOnline: true 
    });

    // Send list of online users
    const onlineUsers = Array.from(userSockets.keys());
    socket.emit('online-users', onlineUsers);

    // Handle private messages
    socket.on('send-message', async (data) => {
      try {
        const { receiverId, content } = data;

        // Save message to database
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content
        });
        await message.save();

        // Populate sender and receiver info
        await message.populate('sender', 'username avatar');
        await message.populate('receiver', 'username avatar');

        // Send to receiver if online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', message);
        }

        // Send confirmation to sender
        socket.emit('message-sent', message);
      } catch (error) {
        socket.emit('message-error', { error: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      const receiverSocketId = userSockets.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', {
          userId: socket.userId,
          username: socket.username,
          isTyping
        });
      }
    });

    // Handle message read status
    socket.on('mark-read', async (data) => {
      try {
        const { senderId } = data;
        
        await Message.updateMany(
          { sender: senderId, receiver: socket.userId, read: false },
          { read: true, readAt: new Date() }
        );

        // Notify sender that messages were read
        const senderSocketId = userSockets.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages-read', {
            userId: socket.userId
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.username} (${socket.userId})`);

      // Remove socket connection
      userSockets.delete(socket.userId);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false,
        lastSeen: new Date()
      });

      // Broadcast user offline status
      io.emit('user-status', { 
        userId: socket.userId, 
        isOnline: false 
      });
    });
  });
};

module.exports = socketHandler;
