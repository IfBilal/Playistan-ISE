import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Auth Pages
import Login from './Login.jsx';
import SignUp from './SignUp/page.jsx';
import OtpVerification from './Otp/page.jsx';
import ChangePass from './ChangePass/page.jsx';

// Guest Pages
import GuestHome from './GuestHome/page.jsx';

// Logged-in Homepage
import Homepage from './Homepage/page.jsx'; // dark homepage with hero + grounds

// Ground Booking
import GroundBooking from './GroundBooking/page.jsx';

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Login Route */}
        <Route path="/" element={<Login />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/changepass" element={<ChangePass />} />

        {/* Guest Landing Page */}
        <Route path="/guesthome" element={<GuestHome />} />

        {/* Logged-in Homepage */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Ground Booking Page */}
        <Route path="/groundbooking/:groundId" element={<GroundBooking />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<Main />);
