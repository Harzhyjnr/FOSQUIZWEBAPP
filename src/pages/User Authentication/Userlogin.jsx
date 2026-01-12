import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserAuth.css";

const Userlogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - Replace with your actual backend authentication
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email === formData.email);

      if (!user) {
        setErrors({ general: "User not found. Please sign up first." });
        setLoading(false);
        return;
      }

      if (user.password !== formData.password) {
        setErrors({ general: "Incorrect password." });
        setLoading(false);
        return;
      }

      // Successful login - include isAdmin flag if present
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false,
        })
      );

      // Reset form
      setFormData({ email: "", password: "" });
      setErrors({});

      // Show success alert
      alert("Login successfully!");

      // Redirect to admin dashboard if admin, otherwise home
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login to Quiz App</h1>

        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Userlogin;
