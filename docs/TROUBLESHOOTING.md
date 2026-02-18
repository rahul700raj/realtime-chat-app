# Troubleshooting Guide

Common issues and their solutions for the Real-Time Chat Application.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Connection Issues](#connection-issues)
- [Authentication Issues](#authentication-issues)
- [Socket.io Issues](#socketio-issues)
- [Deployment Issues](#deployment-issues)

---

## Installation Issues

### npm install fails

**Problem:** Dependencies fail to install

**Solutions:**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
\`\`\`

### Node version incompatibility

**Problem:** "Unsupported engine" error

**Solution:**
\`\`\`bash
# Check your Node version
node --version

# Install Node 14 or higher
# Using nvm (recommended)
nvm install 16
nvm use 16
\`\`\`

---

## Database Issues

### MongoDB connection failed

**Problem:** \`MongooseServerSelectionError: connect ECONNREFUSED\`

**Solutions:**

1. **Check if MongoDB is running:**
\`\`\`bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
sc query MongoDB
\`\`\`

2. **Start MongoDB:**
\`\`\`bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
\`\`\`

3. **Verify connection string:**
\`\`\`env
# In server/.env
MONGODB_URI=mongodb://localhost:27017/chatapp
\`\`\`

### MongoDB Atlas connection issues

**Problem:** Can't connect to MongoDB Atlas

**Solutions:**

1. **Whitelist your IP:**
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add current IP or 0.0.0.0/0 (for testing)

2. **Check connection string:**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
\`\`\`

3. **Verify credentials:**
   - Username and password are correct
   - User has read/write permissions

### Database authentication failed

**Problem:** \`Authentication failed\`

**Solution:**
\`\`\`bash
# Create a new user in MongoDB
mongosh
use chatapp
db.createUser({
  user: "chatuser",
  pwd: "password",
  roles: ["readWrite"]
})

# Update connection string
MONGODB_URI=mongodb://chatuser:password@localhost:27017/chatapp
\`\`\`

---

## Connection Issues

### Port already in use

**Problem:** \`Error: listen EADDRINUSE: address already in use :::5000\`

**Solutions:**

1. **Find and kill the process:**
\`\`\`bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
\`\`\`

2. **Change the port:**
\`\`\`env
# In server/.env
PORT=5001
\`\`\`

### CORS errors

**Problem:** \`Access to XMLHttpRequest has been blocked by CORS policy\`

**Solutions:**

1. **Check CLIENT_URL in server/.env:**
\`\`\`env
CLIENT_URL=http://localhost:3000
\`\`\`

2. **Verify CORS configuration in server.js:**
\`\`\`javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
\`\`\`

3. **For multiple origins:**
\`\`\`javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));
\`\`\`

---

## Authentication Issues

### JWT token invalid

**Problem:** \`Invalid authentication token\`

**Solutions:**

1. **Clear localStorage:**
\`\`\`javascript
// In browser console
localStorage.clear()
\`\`\`

2. **Check JWT_SECRET:**
\`\`\`env
# In server/.env
JWT_SECRET=your-secret-key-at-least-32-characters
\`\`\`

3. **Verify token format:**
\`\`\`javascript
// Should be: Bearer <token>
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### Login fails with correct credentials

**Problem:** Login returns 401 even with correct password

**Solutions:**

1. **Check password hashing:**
\`\`\`javascript
// In User model, verify bcrypt is working
const isValid = await user.comparePassword(password);
console.log('Password valid:', isValid);
\`\`\`

2. **Reset user password:**
\`\`\`bash
mongosh
use chatapp
db.users.deleteOne({ email: "test@example.com" })
# Register again
\`\`\`

### Session expires immediately

**Problem:** User gets logged out right after login

**Solution:**
\`\`\`javascript
// In routes/auth.js, check token expiration
const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
  expiresIn: '7d'  // Should be reasonable
});
\`\`\`

---

## Socket.io Issues

### Socket connection failed

**Problem:** \`WebSocket connection failed\`

**Solutions:**

1. **Check backend is running:**
\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

2. **Verify SOCKET_URL:**
\`\`\`env
# In client/.env
REACT_APP_SOCKET_URL=http://localhost:5000
\`\`\`

3. **Check browser console for errors**

4. **Verify Socket.io CORS:**
\`\`\`javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});
\`\`\`

### Messages not sending

**Problem:** Messages don't appear in real-time

**Solutions:**

1. **Check socket connection:**
\`\`\`javascript
// In browser console
console.log('Socket connected:', socket.connected);
\`\`\`

2. **Verify event names match:**
\`\`\`javascript
// Client
socket.emit('send-message', data);

// Server
socket.on('send-message', (data) => {});
\`\`\`

3. **Check server logs for errors**

### Typing indicator not working

**Problem:** Typing indicator doesn't show

**Solutions:**

1. **Verify typing event:**
\`\`\`javascript
// Check if event is being emitted
socket.emit('typing', { receiverId, isTyping: true });
\`\`\`

2. **Check timeout logic:**
\`\`\`javascript
// Ensure typing stops after delay
setTimeout(() => {
  socket.emit('typing', { receiverId, isTyping: false });
}, 1000);
\`\`\`

### Online status not updating

**Problem:** Users show offline when they're online

**Solutions:**

1. **Check socket authentication:**
\`\`\`javascript
// Verify token is being sent
const socket = io(SOCKET_URL, {
  auth: { token: localStorage.getItem('token') }
});
\`\`\`

2. **Verify user status update:**
\`\`\`javascript
// In socketHandler.js
await User.findByIdAndUpdate(socket.userId, { 
  isOnline: true 
});
\`\`\`

---

## Deployment Issues

### Build fails

**Problem:** \`npm run build\` fails

**Solutions:**

1. **Check for errors:**
\`\`\`bash
npm run build 2>&1 | tee build.log
\`\`\`

2. **Clear cache:**
\`\`\`bash
rm -rf node_modules/.cache
npm run build
\`\`\`

3. **Check environment variables:**
\`\`\`bash
# Ensure all REACT_APP_ variables are set
echo $REACT_APP_API_URL
\`\`\`

### Production API calls fail

**Problem:** API calls work locally but fail in production

**Solutions:**

1. **Check API URL:**
\`\`\`env
# Should be production URL, not localhost
REACT_APP_API_URL=https://your-backend.railway.app/api
\`\`\`

2. **Verify CORS settings:**
\`\`\`javascript
// Add production URL to CORS
origin: [
  'http://localhost:3000',
  'https://your-frontend.vercel.app'
]
\`\`\`

3. **Check HTTPS:**
   - Ensure both frontend and backend use HTTPS
   - Mixed content (HTTP/HTTPS) will be blocked

### Socket.io not connecting in production

**Problem:** WebSocket fails in production

**Solutions:**

1. **Use correct protocol:**
\`\`\`env
# Use wss:// for HTTPS sites
REACT_APP_SOCKET_URL=https://your-backend.railway.app
\`\`\`

2. **Check WebSocket support:**
   - Ensure hosting platform supports WebSockets
   - Railway, Heroku, Vercel all support it

3. **Enable sticky sessions** (if using load balancer)

---

## General Debugging Tips

### Enable debug mode

**Backend:**
\`\`\`javascript
// In server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(\`\${req.method} \${req.path}\`);
    next();
  });
}
\`\`\`

**Frontend:**
\`\`\`javascript
// In any component
console.log('State:', state);
console.log('Props:', props);
\`\`\`

### Check logs

**Server logs:**
\`\`\`bash
# Development
npm run dev

# Production
pm2 logs
# or
heroku logs --tail
\`\`\`

**Browser console:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Test API endpoints

\`\`\`bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
\`\`\`

### Database inspection

\`\`\`bash
mongosh
use chatapp

# Check users
db.users.find().pretty()

# Check messages
db.messages.find().pretty()

# Count documents
db.users.countDocuments()
db.messages.countDocuments()
\`\`\`

---

## Still Having Issues?

1. **Check existing issues:** [GitHub Issues](https://github.com/rahul700raj/realtime-chat-app/issues)
2. **Create new issue:** Include:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, etc.)
   - Relevant code snippets
3. **Contact:** rm2778643@gmail.com

---

## Useful Commands

\`\`\`bash
# Check versions
node --version
npm --version
mongod --version

# Clear everything and start fresh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Reset database
mongosh
use chatapp
db.dropDatabase()

# Check running processes
lsof -i :5000
lsof -i :3000

# View logs
tail -f server/logs/error.log
\`\`\`

---

Remember: Most issues can be solved by:
1. Checking environment variables
2. Verifying services are running
3. Reading error messages carefully
4. Checking browser console and server logs
