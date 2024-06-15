import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const AdminPage = () => {
  return (
    <div>
      <Navbar />
      <AdminContainer>
        <Sidebar>
          <NavItem>
            <Link to="/admin/users">Users</Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/cars">Cars</Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/bookings">Bookings</Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/payments">Payments</Link>
          </NavItem>
        </Sidebar>
        <Content>
          <h1>Welcome to Admin Dashboard</h1>
          {/* This will display the default admin page content or instructions */}
        </Content>
      </AdminContainer>
      <Footer />
    </div>
  );
};

const AdminContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 160px); // Adjust height based on Navbar and Footer height
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
`;

const NavItem = styled.div`
  margin-bottom: 10px;

  a {
    text-decoration: none;
    color: #007bff;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

export default AdminPage;
