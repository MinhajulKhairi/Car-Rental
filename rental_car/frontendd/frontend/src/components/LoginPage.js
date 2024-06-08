import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <LoginContainer>
        <LoginForm>
          <Title>Login</Title>
          <Input type="email" placeholder="Email Address" />
          <Input type="password" placeholder="Password" />
          <RememberMeContainer>
            <Checkbox type="checkbox" />
            <Label>Remember Me</Label>
          </RememberMeContainer>
          <Button>Login</Button>
          <Links>
            <Link href="#">Forgot Your Password?</Link>
            <Link href="#">Register</Link>
          </Links>
        </LoginForm>
      </LoginContainer>
      <Footer />
    </div>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 160px); // Adjust height based on Navbar and Footer height
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

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Label = styled.label`
  font-size: 14px;
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

const Link = styled.a`
  display: block;
  color: #007bff;
  text-decoration: none;
  margin: 5px 0;
`;

export default LoginPage;
