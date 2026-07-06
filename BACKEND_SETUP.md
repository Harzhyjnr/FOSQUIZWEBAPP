# Password Reset Feature - Backend Implementation Guide

## Overview

This guide provides complete instructions for implementing the forgot password functionality on the backend using Node.js/Express.

## Frontend Flow

1. User clicks "Forgot Password" on login page
2. User enters email address
3. System generates reset token and sends email
4. User clicks link in email
5. User enters new password and confirms it
6. Password is updated in database

---

## Backend Setup

### 1. Install Required Packages

```bash
npm install express bcrypt jsonwebtoken dotenv cors express-validator
npm install nodemailer  # For email sending
```

For email services, choose one:

```bash
npm install @sendgrid/mail  # SendGrid
npm install mailgun.js      # Mailgun
npm install aws-sdk         # AWS SES
```

### 2. Environment Variables (.env file)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz-app
MONGOOSE_URI=mongodb://localhost:27017/quiz-app

# JWT & Security
JWT_SECRET=your_jwt_secret_key_here
JWT_RESET_SECRET=your_reset_secret_key_here
JWT_EXPIRY=7d
RESET_TOKEN_EXPIRY=1h

# Email Configuration (Choose one)
# Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@quizapp.com

# Mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mail.quizapp.com
MAILGUN_FROM_EMAIL=noreply@quizapp.com

# Frontend
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Schema (MongoDB with Mongoose)

Create `models/User.js`:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  resetToken: String,
  resetTokenExpiry: Date,
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

### 4. Authentication Middleware

Create `middleware/auth.js`:

```javascript
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;
```

### 5. Email Service Implementation

See `emailService.js` for detailed email sending options.

**Example with SendGrid:**

```javascript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (email, resetLink) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Password Reset Request",
    html: generatePasswordResetEmailHTML(resetLink),
  };

  await sgMail.send(msg);
};
```

**Example with Gmail:**

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: generatePasswordResetEmailHTML(resetLink),
  };

  await transporter.sendMail(mailOptions);
};
```

### 6. Server.js Configuration

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 7. Auth Routes (Full Implementation)

See `backendAuthRoutes.js` for complete API endpoints.

**Endpoints:**

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-reset-token` - Verify reset token validity
- `POST /api/auth/change-password` - Change password for authenticated user

---

## Frontend Integration

### API Service File (Frontend)

Create `src/services/authService.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api/auth";

export const authService = {
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  resetPassword: async (token, email, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword }),
    });
    return response.json();
  },

  verifyResetToken: async (token, email) => {
    const response = await fetch(`${API_BASE_URL}/verify-reset-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    });
    return response.json();
  },

  changePassword: async (currentPassword, newPassword, token) => {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
};
```

---

## Security Best Practices

1. **Password Hashing**: Use bcrypt with at least 10 salt rounds
2. **Token Expiry**: Reset tokens expire after 1 hour
3. **Rate Limiting**: Implement rate limiting on password reset endpoint
4. **HTTPS**: Always use HTTPS in production
5. **Email Verification**: Consider requiring email verification for new accounts
6. **Logging**: Log all password reset attempts
7. **Validation**: Validate email and password on both frontend and backend
8. **CORS**: Configure CORS properly in production
9. **JWT Secret**: Use strong, random JWT secrets
10. **Environment Variables**: Never commit .env files to version control

---

## Implementation Checklist

- [ ] Install required packages
- [ ] Set up environment variables
- [ ] Create User model with reset token fields
- [ ] Implement email service
- [ ] Create authentication routes
- [ ] Add auth middleware
- [ ] Test forgot password flow
- [ ] Test reset password flow
- [ ] Implement rate limiting
- [ ] Add logging
- [ ] Test email delivery
- [ ] Deploy to production

---

## Testing

### Manual Testing

1. Click "Forgot Password" on login page
2. Enter email address
3. Check email for reset link
4. Click reset link
5. Enter new password
6. Verify password is updated

### API Testing with Curl

```bash
# Request password reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"reset_token_here",
    "email":"user@example.com",
    "newPassword":"NewPassword123"
  }'
```

---

## Troubleshooting

### Email not sending

- Check SMTP credentials
- Verify email service API keys
- Check firewall/network settings
- Review email service logs

### Reset token invalid

- Verify token hasn't expired (1 hour)
- Check token format matches
- Ensure email matches user in database

### Password validation failing

- Ensure password meets requirements (6+ chars, uppercase, lowercase, number)
- Check for special characters

---

## Additional Resources

- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Documentation](https://github.com/auth0/node-jsonwebtoken)
- [SendGrid Email API](https://sendgrid.com/docs/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
