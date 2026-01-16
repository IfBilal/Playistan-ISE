import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [groundName, setGroundName] = useState("Your Venue");
  const [groundId, setGroundId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshotModal, setScreenshotModal] = useState(null);

  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #0f172a 0%, #020617 50%, #0c1929 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    
    fetchBookings();

    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
      document.body.style.margin = "";
    };
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch pending bookings
      const pendingResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/pending-bookings`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!pendingResponse.ok) {
        if (pendingResponse.status === 498 || pendingResponse.status === 401) {
          console.error("Session expired, redirecting to login");
          navigate("/adminlogin");
          return;
        }
        throw new Error("Failed to fetch pending bookings");
      }

      const pendingData = await pendingResponse.json();
      
      // New response structure includes ground info
      const pending = pendingData.data?.bookings || pendingData.data || [];
      const groundInfo = pendingData.data?.ground;
      
      setPendingBookings(pending);
      
      // Extract ground ID from response ground info or first booking
      let currentGroundId = groundId;
      
      if (groundInfo) {
        currentGroundId = groundInfo._id;
        setGroundId(currentGroundId);
        setGroundName(groundInfo.name || "Your Venue");
      } else if (pending.length > 0 && pending[0].groundId) {
        currentGroundId = pending[0].groundId._id || pending[0].groundId;
        setGroundId(currentGroundId);
        if (pending[0].groundId?.name) {
          setGroundName(pending[0].groundId.name);
        }
      }

      console.log("Ground ID:", currentGroundId);

      // Fetch confirmed bookings using admin endpoint
      if (currentGroundId) {
        try {
          const confirmedResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/confirmed-bookings`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          console.log("Confirmed bookings response status:", confirmedResponse.status);

          if (confirmedResponse.ok) {
            const confirmedData = await confirmedResponse.json();
            console.log("Confirmed bookings data:", confirmedData);
            const confirmed = confirmedData.data || [];
            setConfirmedBookings(confirmed);
            
            // Update ground name if we didn't get it from pending bookings
            if ((!groundName || groundName === "Your Venue") && confirmed.length > 0 && confirmed[0].groundId?.name) {
              setGroundName(confirmed[0].groundId.name);
            }
          } else {
            const errorData = await confirmedResponse.json();
            console.error("Failed to fetch confirmed bookings:", errorData);
          }
        } catch (error) {
          console.error("Error fetching confirmed bookings:", error);
          // Don't fail the whole page if confirmed bookings fail
          setConfirmedBookings([]);
        }
      } else {
        // If no pending bookings, try to fetch confirmed to get ground ID
        console.warn("No ground ID available to fetch confirmed bookings");
        setConfirmedBookings([]);
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
        if (response.status === 498 || response.status === 400) {
          navigate("/adminlogin");
          return;
        }
        throw new Error("Failed to confirm booking");
      }

      const data = await response.json();
      
      // Refetch all bookings to get the updated state from backend
      await fetchBookings();
      
      alert("Booking confirmed successfully!");

    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleReject = async (bookingId, userName) => {
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
        navigate("/adminlogin");
        throw new Error("Failed to reject booking");
      }
      
      // Refetch all bookings to get the updated state
      await fetchBookings();
      alert("Booking rejected successfully!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };

  const handleCancel = async (bookingId, userName) => {
    if (!confirm(`Are you sure you want to cancel ${userName}'s confirmed booking?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/cancel-booking`,
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
        navigate("/adminlogin");
        throw new Error("Failed to cancel booking");
      }
      
      // Refetch all bookings to get the updated state
      await fetchBookings();
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
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
                        <span className="info-text">{booking.userId?.username || 'N/A'}</span>
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
                      onClick={() => handleReject(booking._id, booking.userId?.username)}
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
                        <span className="info-text">{booking.userId?.username || 'N/A'}</span>
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
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancel(booking._id, booking.userId?.username)}
                      title="Cancel booking"
                    >
                      ✕
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