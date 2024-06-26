import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '../app/AuthProvider';
import { serverApi } from '../app/config';

// auth dan navigasi
const CarsPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // pemeriksaan autentikasi dan autorisasi
  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
    if (auth.user.role !== 'admin') {
      navigate("/list-mobil");
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${serverApi}/cars`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [auth.token]);

  // render loading
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDeleteBooking = async (carId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus mobil ini?")) {
      try {
        const response = await fetch(`${serverApi}/cars/${carId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (!response.ok) {
          alert('Token expired. Silahkan login ulang');
          window.location.href = '/logout-direct';
          return;
        }
        alert('Mobil berhasil dihapus');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting mobil:', error);
        alert('Gagal menghapus mobil');
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
          <Header>
            <h1>List Mobil</h1>
            <AddCarButton to="/admin/cars/add">Tambah Mobil</AddCarButton>
          </Header>
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
                  <td>{car.nama_mobil}</td>
                  <td><img src={`${serverApi}/${car.gambar}`} alt={car.nama_mobil} style={{ width: '100px' }} /></td>
                  <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(car.harga_sewa)}</td>
                  <td>{car.status}</td>
                  <td>
                    <ActionButton as={Link} to={`/admin/cars/edit/${car.mobil_id}`}>Edit</ActionButton>
                    <ActionButton delete onClick={() => handleDeleteBooking(car.mobil_id)}>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CarTable>
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
  text-align: center;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AddCarButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;

  &:hover {
    background-color: #0056b3;
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
