import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroundCard from './GroundCard';
import "./Page.css";

const Homepage = () => {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      // MOCK DATA - Replace with actual API later
      const mockData = [
        // Islamabad
        {
          id: 1,
          name: 'Arena Sports Complex',
          location: 'F-7 Markaz, Islamabad',
          city: 'islamabad',
          duration: 90,
          price: 3000,
          image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
          isAvailable: true
        },
        {
          id: 2,
          name: 'Capital Ground',
          location: 'G-9 Sector, Islamabad',
          city: 'islamabad',
          duration: 90,
          price: 2800,
          image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
          isAvailable: true
        },
        {
          id: 3,
          name: 'Green Valley Sports',
          location: 'G-11 Markaz, Islamabad',
          city: 'islamabad',
          duration: 90,
          price: 3200,
          image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80',
          isAvailable: true
        },
        // Rawalpindi
        {
          id: 4,
          name: 'Pindi Stadium Ground',
          location: 'Saddar, Rawalpindi',
          city: 'rawalpindi',
          duration: 90,
          price: 2500,
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
          isAvailable: true
        },
        {
          id: 5,
          name: 'Champions Arena',
          location: 'Bahria Town, Rawalpindi',
          city: 'rawalpindi',
          duration: 90,
          price: 3500,
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
          isAvailable: true
        },
        {
          id: 6,
          name: 'Victory Ground',
          location: 'Satellite Town, Rawalpindi',
          city: 'rawalpindi',
          duration: 90,
          price: 2700,
          image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80',
          isAvailable: true
        },
        // Lahore
        {
          id: 7,
          name: 'Model Town Sports Complex',
          location: 'Model Town, Lahore',
          city: 'lahore',
          duration: 90,
          price: 3800,
          image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
          isAvailable: true
        },
        {
          id: 8,
          name: 'DHA Football Arena',
          location: 'DHA Phase 5, Lahore',
          city: 'lahore',
          duration: 90,
          price: 4000,
          image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
          isAvailable: true
        },
        {
          id: 9,
          name: 'Gulberg Sports Hub',
          location: 'Gulberg III, Lahore',
          city: 'lahore',
          duration: 90,
          price: 3500,
          image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
          isAvailable: true
        },
        // Karachi
        {
          id: 10,
          name: 'Clifton Sports Ground',
          location: 'Clifton, Karachi',
          city: 'karachi',
          duration: 90,
          price: 3600,
          image: 'https://images.unsplash.com/photo-1529273125446-a0a505a0d0a4?w=800&q=80',
          isAvailable: true
        },
        {
          id: 11,
          name: 'Defence Stadium',
          location: 'DHA Phase 6, Karachi',
          city: 'karachi',
          duration: 90,
          price: 4200,
          image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&q=80',
          isAvailable: true
        },
        {
          id: 12,
          name: 'Gulshan Arena',
          location: 'Gulshan-e-Iqbal, Karachi',
          city: 'karachi',
          duration: 90,
          price: 3000,
          image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
          isAvailable: true
        }
      ];

      setGrounds(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grounds:', error);
      setLoading(false);
    }
  };

  const handleBecomeUser = () => {
    navigate('/signup');
  };

  const filteredGrounds = selectedCity === 'all'
    ? grounds
    : grounds.filter(ground => ground.city === selectedCity);

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
              Become a User
            </button>
            <button className="nav-btn-add-ground" onClick={() => navigate('/add-ground')}>
              Add Ground
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Find Your Perfect Ground</h2>
          <p className="hero-subtitle">Book premium sports grounds across Pakistan</p>

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
                <GroundCard key={ground.id} ground={ground} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <h3>No grounds found</h3>
              <p>Try selecting a different city</p>
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

export default Homepage;
