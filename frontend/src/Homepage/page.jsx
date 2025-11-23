import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroundCard from './GroundCard';
import "./Page.css";

const Homepage = () => {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/grounds`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch grounds");
      const data = await response.json();
      setGrounds(data.data || []);
    } catch (err) {
      console.error('Error fetching grounds:', err);
      alert("Failed to load grounds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,
        { method: "POST", credentials: "include" }
      );
      
      // Clear localStorage regardless of response
      localStorage.removeItem('user');
      
      if (response.ok || response.status === 498) {
        navigate('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear localStorage and redirect
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleChangePassword = () => navigate('/changepass');

  const filteredGrounds = grounds.filter(
    g => filterCity === 'all' || g.city.toLowerCase() === filterCity.toLowerCase()
  );

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
      {/* HEADER */}
      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-logo">Playistan</h1>
          <nav className="header-nav">
            <button className="nav-btn" onClick={() => navigate('/homepage')}>Home</button>
            <button className="nav-btn-chat" onClick={() => navigate('/chat')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Community Chat
            </button>
            <button className="nav-btn-change" onClick={handleChangePassword}>Change Password</button>
            <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Book Your Perfect Sports Ground</h2>
          <p className="hero-subtitle">Choose from premium sports grounds across Pakistan</p>

          <div className="filter-bar">
            <svg className="filter-icon" width="20" height="20" viewBox="0 0 20 20">
              <path d="M8 2C4.13 2 1 5.13 1 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="city-filter">
              <option value="all">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>
        </div>
      </section>

      {/* GROUNDS GRID */}
      <section className="grounds-section">
        <div className="grounds-container">
          {filteredGrounds.length === 0 ? (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M32 20v24M20 32h24" stroke="#4ADE80" strokeWidth="2"/>
              </svg>
              <h3>No grounds found</h3>
              <p>Try selecting a different city</p>
            </div>
          ) : (
            <div className="grounds-grid">
              {filteredGrounds.map(ground => (
                <GroundCard key={ground._id || ground.id} ground={ground} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="homepage-footer">
        <p>&copy; 2025 Playistan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;