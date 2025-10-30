import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(data.data.user));
        
        // Navigate to homepage
        navigate("/homepage");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signup");  // Changed back to lowercase to match route
  };

  // New function: Go to guest homepage
  const handleGuestAccess = () => {
    navigate("/guesthome");
  };

  return (
    <div className="login-page">
      <div className="stars"></div>

      <div className="login-card">
        <h1 className="login-title">Playistan</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Guest Access Button */}
          <button 
            type="button" 
            className="guest-btn" 
            onClick={handleGuestAccess}
          >
            Continue as Guest
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <a href="#" onClick={handleSignUp}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;