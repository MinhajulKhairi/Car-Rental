import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link , useNavigate} from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '../app/AuthProvider';
import { serverApi } from '../app/config';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
    if (auth.user.role !== 'admin') {
      navigate("/list-mobil");
    }else{
      setUserId(auth.user.pengguna_id);
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${serverApi}/pembayaran`, {
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
        if(data.message=="Token expired. Silahkan login ulang"){
          alert('Token expired. Silahkan login ulang');
          window.location.href = '/logout-direct';
          return;
        }
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // [] menandakan useEffect hanya dijalankan sekali saat komponen dimuat

  const handleDeletePayment = async (pembayaranId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pembayaran ini?")) {
      try {
        const response = await fetch(`${serverApi}/pembayaran/${pembayaranId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (!response.ok) {
          // throw new Error('Gagal menghapus pembayaran');
          alert('Token expired. Silahkan login ulang response');
          // window.location.href = '/logout-direct';
          return;
        }
        const updatedPayments = payments.filter(payment => payment.pemesanan_id !== pembayaranId);
        setPayments(updatedPayments);
        alert('Pembayaran berhasil dihapus');
        // reload halaman
        window.location.reload();
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Gagal menghapus pembayaran');
      }
    }
  };

  return (
    <div>
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
          {loading ? (
            <LoadingMessage>Loading...</LoadingMessage>
          ) : (
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
                  <tr key={payment.pembayaran_id}>
                    <td>{index + 1}</td>
                    <td>{payment.nama_lengkap}</td>
                    <td>{payment.email}</td>
                    <td><img src={`${serverApi}/cars_image/${payment.bukti_pembayaran}`} alt="Bukti Pembayaran" width="100" /></td>
                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(payment.jumlah_pembayaran)}</td>
                    <td>
                      <ActionButton delete onClick={() => handleDeletePayment(payment.pembayaran_id)}>Delete</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </PaymentsTable>
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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
`;


export default PaymentsPage;
