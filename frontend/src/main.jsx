import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import ProtectedRoute from './ProtectedRoute.jsx';

// Import all pages
import Login from './Login.jsx';
import SignUp from './SignUp/page.jsx';
import OtpVerification from './Otp/page.jsx';
import Homepage from './Homepage/page.jsx';
import GuestHome from './GuestHome/page.jsx';
import BookingPage from './GroundBooking/page.jsx';
import AddGround from './AddGround/page.jsx';
import ChangePassword from './ChangePass/page.jsx';
import AdminLogin from './AdminLogin/page.jsx';
import AdminPage from './AdminPage/page.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirect if logged in */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <ProtectedRoute requireAuth={false}>
              <SignUp />
            </ProtectedRoute>
          } 
        />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/guesthome" element={<GuestHome />} />
        
        {/* Admin Public Routes */}
        <Route 
          path="/adminlogin" 
          element={
            <ProtectedRoute requireAuth={false} adminOnly={true}>
              <AdminLogin />
            </ProtectedRoute>
          } 
        />

        {/* Protected User Routes */}
        <Route 
          path="/homepage" 
          element={
            <ProtectedRoute requireAuth={true}>
              <Homepage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groundbooking" 
          element={
            <ProtectedRoute requireAuth={true}>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-ground" 
          element={
            <ProtectedRoute requireAuth={true}>
              <AddGround />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requireAuth={true} adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);