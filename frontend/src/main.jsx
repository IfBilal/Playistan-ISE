import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Import all pages
import Login from './Login.jsx';
import SignUp from './SignUp/Page.jsx';
import OtpVerification from './Otp/Page.jsx';
import Homepage from './Homepage/Page.jsx';
import GuestHome from './GuestHome/Page.jsx';
import BookingPage from './GroundBooking/page.jsx';
import AddGround from './AddGround/page.jsx';
import ChangePassword from './ChangePass/page.jsx';
import AdminLogin from './AdminLogin/page.jsx';
import AdminPage from './AdminPage/page.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/guesthome" element={<GuestHome />} />
        <Route path="/groundbooking" element={<BookingPage />} />
        <Route path="/add-ground" element={<AddGround />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);