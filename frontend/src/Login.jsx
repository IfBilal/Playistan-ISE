import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./contexts/LanguageContext.jsx";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // SAVE USER TO LOCALSTORAGE - THIS WAS MISSING!
        localStorage.setItem("user", JSON.stringify(data.data.user));
        
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
    navigate("/signup");
  };

  const handleGuestAccess = () => {
    navigate("/guesthome");
  };

  return (
    <div className="login-page">
      <div className="stars"></div>

      <div className="login-card">
        <h1 className="login-title">Playistan</h1>
        <p className="login-subtitle">{t('signInToAccount')}</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <label>{t('username')}</label>
          <input
            type="text"
            name="username"
            placeholder={t('enterUsername')}
            value={formData.username}
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t('signingIn') : t('signIn')}
          </button>

          <button 
            type="button" 
            className="guest-btn" 
            onClick={handleGuestAccess}
          >
            {t('continueAsGuest')}
          </button>
        </form>

        <p className="signup-text">
          {t('dontHaveAccount')}{" "}
          <a href="#" onClick={handleSignUp}>
            {t('signUpHere')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;