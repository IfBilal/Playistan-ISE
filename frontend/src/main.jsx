import PrivateRoute from "./PrivateRoute.jsx";

<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/otp" element={<OtpVerification />} />
  
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
    path="/add-ground"
    element={
      <PrivateRoute>
        <AddGround />
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

  {/* Public route */}
  <Route path="/guesthome" element={<GuestHome />} />
</Routes>
