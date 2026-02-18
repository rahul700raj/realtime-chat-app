# Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

![Chat App](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 💬 **One-to-One Chat** - Private messaging between users
- 🟢 **Online/Offline Status** - Real-time user presence indicators
- ⌨️ **Typing Indicator** - See when someone is typing
- ⏰ **Message Timestamps** - Track when messages were sent
- 📱 **Responsive UI** - Works seamlessly on desktop and mobile
- 🎨 **Modern Design** - Clean and intuitive user interface
- ⚡ **Real-time Updates** - Instant message delivery with Socket.io

## 🛠️ Tech Stack

### Frontend
- React 18
- Socket.io Client
- Axios
- React Router DOM
- date-fns
- React Icons

### Backend
- Node.js
- Express
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/rahul700raj/realtime-chat-app.git
cd realtime-chat-app
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd server
npm install
\`\`\`

Create a \`.env\` file in the server directory:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd ../client
npm install
\`\`\`

Create a \`.env\` file in the client directory:

\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
\`\`\`

### 4. Start MongoDB

Make sure MongoDB is running on your system:

\`\`\`bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
\`\`\`

### 5. Run the Application

**Terminal 1 - Start Backend:**
\`\`\`bash
cd server
npm start
# or for development with auto-reload
npm run dev
\`\`\`

**Terminal 2 - Start Frontend:**
\`\`\`bash
cd client
npm start
\`\`\`

The application will open at \`http://localhost:3000\`

## 📁 Project Structure

\`\`\`
realtime-chat-app/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Auth/      # Login & Register
│       │   └── Chat/      # Chat components
│       ├── context/       # React Context (Auth & Socket)
│       ├── config/        # API configuration
│       ├── App.js
│       └── index.js
│
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── middleware/       # Auth middleware
│   ├── socket/           # Socket.io handlers
│   └── server.js         # Entry point
│
└── README.md
\`\`\`

## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user

### Users
- \`GET /api/users\` - Get all users
- \`GET /api/users/search?query=\` - Search users

### Messages
- \`GET /api/messages/:userId\` - Get conversation with user
- \`PUT /api/messages/read/:userId\` - Mark messages as read
- \`GET /api/messages/unread/count\` - Get unread count

## 🔄 Socket Events

### Client → Server
- \`send-message\` - Send a message
- \`typing\` - Typing indicator
- \`mark-read\` - Mark messages as read

### Server → Client
- \`receive-message\` - Receive new message
- \`message-sent\` - Confirmation of sent message
- \`user-typing\` - User typing status
- \`user-status\` - User online/offline status
- \`online-users\` - List of online users

## 🚢 Deployment

### Deploy to Railway

1. **Backend Deployment:**
   - Create a new project on [Railway](https://railway.app)
   - Add MongoDB plugin
   - Deploy from GitHub repository
   - Set environment variables

2. **Frontend Deployment:**
   - Build the React app: \`npm run build\`
   - Deploy to Vercel, Netlify, or Railway
   - Update environment variables with production URLs

### Environment Variables for Production

**Backend:**
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
CLIENT_URL=your_frontend_url
\`\`\`

**Frontend:**
\`\`\`env
REACT_APP_API_URL=your_backend_api_url
REACT_APP_SOCKET_URL=your_backend_socket_url
\`\`\`

## 🧪 Testing

Create test accounts:
1. Register multiple users
2. Login with different accounts in different browsers
3. Test real-time messaging
4. Verify online/offline status
5. Check typing indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Rahul Mishra**
- GitHub: [@rahul700raj](https://github.com/rahul700raj)
- Email: rm2778643@gmail.com

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for database
- React team for the amazing framework
- All contributors and users

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

Made with ❤️ by Rahul Mishra
