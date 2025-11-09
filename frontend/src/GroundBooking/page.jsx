import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './page.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dates, setDates] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const groundData = location.state || {
    groundId: null,
    groundName: 'Ground',
    groundLocation: 'Location',
    groundPrice: 0,
    groundDuration: 60,
    groundImage: ''
  };

  useEffect(() => {
    generateDates();
  }, []);

  useEffect(() => {
    if (selectedDate && groundData.groundId) {
      fetchBookedSlots(selectedDate.fullDate);
    }
  }, [selectedDate, groundData.groundId]);

  const generateDates = () => {
    const daysOfWeek = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];
    const generatedDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      generatedDates.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate().toString(),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    setDates(generatedDates);
  };

  const fetchBookedSlots = async (date) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/booked-grounds?groundId=${groundData.groundId}&date=${date}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookedSlots(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const timeSlots = [
    { start: '09:00', end: '10:00', display: '9:00 - 10:00 AM' },
    { start: '10:00', end: '11:00', display: '10:00 - 11:00 AM' },
    { start: '11:00', end: '12:00', display: '11:00 AM - 12:00 PM' },
    { start: '12:00', end: '13:00', display: '12:00 - 1:00 PM' },
    { start: '13:00', end: '14:00', display: '1:00 - 2:00 PM' },
    { start: '14:00', end: '15:00', display: '2:00 - 3:00 PM' },
    { start: '15:00', end: '16:00', display: '3:00 - 4:00 PM' },
    { start: '16:00', end: '17:00', display: '4:00 - 5:00 PM' },
    { start: '17:00', end: '18:00', display: '5:00 - 6:00 PM' },
    { start: '18:00', end: '19:00', display: '6:00 - 7:00 PM' },
    { start: '19:00', end: '20:00', display: '7:00 - 8:00 PM' },
    { start: '20:00', end: '21:00', display: '8:00 - 9:00 PM' },
    { start: '21:00', end: '22:00', display: '9:00 - 10:00 PM' },
    { start: '22:00', end: '23:00', display: '10:00 - 11:00 PM' }
  ];

  const isSlotBooked = (slot) => {
    if (!selectedDate) return false;
    return bookedSlots.some(
      booking => 
        booking.startTime === slot.start && 
        booking.endTime === slot.end &&
        booking.date === selectedDate.fullDate
    );
  };

  const handleDateClick = (dateObj) => {
    setSelectedDate(dateObj);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    if (!isSlotBooked(slot)) {
      setSelectedSlot(slot);
    }
  };

  const handleBackToHome = () => navigate('/homepage');

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Only JPEG, JPG, or PNG files are allowed.');
      e.target.value = '';
    }
  };

  const handleMakeBooking = async () => {
    if (!selectedDate || !selectedSlot || !screenshot) {
      alert('Please select a date, time slot, and upload a payment screenshot.');
      return;
    }

    if (!groundData.groundId) {
      alert('Ground information is missing. Please go back and try again.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('groundId', groundData.groundId);
      formData.append('date', selectedDate.fullDate);
      formData.append('startTime', selectedSlot.start);
      formData.append('endTime', selectedSlot.end);
      formData.append('screenshot', screenshot);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/book-ground`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      alert('Booking created successfully! Waiting for admin confirmation.');
      navigate('/homepage');
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={handleBackToHome}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Venue Info */}
        <div className="venue-info">
          <div className="location-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#4ADE80"/>
            </svg>
          </div>
          <div className="venue-details">
            <h2 className="venue-name">{groundData.groundName}</h2>
            <p className="venue-description">{groundData.groundLocation}</p>
            <div className="venue-meta">
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4v4l3 3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {groundData.groundDuration} min slots
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v14M11 4H6.5C5.67 4 5 4.67 5 5.5S5.67 7 6.5 7h3c.83 0 1.5.67 1.5 1.5S10.33 10 9.5 10H5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Rs. {groundData.groundPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="date-section">
          <h3 className="section-title">SELECT DATE</h3>
          <div className="date-grid">
            {dates.map((dateObj, index) => (
              <button
                key={index}
                className={`date-card ${selectedDate?.date === dateObj.date ? 'selected' : ''}`}
                onClick={() => handleDateClick(dateObj)}
              >
                <span className="date-day">{dateObj.day}</span>
                <span className="date-number">{dateObj.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="slots-section">
            <h3 className="section-title">AVAILABLE TIME SLOTS</h3>
            <div className="slots-grid-single">
              {timeSlots.map((slot, index) => {
                const isBooked = isSlotBooked(slot);
                return (
                  <button
                    key={index}
                    className={`slot-card ${
                      selectedSlot?.start === slot.start ? 'selected' : ''
                    } ${isBooked ? 'booked' : ''}`}
                    onClick={() => handleSlotClick(slot)}
                    disabled={isBooked}
                  >
                    {slot.display}
                    {isBooked && <span className="booked-badge">Booked</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="upload-section">
          <label htmlFor="upload" className="upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4" />
            </svg>
            Upload Payment Screenshot
          </label>
          <input
            type="file"
            id="upload"
            accept=".jpg,.jpeg,.png"
            className="upload-input"
            onChange={handleScreenshotChange}
          />
          {previewUrl && (
            <div className="upload-preview">
              <img src={previewUrl} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

        {/* Booking Button */}
        {selectedDate && selectedSlot && screenshot && (
          <div className="booking-action">
            <button 
              className="book-button" 
              onClick={handleMakeBooking}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Confirm Booking - Rs. ${groundData.groundPrice}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;