import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import "./Page.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store email for OTP verification
        localStorage.setItem("verificationEmail", formData.email);
        
        // Navigate to OTP verification page
        navigate("/otp");
      } else {
        setError(data.message || "Sign up failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="stars"></div>

      <div className="signup-card">
        <h1 className="signup-title">Playistan</h1>
        <p className="signup-subtitle">{t('signup')}</p>

        {error && <div className="error-message">{error}</div>}

        <form className="signup-form" onSubmit={handleSignUp}>
          <label>{t('username')}</label>
          <input
            type="text"
            name="username"
            placeholder={t('enterUsername')}
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>{t('email')}</label>
          <input
            type="email"
            name="email"
            placeholder={t('enterEmail')}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>{t('password')}</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? t('loading') : t('signup')}
          </button>
        </form>

        <p className="login-text">
          {t('alreadyHaveAccount')}{" "}
          <a href="#" onClick={handleBackToLogin}>
            {t('signInHere')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;