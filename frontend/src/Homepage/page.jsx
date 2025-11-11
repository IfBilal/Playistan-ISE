import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroundCard from './GroundCard';
import './Page.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState([]);
  const [filteredGrounds, setFilteredGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/grounds', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grounds');
      }

      const data = await response.json();

      if (Array.isArray(data.data) && data.data.length > 0) {
        setGrounds(data.data);
        setFilteredGrounds(data.data);
      } else {
        setGrounds([]);
        setFilteredGrounds([]);
      }
    } catch (error) {
      console.error('Error fetching grounds:', error);
      setError('Failed to load grounds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityFilter = async (city) => {
    setSelectedCity(city);

    if (city === 'all') {
      setFilteredGrounds(grounds);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/grounds/filter-by-city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ city }),
      });

      const data = await response.json();
      setFilteredGrounds(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Filter error:', error);
      setError('Failed to filter grounds');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="loading-spinner"></div>
        <p>Loading grounds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchGrounds} className="nav-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-logo">Playistan</h1>
          <nav className="header-nav">
            <button onClick={handleChangePassword} className="nav-btn">
              Change Password
            </button>
            <button onClick={handleLogout} className="nav-btn-user">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Choose from {grounds.length} premium football grounds
          </h1>
          <p className="hero-subtitle">
            Book your favorite sports ground in just a few clicks
          </p>

          {/* Filter Bar */}
          <div className="filter-bar">
            <svg
              className="filter-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <select
              className="city-filter"
              value={selectedCity}
              onChange={(e) => handleCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Lahore">Lahore</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grounds Grid */}
      <section className="grounds-section">
        <div className="grounds-container">
          {filteredGrounds.length === 0 ? (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <h3>No grounds available right now</h3>
              <p>New grounds will be added soon — stay tuned!</p>
            </div>
          ) : (
            <div className="grounds-grid">
              {filteredGrounds.map((ground) => (
                <GroundCard key={ground._id} ground={ground} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2024 Playistan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
