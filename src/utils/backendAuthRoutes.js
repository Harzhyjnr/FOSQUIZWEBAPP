// Backend API Routes for Password Reset
// This is a template for Node.js/Express backend
// Install required packages: npm install express bcrypt jsonwebtoken dotenv

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  generateResetToken,
  generateJWTResetToken,
  verifyResetToken,
  hashPassword,
  comparePassword,
} = require("../utils/passwordResetUtils");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");

// Assuming you have a User model/database
// const User = require('../models/User');

/**
 * POST /api/auth/forgot-password
 * Request body: { email: "user@example.com" }
 * Response: { success: boolean, message: string }
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Find user by email
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'No account found with this email address',
    //   });
    // }

    // Generate reset token (Method 1: Simple token)
    const resetToken = generateResetToken();

    // OR Generate JWT token (Method 2: JWT token - more secure)
    // const resetToken = generateJWTResetToken(
    //   email,
    //   process.env.JWT_SECRET,
    //   3600 // 1 hour expiry
    // );

    // Save token to database with expiry
    // const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    // user.resetToken = resetToken;
    // user.resetTokenExpiry = tokenExpiry;
    // await user.save();

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, resetLink);

    return res.status(200).json({
      success: true,
      message:
        "Password reset instructions have been sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Request body: {
 *   token: "reset_token_here",
 *   email: "user@example.com",
 *   newPassword: "newPassword123"
 * }
 * Response: { success: boolean, message: string }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // Validate input
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, email, and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, and numeric characters",
      });
    }

    // Find user by email
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found',
    //   });
    // }

    // Verify reset token
    // Check if token is valid and not expired
    // if (user.resetToken !== token) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid reset token',
    //   });
    // }

    // if (user.resetTokenExpiry < new Date()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Reset token has expired',
    //   });
    // }

    // OR verify JWT token
    // const decoded = verifyResetToken(token, process.env.JWT_SECRET);
    // if (!decoded || decoded.email !== email) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid or expired reset token',
    //   });
    // }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    // user.password = hashedPassword;
    // user.resetToken = null;
    // user.resetTokenExpiry = null;
    // user.passwordChangedAt = new Date();
    // await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
});

/**
 * POST /api/auth/verify-reset-token
 * Request body: { token: "reset_token_here", email: "user@example.com" }
 * Response: { valid: boolean, message: string }
 */
router.post("/verify-reset-token", async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        valid: false,
        message: "Token and email are required",
      });
    }

    // Find user and verify token
    // const user = await User.findOne({ email });
    // if (!user || user.resetToken !== token) {
    //   return res.status(400).json({
    //     valid: false,
    //     message: 'Invalid reset token',
    //   });
    // }

    // if (user.resetTokenExpiry < new Date()) {
    //   return res.status(400).json({
    //     valid: false,
    //     message: 'Reset token has expired',
    //   });
    // }

    return res.status(200).json({
      valid: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({
      valid: false,
      message: "Failed to verify reset token",
    });
  }
});

/**
 * POST /api/auth/change-password (For authenticated users)
 * Request body: {
 *   currentPassword: "oldPassword123",
 *   newPassword: "newPassword123"
 * }
 * Response: { success: boolean, message: string }
 */
router.post("/change-password", async (req, res) => {
  try {
    // Verify user is authenticated (use middleware)
    // const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Find user
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found',
    //   });
    // }

    // Verify current password
    // const isPasswordValid = await comparePassword(currentPassword, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Current password is incorrect',
    //   });
    // }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain uppercase, lowercase, and numeric characters",
      });
    }

    // Hash and update password
    // const hashedPassword = await hashPassword(newPassword);
    // user.password = hashedPassword;
    // user.passwordChangedAt = new Date();
    // await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
});

module.exports = router;
