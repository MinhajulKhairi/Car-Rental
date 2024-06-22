import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './app/AuthProvider';

const LogoutPage = ({ setAuthToken }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logOut();
    navigate('/login');  // Redirect to login page after logging out
  };

  useEffect(() => {
    handleLogout();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  return null;  // No need to render anything
};

export default LogoutPage;
