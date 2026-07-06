// Password Reset Utility Functions
// For use with Node.js/Express backend

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Generate a secure reset token
 * @returns {string} - Secure reset token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Generate JWT token for password reset (alternative method)
 * @param {string} email - User email
 * @param {string} secretKey - Secret key from environment
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {string} - JWT token
 */
const generateJWTResetToken = (email, secretKey, expiresIn = 3600) => {
  return jwt.sign({ email, purpose: "password-reset" }, secretKey, {
    expiresIn,
  });
};

/**
 * Verify JWT reset token
 * @param {string} token - JWT token
 * @param {string} secretKey - Secret key from environment
 * @returns {object} - Decoded token data or null if invalid
 */
const verifyResetToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.purpose === "password-reset") {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
const comparePassword = async (password, hash) => {
  const bcrypt = require("bcrypt");
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateResetToken,
  generateJWTResetToken,
  verifyResetToken,
  hashPassword,
  comparePassword,
};
