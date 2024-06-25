import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './app/AuthProvider';

// component definition
const LogoutPage = ({ setAuthToken }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // handle logout
  const handleLogout = () => {
    auth.logOut();
    navigate('/login');
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default LogoutPage;
