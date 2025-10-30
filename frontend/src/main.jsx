import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './Login.jsx'
import SignUp from './SignUp/Page.jsx'
import OtpVerification from './Otp/Page.jsx'  // ✅ Changed to match folder name
import Homepage from './Homepage/Page.jsx'
import GuestHome from './GuestHome/Page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Otp" element={<OtpVerification />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/guesthome" element={<GuestHome />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)