import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PaymentsPage = () => {
  const payments = [
    {
      id: 1,
      name: 'Ajul',
      email: 'ajul@xyd.com',
      paymentProof: 'url_to_payment_proof_image_1', // replace with actual image URL
      totalPayment: 'Rp. 100.000,00'
    },
    {
      id: 2,
      name: 'Elva',
      email: 'elva@eio.com',
      paymentProof: 'url_to_payment_proof_image_2', // replace with actual image URL
      totalPayment: 'Rp. 350.000,00'
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
          <h1>List Pembayaran</h1>
          <PaymentsTable>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Bukti Pembayaran</th>
                <th>Total Pembayaran</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.id}>
                  <td>{index + 1}</td>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td><img src={payment.paymentProof} alt="Bukti Pembayaran" width="100" /></td>
                  <td>{payment.totalPayment}</td>
                  <td>
                    <ActionButton delete>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </PaymentsTable>
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

const PaymentsTable = styled.table`
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

export default PaymentsPage;
