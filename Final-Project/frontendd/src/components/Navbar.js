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
      <NavSectionLeft>
        <Logo src={LogoImage} alt="Logo" />
      </NavSectionLeft>
      <NavSectionCenter>
        <NavItem to="/">Rental Mobil</NavItem>
        <NavItem to="/payment">Pembayaran</NavItem>
        <NavItem to="/list-mobil">Daftar Mobil</NavItem>
      </NavSectionCenter>
      <NavSectionRight>
        {auth.token ? (
          <LogoutButton to="/logout">Keluar</LogoutButton>
        ) : (
          <>
            <RegisterButton to="/register">Daftar</RegisterButton>
            <LoginButton to="/login">Masuk</LoginButton>
          </>
        )}
      </NavSectionRight>
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

const NavSectionLeft = styled.div`
  display: flex;
  align-items: center;
`;

const NavSectionCenter = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  position: absolute; /* Added this */
  left: 50%; /* Added this */
  transform: translateX(-50%); /* Added this */
`;

const NavSectionRight = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: black;
  margin: 0 10px;
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

const Logo = styled.img`
  height: 50px;
  margin-right: 20px;
`;

export default Navbar;
