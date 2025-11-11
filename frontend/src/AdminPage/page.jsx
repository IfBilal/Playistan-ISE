import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";

export default function AdminPage() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenshotModal, setScreenshotModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "radial-gradient(circle at top left, #001a0f 0%, #000a05 50%, #001505 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    
    fetchBookings();

    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/pending-bookings`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 498) {
          navigate("/");
          return;
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      
      const allBookings = data.data || [];
      const pending = allBookings.filter(b => b.status === "pending");
      const confirmed = allBookings.filter(b => b.status === "confirmed");
      
      setPendingBookings(pending);
      setConfirmedBookings(confirmed);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings. Please try again.");
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
        throw new Error("Failed to confirm booking");
      }

      const data = await response.json();
      
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      setConfirmedBookings(prev => [...prev, data.data]);
      
      alert("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleReject = async (bookingId, userName) => {
    if (!window.confirm(`Reject ${userName}'s booking?`)) {
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
        throw new Error("Failed to reject booking");
      }

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
      navigate("/adminlogin");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
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
                      <div className="info-row">
                        <span className="info-label">Ground:</span>
                        <span className="info-text">{booking.groundId?.name || 'N/A'}</span>
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
                      VIEW SCREENSHOT
                    </button>
                    <button 
                      className="btn-confirm"
                      onClick={() => handleConfirm(booking._id)}
                    >
                      CONFIRM
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(booking._id, booking.userId?.name)}
                    >
                      REJECT
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
                      <div className="info-row">
                        <span className="info-label">Ground:</span>
                        <span className="info-text">{booking.groundId?.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button className="btn-confirmed" disabled>
                      ✓ CONFIRMED
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