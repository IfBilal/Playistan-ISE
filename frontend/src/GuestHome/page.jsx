import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroundCard from "./GroundCard";
import "./Page.css";

const GuestHome = () => {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState([]);
  const [filteredGrounds, setFilteredGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/grounds");
      if (!res.ok) throw new Error("Failed to fetch grounds");

      const data = await res.json();
      setGrounds(data.data);
      setFilteredGrounds(data.data);
    } catch (err) {
      console.error("Error fetching grounds:", err);
      setError("Failed to load grounds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityFilter = async (city) => {
    setSelectedCity(city);

    if (city === "all") {
      setFilteredGrounds(grounds);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/grounds/filter-by-city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      const data = await res.json();
      setFilteredGrounds(data.data);
    } catch (err) {
      console.error("City filter error:", err);
    }
  };

  const handleSort = async (order) => {
    setSortOrder(order);

    if (order === "none") {
      setFilteredGrounds(grounds);
      return;
    }

    try {
      const endpoint =
        order === "asc"
          ? "http://localhost:8000/api/v1/grounds/sort/asc"
          : "http://localhost:8000/api/v1/grounds/sort/desc";
      const res = await fetch(endpoint);
      const data = await res.json();
      setFilteredGrounds(data.data);
    } catch (err) {
      console.error("Sort error:", err);
    }
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
      <div className="homepage-loading">
        <p>{error}</p>
        <button className="nav-btn-user" onClick={fetchGrounds}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-logo">Playistan</h1>
          <div className="header-nav">
            <button className="nav-btn" onClick={() => navigate("/")}>
              Login
            </button>
            <button className="nav-btn-user" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            Browse {grounds.length} Premium Football Grounds
          </h2>
          <p className="hero-subtitle">
            Sign in to book your favorite ground instantly
          </p>

          {/* Filter Bar */}
          <div className="filter-bar">
            <svg
              className="filter-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414V20l-4-2v-5.293L3.293 7.293A1 1 0 013 6.586V4z"
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

            <select
              className="city-filter"
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="none">Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                width="64"
                height="64"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9V5.25A2.25 2.25 0 0112 3a2.25 2.25 0 012.25 2.25V9M4.5 9H19.5m-1.5 12H6a1.5 1.5 0 01-1.5-1.5V9h15v10.5a1.5 1.5 0 01-1.5 1.5z"
                />
              </svg>
              <h3>No Grounds Found</h3>
              <p>Try changing your city or sorting options.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>© {new Date().getFullYear()} Playistan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestHome;
