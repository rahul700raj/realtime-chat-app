# Architecture Overview

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │   Context    │  │   Socket.io  │      │
│  │  Components  │◄─┤   Providers  │◄─┤    Client    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    HTTP/WebSocket
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                            │         SERVER SIDE              │
├────────────────────────────┼─────────────────────────────────┤
│                            ▼                                 │
│  ┌──────────────────────────────────────────────┐           │
│  │           Express.js Server                   │           │
│  └──────────────────────────────────────────────┘           │
│         │                           │                        │
│         ▼                           ▼                        │
│  ┌─────────────┐           ┌──────────────┐                │
│  │  REST API   │           │  Socket.io   │                │
│  │   Routes    │           │   Handler    │                │
│  └─────────────┘           └──────────────┘                │
│         │                           │                        │
│         ▼                           │                        │
│  ┌─────────────┐                   │                        │
│  │ Middleware  │                   │                        │
│  │   (Auth)    │                   │                        │
│  └─────────────┘                   │                        │
│         │                           │                        │
│         └───────────┬───────────────┘                        │
│                     ▼                                        │
│         ┌──────────────────────┐                            │
│         │   MongoDB Database   │                            │
│         │  ┌────────────────┐  │                            │
│         │  │  Users Model   │  │                            │
│         │  └────────────────┘  │                            │
│         │  ┌────────────────┐  │                            │
│         │  │ Messages Model │  │                            │
│         │  └────────────────┘  │                            │
│         └──────────────────────┘                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
\`\`\`

## Component Breakdown

### Frontend (React)

#### 1. **Components**
- \`Auth/Login.js\` - User login interface
- \`Auth/Register.js\` - User registration interface
- \`Chat/Chat.js\` - Main chat container
- \`Chat/UserList.js\` - List of available users
- \`Chat/ChatWindow.js\` - Message display and input

#### 2. **Context Providers**
- \`AuthContext\` - Manages user authentication state
- \`SocketContext\` - Manages WebSocket connections

#### 3. **Configuration**
- \`api.js\` - Axios instance with interceptors

### Backend (Node.js + Express)

#### 1. **Models**
\`\`\`javascript
User {
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  isOnline: Boolean,
  lastSeen: Date
}

Message {
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  read: Boolean,
  readAt: Date,
  createdAt: Date
}
\`\`\`

#### 2. **Routes**
- \`/api/auth/*\` - Authentication endpoints
- \`/api/users/*\` - User management endpoints
- \`/api/messages/*\` - Message endpoints

#### 3. **Socket Events**
- \`connection\` - User connects
- \`send-message\` - Send a message
- \`receive-message\` - Receive a message
- \`typing\` - Typing indicator
- \`user-status\` - Online/offline status
- \`disconnect\` - User disconnects

## Data Flow

### 1. Authentication Flow
\`\`\`
User Input → Login Component → API Call → JWT Token → 
LocalStorage → Auth Context → Protected Routes
\`\`\`

### 2. Message Flow
\`\`\`
User Types → ChatWindow → Socket Emit → Server → 
Database Save → Socket Broadcast → Receiver → UI Update
\`\`\`

### 3. Real-time Updates
\`\`\`
User Action → Socket Event → Server Handler → 
Broadcast to Clients → UI Update
\`\`\`

## Security Features

1. **Password Hashing** - bcryptjs with salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **Protected Routes** - Middleware validation
4. **CORS Configuration** - Controlled access
5. **Input Validation** - Mongoose validators
6. **XSS Protection** - React's built-in protection

## Performance Optimizations

1. **Database Indexing** - Indexed queries for messages
2. **Socket.io Rooms** - Efficient message routing
3. **React Memoization** - Prevent unnecessary re-renders
4. **Lazy Loading** - Code splitting (can be added)
5. **Connection Pooling** - MongoDB connection management

## Scalability Considerations

### Current Architecture
- Single server instance
- Direct Socket.io connections
- MongoDB single instance

### Future Improvements
1. **Load Balancing** - Multiple server instances
2. **Redis Adapter** - Socket.io scaling
3. **Message Queue** - RabbitMQ/Redis for async tasks
4. **CDN** - Static asset delivery
5. **Database Sharding** - Horizontal scaling
6. **Microservices** - Service separation

## Technology Stack Details

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Socket.io Client** - WebSocket client
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **Socket.io** - WebSocket server
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - Schema validation and queries

## API Endpoints

### Authentication
\`\`\`
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
\`\`\`

### Users
\`\`\`
GET    /api/users            - Get all users
GET    /api/users/search     - Search users
\`\`\`

### Messages
\`\`\`
GET    /api/messages/:userId       - Get conversation
PUT    /api/messages/read/:userId  - Mark as read
GET    /api/messages/unread/count  - Unread count
\`\`\`

## Socket Events Reference

### Client → Server
\`\`\`javascript
socket.emit('send-message', { receiverId, content })
socket.emit('typing', { receiverId, isTyping })
socket.emit('mark-read', { senderId })
\`\`\`

### Server → Client
\`\`\`javascript
socket.on('receive-message', (message) => {})
socket.on('message-sent', (message) => {})
socket.on('user-typing', ({ userId, isTyping }) => {})
socket.on('user-status', ({ userId, isOnline }) => {})
socket.on('online-users', (userIds) => {})
\`\`\`

## Error Handling

### Frontend
- API interceptors for 401 errors
- Try-catch blocks for async operations
- User-friendly error messages

### Backend
- Mongoose validation errors
- JWT verification errors
- Database connection errors
- Socket authentication errors

## Testing Strategy (Future)

1. **Unit Tests** - Jest for components and functions
2. **Integration Tests** - API endpoint testing
3. **E2E Tests** - Cypress for user flows
4. **Socket Tests** - Socket.io testing utilities

---

This architecture provides a solid foundation for a real-time chat application with room for growth and optimization.
