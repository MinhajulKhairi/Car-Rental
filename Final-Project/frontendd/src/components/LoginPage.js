import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import styled from 'styled-components';
import useToken from './app/useToken';
import { useAuth } from './app/AuthProvider'
import { serverApi } from './app/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  // jika sudah login, langsung redirect ke halaman list-mobil
  if (auth.user) {
    navigate('/list-mobil');
  }

  const input = useState({
    email: email,
    password: password
  });
  const handleLogin = async () => {
    try {
      const response = await fetch(`${serverApi}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      if (data.success) {
        // simpan ke useState token
        auth.loginAction(data.user);
        // alert(data.user.access_token)
        // setToken(data.user.access_token);
        // navigate('/list-mobil');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <LoginContainer>
        <LoginForm>
          <Title>Login</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button onClick={handleLogin}>Login</Button>
          <Links>
            <StyledLink href="/register">Don't have an account? Register</StyledLink>
          </Links>
        </LoginForm>
      </LoginContainer>
    </div>
  );
};

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 160px);
`;

const LoginForm = styled.div`
  text-align: center;
  width: 300px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
`;

const Links = styled.div`
  margin-top: 10px;
`;

const StyledLink = styled.a`
  display: block;
  color: #007bff;
  text-decoration: none;
  margin: 5px 0;
`;

export default LoginPage;
