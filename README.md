<p align="center">
  <img src="https://img.shields.io/badge/Playistan-Sports%20Booking%20Platform-4ADE80?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==" alt="Playistan"/>
</p>

<h1 align="center">🏟️ Playistan</h1>

<p align="center">
  <strong>Pakistan's Premier Sports Ground Booking Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributors">Contributors</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Vite-7.1-646CFF?style=flat-square&logo=vite" alt="Vite"/>
</p>

---

## 📖 Overview

**Playistan** is a full-stack web application designed to revolutionize sports ground booking in Pakistan. The platform connects sports enthusiasts with ground owners, enabling seamless discovery, booking, and management of sports facilities across major Pakistani cities.

Built as an **Introduction to Software Engineering (ISE)** project, Playistan demonstrates modern web development practices with a focus on real-time communication, secure authentication, and an intuitive user experience.

### 🎯 Problem Statement

Finding and booking sports grounds in Pakistan has traditionally been a fragmented process involving phone calls, physical visits, and uncertain availability. Playistan solves this by providing:

- **Centralized Discovery**: Browse all available grounds in one place
- **Real-time Availability**: See which time slots are booked instantly
- **Secure Booking**: Payment verification through screenshot uploads
- **Community Building**: Connect with fellow sports enthusiasts via real-time chat

---

## ✨ Features

### 👤 For Users

| Feature | Description |
|---------|-------------|
| **🔐 Secure Authentication** | Email-based OTP verification with JWT tokens |
| **🏟️ Ground Discovery** | Browse and filter grounds by city (Islamabad, Rawalpindi, Lahore, Karachi) |
| **📅 Smart Booking** | Select dates and view real-time slot availability |
| **💳 Payment Verification** | Upload payment screenshots for admin approval |
| **⭐ Review System** | Rate and review grounds (up to 2 reviews per ground) |
| **💬 Community Chat** | Real-time messaging with text, images, and video support |
| **🌙 Theme Toggle** | Switch between dark and light modes |
| **🌐 Bilingual Support** | Full English and Urdu (اردو) language support with RTL |

### 👨‍💼 For Ground Admins

| Feature | Description |
|---------|-------------|
| **📊 Dashboard** | Comprehensive view of pending and confirmed bookings |
| **✅ Booking Management** | Approve or reject bookings with payment screenshot verification |
| **❌ Cancellation** | Cancel confirmed bookings when necessary |
| **🏢 Venue Management** | Manage ground details, pricing, and availability hours |

### 🎁 Guest Access

| Feature | Description |
|---------|-------------|
| **👀 Browse Grounds** | View all available grounds without registration |
| **📝 Add Ground Request** | Submit phone number to list your own ground |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI Library |
| **Vite** | 7.1.12 | Build Tool & Dev Server |
| **React Router DOM** | 7.9.4 | Client-side Routing |
| **Socket.IO Client** | 4.8.1 | Real-time Communication |
| **CSS3** | - | Styling with CSS Variables |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime Environment |
| **Express.js** | 5.1.0 | Web Framework |
| **MongoDB** | - | Database |
| **Mongoose** | 8.19.1 | ODM for MongoDB |
| **Socket.IO** | 4.8.1 | WebSocket Server |
| **JWT** | 9.0.2 | Authentication Tokens |
| **bcrypt** | 6.0.0 | Password Hashing |
| **Cloudinary** | 2.7.0 | Image/Video Storage |
| **Nodemailer** | 7.0.10 | Email Service (OTP) |
| **Multer** | 2.0.2 | File Upload Handling |

---

## 📁 Project Structure

```
Playistan-ISE/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/          # Business logic
│   │   │   ├── AdminDashboard.controllers.js
│   │   │   ├── booking.controllers.js
│   │   │   ├── chat.controllers.js
│   │   │   ├── ground.controllers.js
│   │   │   ├── review.controllers.js
│   │   │   └── user.controllers.js
│   │   ├── 📂 db/                   # Database connection
│   │   │   └── index.js
│   │   ├── 📂 middlewares/          # Express middlewares
│   │   │   ├── AdminAuth.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── 📂 models/               # Mongoose schemas
│   │   │   ├── Admin.models.js
│   │   │   ├── booking.models.js
│   │   │   ├── ground.models.js
│   │   │   ├── message.models.js
│   │   │   ├── review.models.js
│   │   │   └── user.models.js
│   │   ├── 📂 routes/               # API routes
│   │   │   ├── admin.router.js
│   │   │   ├── booking.router.js
│   │   │   ├── chat.router.js
│   │   │   ├── ground.router.js
│   │   │   ├── review.router.js
│   │   │   └── user.router.js
│   │   ├── 📂 sockets/              # Socket.IO handlers
│   │   │   └── chat.socket.js
│   │   ├── 📂 utils/                # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   │   └── otpService.js
│   │   ├── app.js                   # Express app configuration
│   │   ├── constants.js             # App constants
│   │   └── index.js                 # Server entry point
│   ├── 📂 public/temp/              # Temporary file uploads
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 AddGround/            # Add ground request page
│   │   ├── 📂 AdminLogin/           # Admin authentication
│   │   ├── 📂 AdminPage/            # Admin dashboard
│   │   ├── 📂 ChangePass/           # Password change page
│   │   ├── 📂 Chat/                 # Real-time community chat
│   │   ├── 📂 components/           # Reusable components
│   │   │   ├── LanguageToggle.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── 📂 contexts/             # React Context providers
│   │   │   ├── LanguageContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── 📂 GroundBooking/        # Booking page with reviews
│   │   ├── 📂 GuestHome/            # Guest landing page
│   │   ├── 📂 Homepage/             # Authenticated user home
│   │   ├── 📂 Otp/                  # OTP verification
│   │   ├── 📂 SignUp/               # User registration
│   │   ├── 📂 UserProfile/          # User profile page
│   │   ├── index.css                # Global styles & themes
│   │   ├── Login.jsx                # Login page
│   │   ├── Login.css
│   │   └── main.jsx                 # App entry point & routing
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,        // Unique, indexed
  email: String,           // Unique
  password: String,        // bcrypt hashed (12 rounds)
  isVerified: Boolean,     // Email verification status
  otp: String,             // Temporary OTP
  otpExpires: Date,        // OTP expiration (10 minutes)
  refreshToken: String,    // JWT refresh token
  timestamps: true
}
```

### Ground Model
```javascript
{
  name: String,
  owner: ObjectId (Admin),
  description: String,
  city: String,            // Islamabad, Rawalpindi, Lahore, Karachi
  coverImage: { url, publicId },
  sportTypes: [String],    // Football, Cricket, etc.
  location: String,
  basePrice: Number,       // PKR per hour
  availableHours: {
    start: String,         // "09:00"
    end: String,           // "22:00"
    slotDuration: Number   // Minutes (default: 60)
  },
  photos: [{ url, publicId }],
  rules: String,
  timestamps: true
}
```

### Booking Model
```javascript
{
  groundId: ObjectId (Ground),
  userId: ObjectId (User),
  price: Number,
  date: String,            // "YYYY-MM-DD"
  startTime: String,       // "10:00"
  endTime: String,         // "11:00"
  status: String,          // "pending" | "confirmed"
  screenshot: String,      // Payment proof URL
  screenshotPublicId: String,
  createdAt: Date
}
```

### Review Model
```javascript
{
  groundId: ObjectId (Ground),
  userId: ObjectId (User),
  rating: Number,          // 1-5 stars
  comment: String,         // Max 500 characters
  timestamps: true
}
```

### Message Model
```javascript
{
  sender: ObjectId (User),
  messageType: String,     // "text" | "image" | "video"
  content: String,         // For text messages
  mediaUrl: String,        // For image/video
  mediaPublicId: String,   // Cloudinary ID
  isDeleted: Boolean,
  readBy: [{ user, readAt }],
  timestamps: true
}
```

### Admin Model
```javascript
{
  username: String,        // Unique, indexed
  phoneNumber: String,
  ground: ObjectId (Ground),
  password: String,
  refreshToken: String,
  timestamps: true
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register new user | ❌ |
| POST | `/users/verify-otp` | Verify email OTP | ❌ |
| POST | `/users/resend-otp` | Resend OTP email | ❌ |
| POST | `/users/login` | User login | ❌ |
| POST | `/users/logout` | User logout | ✅ |
| POST | `/users/change-password` | Change password | ✅ |

### Ground Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/grounds` | Get all grounds | ❌ |
| POST | `/grounds/filter-by-city` | Filter by city | ❌ |
| GET | `/grounds/sort/asc` | Sort by price (low→high) | ❌ |
| GET | `/grounds/sort/desc` | Sort by price (high→low) | ❌ |

### Booking Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/bookings/:groundId/:date` | Get booked slots | ✅ |
| POST | `/bookings/book` | Create booking | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/admin/login` | Admin login | ❌ |
| POST | `/admin/logout` | Admin logout | ✅ Admin |
| GET | `/admin/pending-bookings` | Get pending bookings | ✅ Admin |
| GET | `/admin/confirmed-bookings` | Get confirmed bookings | ✅ Admin |
| PUT | `/admin/confirm-booking` | Approve booking | ✅ Admin |
| DELETE | `/admin/reject-booking` | Reject booking | ✅ Admin |
| DELETE | `/admin/cancel-booking` | Cancel confirmed | ✅ Admin |

### Chat Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/chat/history` | Get chat messages | ✅ |
| POST | `/chat/send-text` | Send text message | ✅ |
| POST | `/chat/send-image` | Send image | ✅ |
| POST | `/chat/send-video` | Send video | ✅ |
| DELETE | `/chat/message/:messageId` | Delete message | ✅ |
| GET | `/chat/online-users` | Get online users | ✅ |

### Review Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/reviews/add` | Add review | ✅ |
| GET | `/reviews/:groundId` | Get ground reviews | ❌ |
| GET | `/reviews/user-count/:groundId` | Get user's review count | ✅ |

---

## 🔌 Socket.IO Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `typing:start` | - | User started typing |
| `typing:stop` | - | User stopped typing |
| `users:online` | - | Request online users list |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | Message object | New message broadcast |
| `message:deleted` | `{ messageId }` | Message deleted |
| `user:joined` | `{ userId, username }` | User connected |
| `user:left` | `{ userId, username }` | User disconnected |
| `user:typing` | `{ userId, username }` | User is typing |
| `user:stopped-typing` | `{ userId }` | User stopped typing |
| `users:online-list` | `{ count, users }` | Online users list |

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for image/video uploads)
- **Gmail Account** (for OTP emails)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/IfBilal/Playistan-ISE.git
cd Playistan-ISE
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
touch .env
```

Add the following to `.env`:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URL=mongodb://localhost:27017

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> **Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

```bash
# Start the backend server
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env
```

Add the following to `.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

```bash
# Start the frontend development server
npm run dev
```

### 4️⃣ Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 🎨 Theme & Language System

### Theme Toggle
Playistan supports **Dark** and **Light** themes using CSS custom properties:

```css
:root[data-theme="dark"] {
  --primary-color: #4ADE80;
  --bg-gradient-start: #0a0e27;
  /* ... */
}

:root[data-theme="light"] {
  --primary-color: #16a34a;
  --bg-gradient-start: #f8fafc;
  /* ... */
}
```

Theme preference is persisted in `localStorage` and applied via the `data-theme` attribute on `<html>`.

### Language Toggle
Full bilingual support with **English** and **Urdu**:

- RTL (Right-to-Left) layout for Urdu
- 250+ translated strings
- Language persisted in `localStorage`
- Automatic `dir` attribute switching

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Authentication** | Access (15m) + Refresh (7d) tokens |
| **HTTP-Only Cookies** | Prevents XSS token theft |
| **OTP Verification** | 6-digit code with 10-minute expiry |
| **CORS Protection** | Configured origin whitelist |
| **Auto Token Refresh** | Middleware-based silent refresh |
| **Secure Cookies** | `secure: true` in production |

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render)

1. Set all environment variables in your hosting platform
2. Set the start command: `node src/index.js`
3. Ensure MongoDB Atlas connection string is used

---

## 📸 Screenshots

### 🏠 Homepage (Dark Theme)
> Browse and discover sports grounds with city filtering

### 📅 Ground Booking
> Select dates, view available slots, and book with payment proof

### 💬 Community Chat
> Real-time messaging with image/video support

### 👨‍💼 Admin Dashboard
> Manage pending and confirmed bookings

---

## 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/IfBilal">
        <img src="https://github.com/IfBilal.png" width="100px;" alt="M. Bilal Tahir"/><br />
        <sub><b>M. Bilal Tahir</b></sub>
      </a><br />
      <sub>🚀 Lead Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/T361">
        <img src="https://github.com/T361.png" width="100px;" alt="Taimoor Shaukat"/><br />
        <sub><b>Taimoor Shaukat</b></sub>
      </a><br />
      <sub>🚀 Lead Developer</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **FAST-NUCES** - Introduction to Software Engineering course
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Media storage
- **Socket.IO** - Real-time communication

---

<p align="center">
  <strong>Made with ❤️ in Pakistan 🇵🇰</strong>
</p>

<p align="center">
  <a href="https://github.com/IfBilal/Playistan-ISE/issues">Report Bug</a> •
  <a href="https://github.com/IfBilal/Playistan-ISE/issues">Request Feature</a>
</p>
