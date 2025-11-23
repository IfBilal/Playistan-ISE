import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import GroundCard from './GroundCard.jsx'; // Corrected import path
import "./Page.css"; // Corrected import path

const GuestHome = () => {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/grounds`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch grounds");
      }

      const data = await response.json();
      setGrounds(data.data || []);
    } catch (error) {
      console.error('Error fetching grounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeUser = () => {
    navigate('/signup');
  };

  const handleAddGround = () => {
    navigate('/addground'); // Navigates to the route we set up in main.jsx
  };

  const filteredGrounds = selectedCity === 'all'
    ? grounds
    : grounds.filter(ground => ground.city.toLowerCase() === selectedCity.toLowerCase());

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="loading-spinner"></div>
        <p>Loading grounds...</p>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-logo">PLAYISTAN</h1>
          <nav className="header-nav">
            <button className="nav-btn-user" onClick={handleBecomeUser}>
              {t('signup')}
            </button>
            <button className="nav-btn-add-ground" onClick={handleAddGround}>
              {t('addGround')}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">{t('findGround')}</h2>
          <p className="hero-subtitle">{t('searchPlaceholder')}</p>

          {/* City Filter */}
          <div className="filter-bar">
            <svg className="filter-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select
              className="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              <option value="islamabad">Islamabad</option>
              <option value="rawalpindi">Rawalpindi</option>
              <option value="lahore">Lahore</option>
              <option value="karachi">Karachi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grounds Section */}
      <section className="grounds-section">
        <div className="grounds-container">
          {filteredGrounds.length > 0 ? (
            <div className="grounds-grid">
              {filteredGrounds.map((ground) => (
                <GroundCard key={ground._id} ground={ground} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <h3>{t('noGroundsFound')}</h3>
              <p>{t('searchPlaceholder')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2024 Ground Booking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestHome;