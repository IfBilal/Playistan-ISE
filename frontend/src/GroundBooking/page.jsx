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

  // Ground data
  const groundData = location.state || {
    groundName: 'Premier Gaming Arena',
    groundLocation: 'Location not available',
    groundPrice: 0,
    groundDuration: 60,
    groundImage: ''
  };

  // Generate next 5 days
  useEffect(() => {
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
    generateDates();
  }, []);

  const timeSlots = [
    '9:00 - 10:00 PM',
    '10:00 - 11:00 PM',
    '11:00 - 12:00 AM'
  ];

  const handleDateClick = (dateObj) => setSelectedDate(dateObj);
  const handleSlotClick = (slot, index) => setSelectedSlot({ slot, index });
  const handleBackToHome = () => navigate('/homepage');

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Only JPEG or JPG files are allowed.');
      e.target.value = '';
    }
  };

  const handleMakeBooking = () => {
    console.log('Making booking for:', { 
      ground: groundData,
      selectedDate, 
      selectedSlot,
      screenshot
    });
    // TODO: Upload file via multer/cloudinary route
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
        <div className="slots-section">
          <h3 className="section-title">AVAILABLE TIME SLOTS</h3>
          <div className="slots-grid">
            {dates.map((dateObj, dateIndex) => (
              <div key={dateIndex} className="slots-column">
                {timeSlots.map((slot, slotIndex) => (
                  <button
                    key={slotIndex}
                    className={`slot-card ${
                      selectedSlot?.index === `${dateIndex}-${slotIndex}` ? 'selected' : ''
                    }`}
                    onClick={() => handleSlotClick(slot, `${dateIndex}-${slotIndex}`)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
<div className="upload-section">
  <label htmlFor="upload" className="upload-label">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4" />
    </svg>
    Upload Screenshot
  </label>
  <input
    type="file"
    id="upload"
    accept=".jpg,.jpeg"
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
        {selectedDate && selectedSlot && (
          <div className="booking-action">
            <button className="book-button" onClick={handleMakeBooking}>
              Confirm Booking - Rs. {groundData.groundPrice}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
