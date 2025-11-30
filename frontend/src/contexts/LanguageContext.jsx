import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    // Set text direction for Urdu (RTL)
    document.documentElement.setAttribute('dir', language === 'ur' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations
const translations = {
  en: {
    // Common
    'welcome': 'Welcome',
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Logout',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'back': 'Back',
    'next': 'Next',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    
    // Auth
    'email': 'Email',
    'password': 'Password',
    'username': 'Username',
    'confirmPassword': 'Confirm Password',
    'forgotPassword': 'Forgot Password?',
    'dontHaveAccount': "Don't have an account?",
    'alreadyHaveAccount': 'Already have an account?',
    'signInHere': 'Sign in here',
    'signUpHere': 'Sign up here',
    'continueAsGuest': 'Continue as Guest',
    'enterEmail': 'Enter your email',
    'enterPassword': 'Enter your password',
    'enterUsername': 'Enter your username',
    'signInToAccount': 'Sign in to your account',
    'signingIn': 'Signing In...',
    'signIn': 'Sign In',
    'changePassword': 'Change Password',
    
    // OTP
    'verifyOTP': 'Verify OTP',
    'enterOTP': 'Enter the OTP sent to your email',
    'resendOTP': 'Resend OTP',
    'verify': 'Verify',
    
    // Homepage
    'findGround': 'Find Your Perfect Ground',
    'searchPlaceholder': 'Search for grounds...',
    'bookNow': 'Book Now',
    'viewDetails': 'View Details',
    'noGroundsFound': 'No grounds found',
    'availableGrounds': 'Available Grounds',
    
    // Chat
    'community': 'Playistan Community',
    'membersActive': 'members active',
    'typeMessage': 'Type a message...',
    'noMessages': 'No messages yet',
    'beFirst': 'Be the first to start the conversation!',
    'uploadImage': 'Upload Image',
    'uploadVideo': 'Upload Video',
    'typing': 'typing',
    'areTyping': 'are typing',
    
    // Profile
    'myProfile': 'My Profile',
    'editProfile': 'Edit Profile',
    'myBookings': 'My Bookings',
    'settings': 'Settings',
    
    // Booking
    'selectDate': 'Select Date',
    'selectTime': 'Select Time',
    'bookGround': 'Book Ground',
    'bookingConfirmed': 'Booking Confirmed',
    'price': 'Price',
    'perHour': 'per hour',
    
    // Admin
    'adminDashboard': 'Admin Dashboard',
    'manageGrounds': 'Manage Grounds',
    'manageUsers': 'Manage Users',
    'addGround': 'Add Ground',
    'groundName': 'Ground Name',
    'location': 'Location',
    'description': 'Description',
    'contact': 'Contact',
    'phoneNumber': 'Phone Number',
    'pendingBookings': 'Pending Bookings',
    'confirmedBookings': 'Confirmed Bookings',
    'noPendingBookings': 'No pending bookings',
    'noConfirmedBookings': 'No confirmed bookings',
    'name': 'Name',
    'amount': 'Amount',
    'viewScreenshot': 'View Screenshot',
    'confirm': 'Confirm',
    'reject': 'Reject',
    'confirmed': 'Confirmed',
    'paymentScreenshot': 'Payment Screenshot',
    
    // Reviews
    'reviews': 'Reviews',
    'addReview': 'Add Review',
    'yourReview': 'Your Review',
    'rating': 'Rating',
    'writeReview': 'Write your review...',
    'submitReview': 'Submit Review',
    'noReviews': 'No reviews yet',
    'beFirstToReview': 'Be the first to review this ground!',
    'averageRating': 'Average Rating',
    'stars': 'stars',
    'reviewLimit': 'You can submit up to 2 reviews',
  },
  ur: {
    // Common
    'welcome': 'خوش آمدید',
    'login': 'لاگ ان',
    'signup': 'سائن اپ',
    'logout': 'لاگ آؤٹ',
    'submit': 'جمع کرائیں',
    'cancel': 'منسوخ کریں',
    'save': 'محفوظ کریں',
    'delete': 'حذف کریں',
    'edit': 'ترمیم کریں',
    'back': 'واپس',
    'next': 'اگلا',
    'loading': 'لوڈ ہو رہا ہے...',
    'error': 'خرابی',
    'success': 'کامیابی',
    
    // Auth
    'email': 'ای میل',
    'password': 'پاس ورڈ',
    'username': 'صارف نام',
    'confirmPassword': 'پاس ورڈ کی تصدیق کریں',
    'forgotPassword': 'پاس ورڈ بھول گئے؟',
    'dontHaveAccount': 'اکاؤنٹ نہیں ہے؟',
    'alreadyHaveAccount': 'پہلے سے اکاؤنٹ ہے؟',
    'signInHere': 'یہاں سائن ان کریں',
    'signUpHere': 'یہاں سائن اپ کریں',
    'continueAsGuest': 'مہمان کے طور پر جاری رکھیں',
    'enterEmail': 'اپنا ای میل درج کریں',
    'enterPassword': 'اپنا پاس ورڈ درج کریں',
    'enterUsername': 'اپنا صارف نام درج کریں',
    'signInToAccount': 'اپنے اکاؤنٹ میں سائن ان کریں',
    'signingIn': 'سائن ان ہو رہا ہے...',
    'signIn': 'سائن ان کریں',
    'changePassword': 'پاس ورڈ تبدیل کریں',
    
    // OTP
    'verifyOTP': 'او ٹی پی کی تصدیق کریں',
    'enterOTP': 'اپنے ای میل پر بھیجا گیا او ٹی پی درج کریں',
    'resendOTP': 'او ٹی پی دوبارہ بھیجیں',
    'verify': 'تصدیق کریں',
    
    // Homepage
    'findGround': 'اپنا بہترین میدان تلاش کریں',
    'searchPlaceholder': 'میدان تلاش کریں...',
    'bookNow': 'ابھی بک کریں',
    'viewDetails': 'تفصیلات دیکھیں',
    'noGroundsFound': 'کوئی میدان نہیں ملا',
    'availableGrounds': 'دستیاب میدان',
    
    // Chat
    'community': 'پلے استان کمیونٹی',
    'membersActive': 'ممبران فعال',
    'typeMessage': 'پیغام ٹائپ کریں...',
    'noMessages': 'ابھی تک کوئی پیغام نہیں',
    'beFirst': 'بات چیت شروع کرنے والے پہلے فرد بنیں!',
    'uploadImage': 'تصویر اپ لوڈ کریں',
    'uploadVideo': 'ویڈیو اپ لوڈ کریں',
    'typing': 'ٹائپ کر رہا ہے',
    'areTyping': 'ٹائپ کر رہے ہیں',
    
    // Profile
    'myProfile': 'میری پروفائل',
    'editProfile': 'پروفائل میں ترمیم کریں',
    'myBookings': 'میری بکنگز',
    'settings': 'ترتیبات',
    
    // Booking
    'selectDate': 'تاریخ منتخب کریں',
    'selectTime': 'وقت منتخب کریں',
    'bookGround': 'میدان بک کریں',
    'bookingConfirmed': 'بکنگ کی تصدیق ہو گئی',
    'price': 'قیمت',
    'perHour': 'فی گھنٹہ',
    
    // Admin
    'adminDashboard': 'ایڈمن ڈیش بورڈ',
    'manageGrounds': 'میدانوں کا انتظام',
    'manageUsers': 'صارفین کا انتظام',
    'addGround': 'میدان شامل کریں',
    'groundName': 'میدان کا نام',
    'location': 'مقام',
    'description': 'تفصیل',
    'contact': 'رابطہ',
    'phoneNumber': 'فون نمبر',
    'pendingBookings': 'زیر التواء بکنگز',
    'confirmedBookings': 'تصدیق شدہ بکنگز',
    'noPendingBookings': 'کوئی زیر التواء بکنگ نہیں',
    'noConfirmedBookings': 'کوئی تصدیق شدہ بکنگ نہیں',
    'name': 'نام',
    'amount': 'رقم',
    'viewScreenshot': 'اسکرین شاٹ دیکھیں',
    'confirm': 'تصدیق کریں',
    'reject': 'مسترد کریں',
    'confirmed': 'تصدیق شدہ',
    'paymentScreenshot': 'ادائیگی کا اسکرین شاٹ',
    
    // Reviews
    'reviews': 'جائزے',
    'addReview': 'جائزہ شامل کریں',
    'yourReview': 'آپ کا جائزہ',
    'rating': 'درجہ بندی',
    'writeReview': 'اپنا جائزہ لکھیں...',
    'submitReview': 'جائزہ جمع کرائیں',
    'noReviews': 'ابھی تک کوئی جائزہ نہیں',
    'beFirstToReview': 'اس میدان کا جائزہ دینے والے پہلے شخص بنیں!',
    'averageRating': 'اوسط درجہ بندی',
    'stars': 'ستارے',
    'reviewLimit': 'آپ 2 جائزے جمع کروا سکتے ہیں',
  }
};
