import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './page.css';

const BookingPage = () => {
  const location = useLocation();
  const { groundId } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Generate dates dynamically: today + next 7 days
  const generateDates = (numDays = 7) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);
      const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      dates.push({ date: dateStr, day: dayName });
    }
    return dates;
  };

  const availableDates = generateDates(7);

  useEffect(() => {
    if (!ground && groundId) fetchGround();
  }, [groundId]);

  const fetchGround = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/v1/grounds/${groundId}`);
      const data = await res.json();
      if (res.ok && data.data) setGround(data.data);
    } catch (err) {
      console.error('Failed to fetch ground:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="booking-container">Loading ground details...</div>;
  if (!ground) return <div className="booking-container">No ground selected.</div>;

  // Generate 1-hour slots dynamically
  const generateSlots = (start, end) => {
    const slots = [];
    let [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    while (startHour < endHour || (startHour === endHour && startMin < endMin)) {
      const nextHour = startHour + 1;
      const slot = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${nextHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
      slots.push(slot);
      startHour = nextHour;
    }
    return slots;
  };

  const availableSlots = generateSlots(ground.availableHours.start, ground.availableHours.end);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !paymentScreenshot) {
      alert('Select a date, slot, and upload payment screenshot.');
      return;
    }

    const [startTime, endTime] = selectedSlot.split(' - ');
    const formData = new FormData();
    formData.append('groundId', ground._id);
    formData.append('date', selectedDate);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('paymentScreenshot', paymentScreenshot);

    try {
      setBookingLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/bookings/book', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include', // <<< FIXED: send cookies for refresh token
      });
      const data = await res.json();
      if(res.status === 498){
        navigate('/');
        return;
      }
      if (res.ok) {
        alert('Booking created. Confirming...');
  
      } else {
        alert(data.message || 'Booking failed.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

 

  return (
    <div className="booking-container">
      <div className="booking-card">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>
          <h1 className="logo">{ground.name}</h1>
        </div>

        {/* Venue Info */}
        <div className="venue-info">
          <div className="venue-details">
            <h2 className="venue-name">{ground.name}</h2>
            <p className="venue-description">{ground.description || 'No description provided.'}</p>
            <div className="venue-meta">
              <div className="meta-item">City: {ground.city}</div>
              <div className="meta-item">Owner: {ground.owner?.name || 'Unknown'}</div>
              <div className="meta-item">Email: {ground.owner?.email || 'N/A'}</div>
              <div className="meta-item">Location: {ground.location}</div>
              <div className="meta-item">Price: Rs. {ground.basePrice}</div>
            </div>
            {ground.rules && (
              <div className="rules-section" style={{ marginTop: '20px', color: '#A7F3D0' }}>
                <h3 className="section-title">Rules</h3>
                <p>{ground.rules}</p>
              </div>
            )}
          </div>

          <div className="booking-images">
            <img
              className="main-image"
              src={ground.coverImage?.url || 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80'}
              alt={ground.name}
            />
            <div className="photo-grid">
              {Array.isArray(ground.photos) && ground.photos.map((photo, idx) => (
                <img key={idx} className="small-photo" src={photo.url} alt={`photo-${idx}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="date-section">
          <h3 className="section-title">Select Date</h3>
          <div className="date-grid">
            {availableDates.map((d, idx) => (
              <div
                key={idx}
                className={`date-card ${selectedDate === d.date ? 'selected' : ''}`}
                onClick={() => setSelectedDate(d.date)}
              >
                <div className="date-day">{d.day}</div>
                <div className="date-number">{d.date.split('-')[2]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slot Selection */}
        <div className="slots-section">
          <h3 className="section-title">Available Slots</h3>
          <div className="slots-grid">
            {availableSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`slot-card ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Payment Screenshot */}
        <div className="upload-section">
          <h3 className="section-title">Upload Payment Screenshot</h3>
          <input
            type="file"
            accept="image/*"
            className="upload-input"
            id="paymentScreenshot"
            onChange={(e) => setPaymentScreenshot(e.target.files[0])}
          />
          <label htmlFor="paymentScreenshot" className="upload-label">
            Choose File
          </label>
          {paymentScreenshot && (
            <div className="upload-preview">
              <img
                src={URL.createObjectURL(paymentScreenshot)}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        {/* Booking Button */}
        <div className="booking-action">
          <button className="book-button" onClick={handleBooking}>
            {bookingLoading || confirmLoading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
