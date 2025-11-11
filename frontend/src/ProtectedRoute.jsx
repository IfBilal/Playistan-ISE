import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = adminOnly 
          ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/verify`
          : `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/verify`;

        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
          if (adminOnly) setIsAdmin(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [adminOnly]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000'
      }}>
        <div style={{ color: '#4ADE80', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  // If route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={adminOnly ? "/adminlogin" : "/"} replace />;
  }

  // If route is for guests only but user is authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin-dashboard" : "/homepage"} replace />;
  }

  return children;
};

export default ProtectedRoute;