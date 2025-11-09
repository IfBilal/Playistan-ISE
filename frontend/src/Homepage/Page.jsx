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
      const mockData = [
        { id: 1, name: 'Arena Sports Complex', location: 'F-7 Markaz, Islamabad', duration: 90, price: 3000, image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80', isAvailable: true, city: 'Islamabad' },
        { id: 2, name: 'Green Field Football Club', location: 'G-9 Sector, Islamabad', duration: 90, price: 2500, image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', isAvailable: true, city: 'Islamabad' },
        { id: 3, name: 'Champions Ground', location: 'G-11 Markaz, Islamabad', duration: 90, price: 3500, image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', isAvailable: true, city: 'Islamabad' },
        { id: 4, name: 'Victory Sports Arena', location: 'F-10 Sector, Islamabad', duration: 90, price: 2800, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', isAvailable: true, city: 'Islamabad' },
        { id: 5, name: 'Premier Stadium', location: 'Satellite Town, Rawalpindi', duration: 90, price: 3200, image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80', isAvailable: true, city: 'Rawalpindi' },
        { id: 6, name: 'Elite Sports Complex', location: 'Bahria Town, Rawalpindi', duration: 90, price: 4000, image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', isAvailable: true, city: 'Rawalpindi' },
        { id: 7, name: 'Fortress Football Arena', location: 'DHA Phase 5, Lahore', duration: 90, price: 3800, image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', isAvailable: true, city: 'Lahore' },
        { id: 8, name: 'Royal Sports Ground', location: 'Gulberg, Lahore', duration: 90, price: 3500, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', isAvailable: true, city: 'Lahore' },
        { id: 9, name: 'Metro Sports Complex', location: 'Johar Town, Lahore', duration: 90, price: 3200, image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80', isAvailable: true, city: 'Lahore' },
        { id: 10, name: 'Ocean View Sports Club', location: 'DHA Phase 6, Karachi', duration: 90, price: 4200, image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', isAvailable: true, city: 'Karachi' },
        { id: 11, name: 'Clifton Football Arena', location: 'Clifton Block 8, Karachi', duration: 90, price: 4500, image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', isAvailable: true, city: 'Karachi' },
        { id: 12, name: 'Gulshan Sports Ground', location: 'Gulshan-e-Iqbal, Karachi', duration: 90, price: 3800, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', isAvailable: true, city: 'Karachi' },
      ];
      setGrounds(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grounds:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');

  };

  const handleCityFilter = (e) => {
    setFilterCity(e.target.value);
  };

  const filteredGrounds = grounds.filter(
    (ground) => filterCity === 'all' || ground.city === filterCity
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
      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-logo">Playistan</h1>
          <nav className="header-nav">
            <button className="nav-btn" onClick={() => navigate('/homepage')}>Home</button>
            <button className="nav-btn-change" onClick={handleChangePassword}>Change Password</button>
            <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Book Your Perfect Sports Ground</h2>
          <p className="hero-subtitle">Choose from premium sports grounds across Pakistan</p>

          <div className="filter-bar">
            <svg className="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 2C4.13 2 1 5.13 1 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
            <select value={filterCity} onChange={handleCityFilter} className="city-filter">
              <option value="all">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>
        </div>
      </section>

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
              {filteredGrounds.map((ground) => (
                <GroundCard key={ground.id} ground={ground} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2025 Playistan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
