# 🚀 Backend Setup - Quick Start Guide

Your backend is now organized in its own separate folder! Here's how to get it running.

## 📁 Backend Folder Structure

```
backend/
├── server.js              ← Main entry point
├── package.json           ← Dependencies
├── .env.example          ← Environment template
├── README.md             ← Full documentation
│
├── models/
│   └── User.js           ← User database schema
│
├── controllers/
│   └── authController.js ← Authentication logic
│
├── routes/
│   ├── authRoutes.js     ← Auth endpoints
│   ├── userRoutes.js     ← User endpoints
│   └── quizRoutes.js     ← Quiz endpoints
│
├── middleware/
│   └── auth.js           ← JWT authentication middleware
│
└── utils/
    ├── tokenUtils.js     ← Token generation
    └── emailService.js   ← Email sending
```

---

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Setup Environment

```bash
cp .env.example .env
```

Edit `.env` file and add:

```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_secret_key_here
JWT_RESET_SECRET=your_reset_secret_here
PORT=5000
FRONTEND_URL=http://localhost:3000
EMAIL_PROVIDER=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3️⃣ Start MongoDB

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or local installation
mongod
```

### 4️⃣ Start Backend Server

```bash
npm run dev
```

You should see:

```
╔════════════════════════════════════╗
║  Quiz App Backend Server            ║
║  Running on http://localhost:5000   ║
║  Environment: development           ║
╚════════════════════════════════════╝
```

---

## 📝 Next Steps

1. **Frontend Integration**: See `INTEGRATION_GUIDE.md`
2. **Full Documentation**: See `backend/README.md`
3. **Email Setup**: Configure email in `.env`
4. **API Testing**: Use provided cURL examples

---

## ✅ Verify Backend is Working

Open your browser and go to:

```
http://localhost:5000/api/health
```

You should see:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-05-30T..."
}
```

---

## 🔗 API Endpoints Overview

### Authentication Routes

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-reset-token
POST /api/auth/change-password (Protected)
```

### User Routes

```
GET /api/user/profile (Protected)
```

### Quiz Routes

```
GET /api/quiz/all
GET /api/quiz/:id
POST /api/quiz/submit (Protected)
```

---

## 🐛 Troubleshooting

### MongoDB not connecting?

```bash
# Check if MongoDB is running
mongod --version

# Or start with Docker
docker run -d -p 27017:27017 mongo
```

### Port 5000 already in use?

```bash
# Change PORT in .env
PORT=5001
```

### Email not sending?

- For Gmail: Generate app password
- Check email credentials in .env
- Verify FRONTEND_URL is correct

---

## 📚 More Information

- **Backend README**: `backend/README.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Password Reset Details**: `FORGOT_PASSWORD_README.md`
- **Full Setup**: `BACKEND_SETUP.md`

---

**✨ Backend is ready to use!**

Next: Update frontend components to call backend APIs (see `INTEGRATION_GUIDE.md`)
