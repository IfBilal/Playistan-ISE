import React from 'react';
import ActiveBackground from './ActiveBackground.jsx';

/**
 * Layout Component - Master Wrapper
 * Ensures the background is rendered ONCE and all children sit above it.
 */
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Persistent Background - Always z-index: -1 */}
      <ActiveBackground />
      
      {/* Main Content - Always above background */}
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
