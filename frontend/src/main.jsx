import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

// Auth Pages (All are siblings to main.jsx)
import Login from './Login.jsx';
import SignUp from './SignUp/page.jsx';
import OtpVerification from './Otp/page.jsx';
import ChangePass from './ChangePass/page.jsx';
import AdminLogin from './AdminLogin/page.jsx';

// Guest Pages
import GuestHome from './GuestHome/page.jsx';

// Logged-in Homepage
import Homepage from './Homepage/page.jsx';

// Ground Booking
import GroundBooking from './GroundBooking/page.jsx';

// Admin & Management Pages
import AdminPage from './AdminPage/page.jsx';
import AddGround from './AddGround/page.jsx';

// Chat Page
import Chat from './Chat/page.jsx';

const Main = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle />
        <Routes>
          {/* Default Login Route */}
          <Route path="/" element={<Login />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/changepass" element={<ChangePass />} />
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* Guest Landing Page */}
          <Route path="/guesthome" element={<GuestHome />} />

          {/* Logged-in Homepage */}
          <Route path="/homepage" element={<Homepage />} />

          {/* Ground Booking Page */}
          <Route path="/groundbooking/:groundId" element={<GroundBooking />} />

          {/* Admin Dashboard Route */}
          <Route path="/adminpage" element={<AdminPage />} />

          {/* Add Ground Request Page */}
          <Route path="/addground" element={<AddGround />} />

          {/* Chat Page */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(<Main />);