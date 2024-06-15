import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CarsPage = () => {
  const cars = [
    {
      id: 1,
      name: 'Inova',
      image: 'url_to_inova_image', // replace with actual image URL
      price: 'Rp. 1.150.000,00',
      status: 'Tersedia'
    },
    {
      id: 2,
      name: 'Toyota Rush',
      image: 'url_to_toyota_rush_image', // replace with actual image URL
      price: 'Rp. 1.500.000,00',
      status: 'Tidak Tersedia'
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
          <h1>List Mobil</h1>
          <CarTable>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Mobil</th>
                <th>Gambar Mobil</th>
                <th>Harga Sewa</th>
                <th>Status Sewa</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={car.id}>
                  <td>{index + 1}</td>
                  <td>{car.name}</td>
                  <td><img src={car.image} alt={car.name} width="100" /></td>
                  <td>{car.price}</td>
                  <td>{car.status}</td>
                  <td>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton delete>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CarTable>
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

const CarTable = styled.table`
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

export default CarsPage;
