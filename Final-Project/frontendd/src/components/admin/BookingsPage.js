import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '../app/AuthProvider';
import { serverApi } from '../app/config';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${serverApi}/pemesanan`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (!response.ok) {
          alert('Token expired. Silahkan login ulang');
          window.location.href = '/logout-direct';
          return;
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [auth.token, navigate]);

  const handleDeleteBooking = async (pemesananId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pemesanan ini?")) {
      try {
        const response = await fetch(`${serverApi}/pemesanan/${pemesananId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (!response.ok) {
          // throw new Error('Gagal menghapus pemesanan');
          alert('Token expired. Silahkan login ulang');
          window.location.href = '/logout-direct';
          return;
        }
        // const updatedBookings = bookings.filter(booking => booking.pemesanan_id !== pemesananId);
        // setBookings(updatedBookings);
        alert('Pemesanan berhasil dihapus');
        // reload
        window.location.reload();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Gagal menghapus pemesanan');
      }
    }
  };

  return (
    <div>
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
          <h1>List Pesanan</h1>
          {loading ? (
            <LoadingMessage>Loading...</LoadingMessage>
          ) : (
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
                  <tr key={booking.pemesanan_id}>
                    <td>{index + 1}</td>
                    <td>{booking.nama_lengkap}</td>
                    <td>{booking.email}</td>
                    <td><img src={`${serverApi}/cars_image/${booking.sim}`} alt="SIM" width="100" /></td>
                    <td><img src={`${serverApi}/cars_image/${booking.ktp}`} alt="KTP" width="100" /></td>
                    <td>
                      <ActionButton delete onClick={() => handleDeleteBooking(booking.pemesanan_id)}>Delete</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </BookingTable>
          )}
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

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
`;

export default BookingsPage;
