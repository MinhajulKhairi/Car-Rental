import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const BookingsPage = () => {
  const bookings = [
    {
      id: 1,
      name: 'Imam',
      email: 'imam@rte.com',
      simImage: 'url_to_sim_image_1', // replace with actual image URL
      ktpImage: 'url_to_ktp_image_1'  // replace with actual image URL
    },
    {
      id: 2,
      name: 'Elva',
      email: 'elva@eio.com',
      simImage: 'url_to_sim_image_2', // replace with actual image URL
      ktpImage: 'url_to_ktp_image_2'  // replace with actual image URL
    }
  ];

  return (
    <div>
      <Navbar />
      <AdminContainer>
        <Sidebar>
          <NavItem>
            <Link to="/admin/users">Pengguna</Link>
          </NavItem>
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
          <h1>List Pesanan</h1>
          <BookingTable>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Gambar SIM</th>
                <th>Gambar KTP</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td><img src={booking.simImage} alt="SIM" width="100" /></td>
                  <td><img src={booking.ktpImage} alt="KTP" width="100" /></td>
                  <td>
                    <ActionButton delete>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
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

const SearchBar = styled.div`
  margin-bottom: 20px;

  input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const ActionButton = styled.button`
  background-color: ${props => (props.delete ? 'red' : '#007bff')};
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${props => (props.delete ? '#cc0000' : '#0056b3')};
  }
`;

export default BookingsPage;
