import React from "react";
import { useNavigate } from "react-router-dom";
import "./GroundCard.css";

const GroundCard = ({ ground }) => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/adminlogin", {
      state: {
        groundId: ground._id,
        groundName: ground.name,
      },
    });
  };

  if (!ground) return null;

  return (
    <div className="ground-card">
      {/* Image Section */}
      <div className="ground-image-container">
        <img 
          src={ground.coverImage?.url || 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80'} 
          alt={ground.name} 
          className="ground-image" 
        />
        <span className="availability-badge">Available</span>
      </div>

      {/* Details Section */}
      <div className="ground-details">
        <h3 className="ground-name">{ground.name}</h3>

        <div className="ground-info">
          {/* Location */}
          <div className="info-item">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{ground.location}</span>
          </div>

          {/* Duration */}
          <div className="info-item">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2"
              />
            </svg>
            <span>{ground.availableHours?.slotDuration || 60} mins</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="ground-footer">
          <div className="price-section">
            <span className="price">Rs. {ground.basePrice}</span>
            <span className="price-label">per session</span>
          </div>
        </div>

        {/* Admin Login Button */}
        <button className="admin-btn-full" onClick={handleAdminLogin}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default GroundCard;