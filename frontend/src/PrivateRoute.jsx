// PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or check your auth context/cookie

  if (!token) {
    return <Navigate to="/" />; // redirect to login if not logged in
  }

  return children;
};

export default PrivateRoute;
