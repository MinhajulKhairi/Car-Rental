import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoImage from '../assets/images/Logo_UH.png';
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
      <NavSection>
        <Logo src={LogoImage} alt="Logo" />
        <NavItem to="/">Rental Mobil</NavItem>
        {/*<SearchInput type="text" placeholder="Cari..." value={searchQuery} onChange={handleSearchInputChange} />*/}
      </NavSection>
      <NavSection>
        <NavItem to="/payment">Pembayaran</NavItem>
        <NavItem to="/list-mobil">Daftar Mobil</NavItem>
        <NavItem to="/rating">Feedback</NavItem> {/* Perbarui tautan ke RatingPage */}
      </NavSection>
      <NavSection>
        {auth.token ? (
          <LogoutButton to="/logout">Keluar</LogoutButton>
        ) : (
          <>
            <RegisterButton to="/register">Daftar</RegisterButton>
            <LoginButton to="/login">Masuk</LoginButton>
          </>
        )}
      </NavSection>
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

const NavSection = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: black;
  margin-right: 50px;
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
  height: 40px;
  margin-right: 50px;
`;

// const SearchInput = styled.input`
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// `;

export default Navbar;
