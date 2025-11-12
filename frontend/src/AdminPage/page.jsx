import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css"; // Imports the new CSS

export default function AdminPage() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [groundName, setGroundName] = useState("Your Venue"); // Placeholder
  const [loading, setLoading] = useState(true);
  const [screenshotModal, setScreenshotModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Custom styles for this page
    document.body.style.background = "radial-gradient(circle at top left, #001a0f 0%, #000a05 50%, #001505 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    
    fetchBookings();

    // Cleanup function to reset body style when component unmounts
    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
      document.body.style.margin = "";
    };
  }, []); // Empty dependency array, runs only once

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/pending-bookings`,
        {
          method: "GET",
          credentials: "include", // Important for sending cookies
        }
      );

      if (!response.ok) {
        if (response.status === 498 || response.status === 401) {
          console.error("Session expired, redirecting to login");
          navigate("/adminlogin");
          return;
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      const pending = data.data || [];
      
      setPendingBookings(pending);
      setConfirmedBookings([]); // Clear confirmed on refresh, as we only fetch pending

      // Set the ground name from the first booking (if available)
      if (pending.length > 0 && pending[0].groundId?.name) {
        setGroundName(pending[0].groundId.name);
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/confirm-booking`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!response.ok) {
        if (response.status === 498 || response.status === 401) {
          navigate("/adminlogin");
          return;
        }
        throw new Error("Failed to confirm booking");
      }

      const data = await response.json();
      
      // Move from pending to confirmed in the UI state
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      setConfirmedBookings(prev => [...prev, data.data]);
      
      // You can replace this with a styled toast/modal
      alert("Booking confirmed successfully!"); 

    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleReject = async (bookingId, userName) => {
    // You should replace this with a custom modal for better UI
    if (!confirm(`Are you sure you want to reject ${userName}'s booking?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reject-booking`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!response.ok) {
         if (response.status === 498 || response.status === 401) {
          navigate("/adminlogin");
          return;
        }
        throw new Error("Failed to reject booking");
      }

      // Remove from pending list
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      alert("Booking rejected successfully!"); 
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };

  const handleViewScreenshot = (screenshotUrl) => {
    setScreenshotModal(screenshotUrl);
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      navigate("/adminlogin");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/adminlogin"); // Force logout even if API call fails
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use PKT time, format: 12-Nov-2025
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Karachi'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-container">
          <div className="loading-spinner">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p className="venue-name">{groundName}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Pending Bookings */}
        <div className="bookings-section">
          <div className="section-header pending-header">
            <span className="status-icon">⏱</span>
            <h2>Pending Bookings ({pendingBookings.length})</h2>
          </div>
          
          <div className="bookings-list">
            {pendingBookings.length === 0 ? (
              <p className="no-bookings">No pending bookings</p>
            ) : (
              pendingBookings.map((booking) => (
                <div key={booking._id} className="booking-card pending-card">
                  <div className="booking-details">
                    <div className="booking-time">
                      <div className="date">{formatDate(booking.date)}</div>
                      <div className="time">{booking.startTime} - {booking.endTime}</div>
                    </div>
                    
                    <div className="booking-info-section">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-text">{booking.userId?.name || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-text">{booking.userId?.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="booking-amount">
                      <div className="amount-label">Amount:</div>
                      <div className="amount-value">PKR {booking.price}</div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button 
                      className="btn-screenshot"
                      onClick={() => handleViewScreenshot(booking.screenshot)}
                    >
                      View Screenshot
                    </button>
                    <button 
                      className="btn-confirm"
                      onClick={() => handleConfirm(booking._id)}
                    >
                      Confirm
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(booking._id, booking.userId?.name)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bookings-section">
          <div className="section-header confirmed-header">
            <span className="status-icon">✓</span>
            <h2>Confirmed Bookings ({confirmedBookings.length})</h2>
          </div>
          
          <div className="bookings-list">
            {confirmedBookings.length === 0 ? (
              <p className="no-bookings">No confirmed bookings</p>
            ) : (
              confirmedBookings.map((booking) => (
                <div key={booking._id} className="booking-card confirmed-card">
                  <div className="booking-details">
                    <div className="booking-time">
                      <div className="date">{formatDate(booking.date)}</div>
                      <div className="time">{booking.startTime} - {booking.endTime}</div>
                    </div>
                    
                    <div className="booking-info-section">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-text">{booking.userId?.name || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-text">{booking.userId?.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="booking-amount">
                      <div className="amount-label">Amount:</div>
                      <div className="amount-value">PKR {booking.price}</div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button className="btn-confirmed" disabled>
                      ✓ Confirmed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div className="modal-overlay" onClick={() => setScreenshotModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setScreenshotModal(null)}>
              ×
            </button>
            <img src={screenshotModal} alt="Payment Screenshot" className="screenshot-image" />
          </div>
        </div>
      )}
    </div>
  );
}