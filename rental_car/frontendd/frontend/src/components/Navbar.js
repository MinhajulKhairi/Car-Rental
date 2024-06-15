import React, { useState } from 'react';
import styled from 'styled-components';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Nav>
      <NavSection>
        <NavItem href="/">Rental Mobil</NavItem>
        <SearchInput type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchInputChange} />
      </NavSection>
      <NavSection>
        <NavItem href="/payment">Payment</NavItem>
        <NavItem href="/list-mobil">List Mobil</NavItem>
        <NavItem href="/rating">Rating</NavItem> {/* Update link to RatingPage */}
      </NavSection>
      <NavSection>
        <NavItem href="/register">Register</NavItem>
        <LoginButton href="/login">Login</LoginButton>
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

const NavItem = styled.a`
  text-decoration: none;
  color: black;
  margin-right: 50px;
`;

const LoginButton = styled.a`
  background-color: #ff8000;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-left: 20px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default Navbar;
