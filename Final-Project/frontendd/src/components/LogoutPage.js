import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './app/AuthProvider';

const LogoutPage = ({ setAuthToken }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logOut();
  };

  return (
    <Container>
      <LogoutContent>
        <LogoutTitle>Logout</LogoutTitle>
        <LogoutText>Are you sure you want to logout?</LogoutText>
        <ButtonContainer>
          <LogoutButton onClick={handleLogout}>Yes</LogoutButton>
          <Link to="/">
            <CancelButton>No</CancelButton>
          </Link>
        </ButtonContainer>
      </LogoutContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LogoutContent = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LogoutTitle = styled.h1`
  font-size: 24px;
  color: #333;
`;

const LogoutText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
`;

export default LogoutPage;
