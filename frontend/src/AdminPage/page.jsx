// ==========================================
// FILE: AdminPage/page.jsx
// ==========================================

import { useState, useEffect } from "react";
import "./page.css";

export default function AdminPage() {
  const [pendingBookings, setPendingBookings] = useState([
    {
      id: 1,
      date: "2025-11-09",
      time: "1:00 PM",
      name: "Ali Hassan",
      phone: "+1234567891",
      amount: "PKR 3,000",
    },
    {
      id: 2,
      date: "2025-11-09",
      time: "3:00 PM",
      name: "Ahmed Khan",
      phone: "+1234567891",
      amount: "PKR 3,000",
    },
  ]);

  const [confirmedBookings, setConfirmedBookings] = useState([
    {
      id: 3,
      date: "2025-11-09",
      time: "1:00 PM",
      name: "Ahmed Khan",
      phone: "+1234567891",
    },
  ]);

  // Apply dark theme to body
  useEffect(() => {
    document.body.style.background = "radial-gradient(circle at top left, #001a0f 0%, #000a05 50%, #001505 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    
    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    };
  }, []);

  const handleConfirm = (id) => {
    const bookingToConfirm = pendingBookings.find(booking => booking.id === id);
    
    if (bookingToConfirm) {
      setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
      setConfirmedBookings([...confirmedBookings, {
        id: bookingToConfirm.id,
        date: bookingToConfirm.date,
        time: bookingToConfirm.time,
        name: bookingToConfirm.name,
        phone: bookingToConfirm.phone
      }]);
    }
  };

  const handleReject = (id) => {
    const bookingToReject = pendingBookings.find(booking => booking.id === id);
    
    if (bookingToReject && window.confirm(`Reject ${bookingToReject.name}'s booking?`)) {
      setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
    }
  };

  const handleViewScreenshot = (id) => {
    alert(`Screenshot viewer for booking #${id} would open here`);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Pending Bookings */}
        <div className="bookings-section">
          <div className="section-header pending-header">
            <span className="status-icon">⏱</span>
            <h2>Pending Bookings ({pendingBookings.length})</h2>
          </div>
          
          <div className="bookings-list">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="booking-card pending-card">
                <div className="booking-details">
                  <div className="booking-time">
                    <div className="date">{booking.date}</div>
                    <div className="time">{booking.time}</div>
                  </div>
                  
                  <div className="booking-info-section">
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-text">{booking.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-text">{booking.phone}</span>
                    </div>
                  </div>

                  <div className="booking-amount">
                    <div className="amount-label">Amount:</div>
                    <div className="amount-value">{booking.amount}</div>
                  </div>
                </div>

                <div className="booking-actions">
                  <button 
                    className="btn-screenshot"
                    onClick={() => handleViewScreenshot(booking.id)}
                  >
                    VIEW SCREENSHOT
                  </button>
                  <button 
                    className="btn-confirm"
                    onClick={() => handleConfirm(booking.id)}
                  >
                    CONFIRM
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(booking.id)}
                  >
                    REJECT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bookings-section">
          <div className="section-header confirmed-header">
            <span className="status-icon">✓</span>
            <h2>Confirmed Bookings ({confirmedBookings.length})</h2>
          </div>
          
          <div className="bookings-list">
            {confirmedBookings.map((booking) => (
              <div key={booking.id} className="booking-card confirmed-card">
                <div className="booking-details">
                  <div className="booking-time">
                    <div className="date">{booking.date}</div>
                    <div className="time">{booking.time}</div>
                  </div>
                  
                  <div className="booking-info-section">
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-text">{booking.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-text">{booking.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="btn-confirmed" disabled>
                    ✓ CONFIRMED
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}