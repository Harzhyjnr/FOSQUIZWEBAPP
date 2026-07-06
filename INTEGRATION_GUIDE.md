# Frontend to Backend Integration Guide

This guide explains how to connect the React frontend to the Node.js backend for the password reset feature and other authentication functions.

## 📋 Quick Reference

| File                                    | Purpose                       |
| --------------------------------------- | ----------------------------- |
| `src/utils/authService.js`              | Frontend API calls            |
| `backend/server.js`                     | Backend main server           |
| `backend/routes/authRoutes.js`          | Backend authentication routes |
| `backend/controllers/authController.js` | Backend authentication logic  |

---

## 🔗 Frontend Integration Steps

### 1. Create Frontend API Service

Create `src/services/authService.js`:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const authService = {
  // Register
  register: async (name, email, password, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    return response.json();
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  // Reset Password
  resetPassword: async (token, email, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword }),
    });
    return response.json();
  },

  // Verify Reset Token
  verifyResetToken: async (token, email) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    });
    return response.json();
  },

  // Change Password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    return response.json();
  },
};
```

### 2. Setup Environment Variables for Frontend

Create `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Update ForgotPassword.jsx Component

Replace the localStorage-based implementation with backend API calls:

```javascript
import { authService } from "../services/authService";

// In handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail()) {
    return;
  }

  setLoading(true);

  try {
    const result = await authService.forgotPassword(email);

    if (result.success) {
      setSuccessMessage(
        `Password reset instructions have been sent to ${email}`,
      );
      setEmailSent(true);
    } else {
      setErrors({ general: result.message });
    }
  } catch (error) {
    setErrors({ general: "Failed to process request. Please try again." });
  } finally {
    setLoading(false);
  }
};
```

### 4. Update ResetPassword.jsx Component

```javascript
import { authService } from "../services/authService";

// In handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const result = await authService.resetPassword(
      resetToken,
      resetEmail,
      formData.newPassword,
    );

    if (result.success) {
      setSuccessMessage(
        "✓ Your password has been reset successfully! Redirecting to login...",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setErrors({ general: result.message });
    }
  } catch (error) {
    setErrors({ general: "Failed to reset password. Please try again." });
  } finally {
    setLoading(false);
  }
};
```

### 5. Update Userlogin.jsx Component

```javascript
import { authService } from "../services/authService";

// In handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const result = await authService.login(formData.email, formData.password);

    if (result.success) {
      // Store token
      localStorage.setItem("authToken", result.token);

      // Store user
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isAdmin: result.user.isAdmin || false,
        }),
      );

      alert("Login successfully!");

      if (result.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setErrors({ general: result.message });
    }
  } catch (error) {
    setErrors({ general: "Login failed. Please try again." });
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Complete Flow Diagram

```
Frontend                          Backend
---------                         -------

1. User clicks "Forgot Password"
   ↓
2. Navigate to /forgot-password
   ↓
3. User enters email
   ↓
4. Click "Send Reset Link"
   └────────────────────────→ POST /api/auth/forgot-password
                              ├─ Validate email
                              ├─ Find user in DB
                              ├─ Generate JWT token
                              └─ Send email with reset link
                              ←────────────────────────┘
   ↓
5. Show success message
   ↓
6. User checks email
   ↓
7. Click reset link in email
   ├─ Extract token from URL
   └─ Navigate to /reset-password?token=XXX&email=YYY
   ↓
8. Verify token (optional)
   └────────────────────────→ POST /api/auth/verify-reset-token
                              ├─ Decode JWT token
                              └─ Return validation result
                              ←────────────────────────┘
   ↓
9. User enters new password
   ↓
10. Click "Reset Password"
    └────────────────────────→ POST /api/auth/reset-password
                              ├─ Verify token
                              ├─ Validate password
                              ├─ Hash password
                              ├─ Update user in DB
                              └─ Return success
                              ←────────────────────────┘
    ↓
11. Redirect to login
    ↓
12. User logs in with new password
    └────────────────────────→ POST /api/auth/login
                              ├─ Validate credentials
                              ├─ Generate JWT token
                              └─ Return token & user
                              ←────────────────────────┘
    ↓
13. Store token in localStorage
    ↓
14. Redirect to home/dashboard
```

---

## 🗂️ Folder Structure After Integration

```
Quiz-App/
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── User Authentication/
│       │       ├── ForgotPassword.jsx (updated)
│       │       ├── ResetPassword.jsx (updated)
│       │       └── Userlogin.jsx (updated)
│       ├── services/
│       │   └── authService.js (new)
│       └── .env (new)
│
└── backend/
    ├── server.js
    ├── package.json
    ├── .env
    ├── models/
    │   └── User.js
    ├── controllers/
    │   └── authController.js
    ├── routes/
    │   └── authRoutes.js
    ├── middleware/
    │   └── auth.js
    └── utils/
        ├── tokenUtils.js
        └── emailService.js
```

---

## ⚙️ Step-by-Step Setup

### Step 1: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Step 2: Setup Frontend

```bash
cd ..  # Go back to root
npm install  # If needed
# Create .env file with REACT_APP_API_URL
npm start
```

### Step 3: Test the Flow

1. Go to http://localhost:3000/login
2. Click "Forgot Password?"
3. Enter email
4. Check terminal output for reset link
5. Copy reset link to browser
6. Enter new password
7. Login with new password

---

## 🧪 Testing Endpoints

### Test in Postman or cURL

**1. Forgot Password**

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**2. Reset Password**

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"your_token_here",
    "email":"test@example.com",
    "newPassword":"NewPass123"
  }'
```

---

## 🔐 Token Management

### Store Token

```javascript
// After successful login
localStorage.setItem("authToken", result.token);
```

### Get Token for Requests

```javascript
const token = localStorage.getItem("authToken");
```

### Use Token in Headers

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Clear Token on Logout

```javascript
localStorage.removeItem("authToken");
localStorage.removeItem("user");
```

---

## ❌ Common Issues & Solutions

### Issue: CORS Error

**Solution**: Ensure FRONTEND_URL in backend .env matches frontend URL

### Issue: "API is not defined"

**Solution**: Make sure authService is imported and API_BASE_URL is correct

### Issue: Token not working

**Solution**: Check token format - should be "Bearer <token>"

### Issue: Email not sending

**Solution**:

- Check email credentials
- For Gmail: use app password, not regular password
- Check FRONTEND_URL for reset link

### Issue: Reset link broken

**Solution**: Verify reset link format in email includes token and email params

---

## 📡 API Response Examples

### Successful Reset Password

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## 🎯 Next Steps

1. ✅ Create authService.js
2. ✅ Setup backend .env
3. ✅ Start backend server
4. ✅ Update frontend components
5. ✅ Test complete flow
6. ✅ Deploy to production

---

## 📚 Additional Resources

- Backend README: `backend/README.md`
- Forgot Password README: `FORGOT_PASSWORD_README.md`
- Backend Setup Guide: `BACKEND_SETUP.md`

---

**Integration Complete!** Your frontend is now connected to the backend API.
