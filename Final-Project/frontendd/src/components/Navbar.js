import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoImage from '../assets/images/bg.png';
import { useAuth } from './app/AuthProvider';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const auth = useAuth();

  // useEffect untuk memantau perubahan isAuthenticated
  useEffect(() => {
    // Lakukan sesuatu setiap kali isAuthenticated berubah
    refreshNavbar();
  }, [auth.token]);

  const refreshNavbar = () => {
    // Menghapus navbar yang lebih dari satu kali jika ada
    const navBars = document.querySelectorAll('nav');
    if (navBars.length > 1) {
      navBars.forEach((nav, index) => {
        if (index !== 0) {
          nav.remove();
        }
      });
    }
  };

  return (
    <Nav>
      <Logo src={LogoImage} alt="Logo" />
      <NavCenter>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/payment">Pembayaran</NavItem>
        <NavItem to="/list-mobil">Daftar Mobil</NavItem>
      </NavCenter>
      <NavRight>
        {auth.token ? (
          <LogoutButton to="/logout">Keluar</LogoutButton>
        ) : (
          <>
            <RegisterButton to="/register">Daftar</RegisterButton>
            <LoginButton to="/login">Masuk</LoginButton>
          </>
        )}
      </NavRight>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #cac7c7;
`;

const Logo = styled.img`
  height: 60px;
`;

const NavCenter = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: black;
  margin: 0 15px;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const LoginButton = styled(Link)`
  background-color: #ff8000;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-left: 20px;
`;

const RegisterButton = styled(Link)`
  background-color: #ff8000;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-left: 20px;
`;

const LogoutButton = styled(Link)`
  background-color: #4e4e4e;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-left: 20px;
`;

// const SearchInput = styled.input`
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// `;

export default Navbar;
