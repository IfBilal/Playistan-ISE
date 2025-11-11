import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import SignUp from "./SignUp/page.jsx";
import OtpVerification from "./Otp/page.jsx";
import Homepage from "./Homepage/page.jsx";
import GuestHome from "./GuestHome/page.jsx";
import BookingPage from "./GroundBooking/page.jsx";
import AddGround from "./AddGround/page.jsx";
import ChangePassword from "./ChangePass/page.jsx";
import AdminLogin from "./AdminLogin/page.jsx";
import AdminPage from "./AdminPage/page.jsx";

import PrivateRoute from "./PrivateRoute.jsx"; // Protected routes wrapper

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/guesthome" element={<GuestHome />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/add-ground" element={<AddGround />} /> {/* PUBLIC */}

        {/* Protected routes */}
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/groundbooking"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
