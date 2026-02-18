# Deployment Guide

This guide will help you deploy the Real-Time Chat Application to production.

## 🚀 Railway Deployment (Recommended)

Railway is a modern platform that makes deployment simple and provides MongoDB hosting.

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### Step 2: Deploy Backend to Railway

1. **Create New Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add MongoDB**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will provision a MongoDB instance
   - Copy the connection string

3. **Configure Backend Service**
   - Click on your backend service
   - Go to "Variables" tab
   - Add environment variables:
     \`\`\`
     PORT=5000
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<generate-a-secure-random-string>
     NODE_ENV=production
     CLIENT_URL=<your-frontend-url>
     \`\`\`

4. **Set Root Directory**
   - Go to "Settings" tab
   - Set "Root Directory" to \`server\`
   - Set "Start Command" to \`npm start\`

5. **Deploy**
   - Railway will automatically deploy
   - Note your backend URL (e.g., \`https://your-app.railway.app\`)

### Step 3: Deploy Frontend

#### Option A: Deploy to Vercel

1. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Build and Deploy**
   \`\`\`bash
   cd client
   vercel
   \`\`\`

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     \`\`\`
     REACT_APP_API_URL=https://your-backend.railway.app/api
     REACT_APP_SOCKET_URL=https://your-backend.railway.app
     \`\`\`

4. **Redeploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

#### Option B: Deploy to Netlify

1. **Build the App**
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the \`build\` folder
   - Or connect your GitHub repository

3. **Set Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add:
     \`\`\`
     REACT_APP_API_URL=https://your-backend.railway.app/api
     REACT_APP_SOCKET_URL=https://your-backend.railway.app
     \`\`\`

### Step 4: Update CORS Settings

Update your backend \`server.js\` to allow your frontend domain:

\`\`\`javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-frontend.vercel.app',
      'https://your-frontend.netlify.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app'
  ],
  credentials: true
}));
\`\`\`

## 🔧 Alternative: Deploy Both on Railway

### Backend Service
1. Create a new service from your GitHub repo
2. Set root directory to \`server\`
3. Add environment variables
4. Deploy

### Frontend Service
1. Create another service from the same repo
2. Set root directory to \`client\`
3. Add build command: \`npm run build\`
4. Add start command: \`npx serve -s build -l $PORT\`
5. Add environment variables
6. Deploy

## 🌐 Custom Domain (Optional)

### Railway
1. Go to your service settings
2. Click "Generate Domain" or add custom domain
3. Follow DNS configuration instructions

### Vercel/Netlify
1. Go to domain settings
2. Add your custom domain
3. Update DNS records as instructed

## 🔒 Security Checklist

Before going to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS (automatic on Railway/Vercel/Netlify)
- [ ] Set up proper CORS origins
- [ ] Add rate limiting (optional)
- [ ] Set up monitoring and logging
- [ ] Configure MongoDB authentication
- [ ] Review and update security headers

## 📊 Monitoring

### Railway
- Built-in metrics and logs
- Go to your service → Metrics tab

### MongoDB
- Use MongoDB Atlas for production
- Enable monitoring and alerts

## 🐛 Troubleshooting

### Common Issues

1. **Socket.io Connection Failed**
   - Check CORS settings
   - Verify REACT_APP_SOCKET_URL is correct
   - Ensure backend is running

2. **MongoDB Connection Error**
   - Verify MONGODB_URI is correct
   - Check MongoDB service is running
   - Whitelist IP addresses (if using MongoDB Atlas)

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

## 📝 Environment Variables Reference

### Backend (.env)
\`\`\`env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatapp
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
\`\`\`

### Frontend (.env)
\`\`\`env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.com
\`\`\`

## 🎉 Post-Deployment

After successful deployment:

1. Test all features:
   - User registration
   - Login/logout
   - Sending messages
   - Real-time updates
   - Online/offline status
   - Typing indicators

2. Monitor logs for errors

3. Set up analytics (optional)

4. Share your app!

## 💡 Tips

- Use MongoDB Atlas for production database
- Enable automatic deployments from GitHub
- Set up staging environment for testing
- Use environment-specific configurations
- Keep dependencies updated
- Monitor application performance

---

Need help? Open an issue on GitHub or contact the maintainer.
