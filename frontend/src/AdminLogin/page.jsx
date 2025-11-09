import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Apply login background styling
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please enter both username and password." });
      return;
    }

    // Example credentials
    if (username === "admin" && password === "admin123") {
      setMessage({ type: "success", text: "Login successful! Redirecting to dashboard..." });
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } else {
      setMessage({ type: "error", text: "Incorrect username or password." });
    }
  };

  return (
    <>
      <div className="stars"></div>

      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>Admin Login</h1>
          </div>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}