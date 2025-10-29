import React from "react";
import "./Login.css";

const Login = () => {
  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login button clicked!");
    // Add your login logic here
  };

  // Handle forgot password click
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password clicked!");
    // Add your forgot password logic here
  };

  // Handle sign up click
  const handleSignUp = (e) => {
    e.preventDefault();
    alert("Sign up clicked!");
    // Add your sign up navigation logic here
  };

  return (
    <div className="login-page">
      <div className="stars"></div>

      <div className="login-card">
        <h1 className="login-title">Playistan</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" placeholder="your@email.com" required />

          <label>Password</label>
          <input type="password" placeholder="••••••••" required />

          <a 
            href="#" 
            onClick={handleForgotPassword}
            style={{ textAlign: "right", fontSize: "0.8rem", color: "#00ff99" }}
          >
            Forgot password?
          </a>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="#" onClick={handleSignUp}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;