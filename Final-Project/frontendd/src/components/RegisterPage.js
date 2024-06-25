import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './app/AuthProvider';
import { serverApi } from './app/config';

// component definition
const RegisterPage = () => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const auth = useAuth();
  // jika sudah login, langsung redirect ke halaman list-mobil
  if (auth.user) {
    navigate('/list-mobil');
  }

  // tangani tombol klik saat menekan register
  const handleRegister = async () => {
    try {
      const response = await fetch(`${serverApi}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          email: email,
          password: password,
          alamat: alamat,
          nomor_telepon: nomorTelepon,
          role: 'user',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <RegisterContainer>
        <RegisterForm>
          <Title>Register</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input 
            type="text" 
            placeholder="Nama Lengkap" 
            value={namaLengkap} 
            onChange={(e) => setNamaLengkap(e.target.value)} 
          />
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
          <Input 
            type="text" 
            placeholder="Alamat" 
            value={alamat} 
            onChange={(e) => setAlamat(e.target.value)} 
          />
          <Input 
            type="text" 
            placeholder="No Telepon" 
            value={nomorTelepon} 
            onChange={(e) => setNomorTelepon(e.target.value)} 
          />
          <Button onClick={handleRegister}>Register</Button>
          <Links>
            <StyledLink href="/login">Have an Account? Login</StyledLink>
          </Links>
        </RegisterForm>
      </RegisterContainer>
    </div>
  );
};

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 160px);
`;

const RegisterForm = styled.div`
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

export default RegisterPage;
