import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-toggle-btn" 
      onClick={toggleLanguage} 
      title={`Switch to ${language === 'en' ? 'Urdu' : 'English'}`}
    >
      <span className="lang-text">{language === 'en' ? 'اردو' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
