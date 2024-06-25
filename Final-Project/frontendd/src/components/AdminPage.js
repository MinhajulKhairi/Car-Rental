import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useAuth } from './app/AuthProvider';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
    if (auth.user.role !== 'admin') {
      navigate("/list-mobil");
    }
  }, [auth.user, navigate]);

  return (
    <div>
      <Navbar />
      <AdminContainer>
        <Sidebar>
          <AdminTitle>Admin</AdminTitle>
          <AdminUnderline />
          <NavItem>
            <Link to="/admin/cars">Mobil</Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/bookings">Pemesanan</Link>
          </NavItem>
          <NavItem>
            <Link to="/admin/payments">Pembayaran</Link>
          </NavItem>
        </Sidebar>
        <Content>
          <CenteredText>
            <h1>Welcome to Admin Dashboard</h1>
            <h1>Tetap Semangat dalam Bekerja!</h1>
            {/* This will display the default admin page content or instructions */}
          </CenteredText>
        </Content>
      </AdminContainer>
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
  text-align: center; /* Center the links */
`;

const NavItem = styled.div`
  margin-bottom: 30px;
  font-size: 20px;

  a {
    text-decoration: none;
    color: black;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const AdminTitle = styled.div`
  text-align: center;
  margin-bottom: 10px;
  font-size: 34px;
  font-weight: bold;
`;

const AdminUnderline = styled.div`
  width: 210px;
  height: 2px;
  background-color: #000;
  margin: 0 auto 20px auto;
`;

const CenteredText = styled.div`
  text-align: center;
`;

export default AdminPage;
