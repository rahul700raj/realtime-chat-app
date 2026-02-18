# Quick Start Guide

Get your chat app running in 5 minutes! ⚡

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or MongoDB Atlas account)
- Git

## Step 1: Clone & Install (2 minutes)

\`\`\`bash
# Clone the repository
git clone https://github.com/rahul700raj/realtime-chat-app.git
cd realtime-chat-app

# Install all dependencies
npm run install-all
\`\`\`

## Step 2: Configure Environment (1 minute)

### Backend Configuration

Create \`server/.env\`:
\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Edit \`server/.env\`:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=my-super-secret-jwt-key-change-this
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

### Frontend Configuration

Create \`client/.env\`:
\`\`\`bash
cd ../client
cp .env.example .env
\`\`\`

The default values should work:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
\`\`\`

## Step 3: Start MongoDB (30 seconds)

### Option A: Local MongoDB
\`\`\`bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
\`\`\`

### Option B: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update \`MONGODB_URI\` in \`server/.env\`

## Step 4: Run the App (30 seconds)

### Option A: Run Both Together
\`\`\`bash
# From root directory
npm run dev
\`\`\`

### Option B: Run Separately

**Terminal 1 - Backend:**
\`\`\`bash
cd server
npm start
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd client
npm start
\`\`\`

## Step 5: Test It Out! 🎉

1. Open browser to \`http://localhost:3000\`
2. Register a new account
3. Open another browser/incognito window
4. Register another account
5. Start chatting!

## Common Issues & Solutions

### MongoDB Connection Error
- **Issue:** \`MongooseServerSelectionError\`
- **Solution:** Make sure MongoDB is running
  \`\`\`bash
  # Check if MongoDB is running
  mongosh
  \`\`\`

### Port Already in Use
- **Issue:** \`Port 5000 is already in use\`
- **Solution:** Change PORT in \`server/.env\` to 5001 or kill the process
  \`\`\`bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  \`\`\`

### React App Won't Start
- **Issue:** Dependencies error
- **Solution:** Clear cache and reinstall
  \`\`\`bash
  cd client
  rm -rf node_modules package-lock.json
  npm install
  \`\`\`

### Socket Connection Failed
- **Issue:** Can't connect to Socket.io
- **Solution:** 
  1. Check backend is running on port 5000
  2. Verify \`REACT_APP_SOCKET_URL\` in \`client/.env\`
  3. Check browser console for errors

## Next Steps

- ✅ Read the full [README.md](README.md)
- ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- ✅ Explore the code structure
- ✅ Customize the UI
- ✅ Add new features!

## Features to Try

1. **User Authentication**
   - Register multiple accounts
   - Login/logout

2. **Real-time Chat**
   - Send messages
   - See instant delivery

3. **Online Status**
   - Open multiple browsers
   - See who's online

4. **Typing Indicator**
   - Start typing
   - See "typing..." indicator

5. **Message Timestamps**
   - Check message times
   - Formatted nicely

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh
- Backend: Use \`npm run dev\` with nodemon

### Debug Mode
Enable detailed logs:
\`\`\`javascript
// In server/server.js
console.log('Debug:', variable);

// In React components
console.log('Component state:', state);
\`\`\`

### Database Inspection
View your data:
\`\`\`bash
mongosh
use chatapp
db.users.find()
db.messages.find()
\`\`\`

## Need Help?

- 📖 Read the [full documentation](README.md)
- 🐛 [Report bugs](https://github.com/rahul700raj/realtime-chat-app/issues)
- 💡 [Request features](https://github.com/rahul700raj/realtime-chat-app/issues)
- 📧 Email: rm2778643@gmail.com

---

Happy coding! 🚀
