import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ Send cookies (JWT)
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => navigate("/Homepage"), 1200);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <>
      <div className="stars"></div>

      <div className="change-password-container">
        {/* 🔙 Back Arrow */}
        <button
          className="back-arrow"
          onClick={() => navigate("/Homepage")}
          aria-label="Go to Homepage"
        >
          ←
        </button>

        <div className="change-password-card">
          <div className="change-password-header">
            <h1>Change Password</h1>
            <p>Enter your current and new password below</p>
          </div>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleChange} className="change-password-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-button">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
