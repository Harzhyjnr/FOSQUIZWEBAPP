import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserAuth.css";
import { forgotPassword } from "../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccessMessage(
        `Password reset instructions have been sent to ${email}. Check your inbox.`,
      );
      setEmailSent(true);
      setEmail("");
      setErrors({});
    } catch (error) {
      setErrors({
        general:
          error?.data?.message ||
          error.message ||
          "Failed to process request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-description">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="password-input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="form-group">
            <p className="success-text">
              ✓ If an account exists with this email, you'll receive password
              reset instructions shortly.
            </p>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
