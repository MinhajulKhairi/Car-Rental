import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './app/AuthProvider';
import { serverApi } from './app/config';

// component definition
const PaymentPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  let user_id = null;

  // pemeriksaan autentikasi dan autorisasi
  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
      return;
    }
    if (auth.user.role !== 'user') {
      navigate("/admin");
      return;
    } else {
      user_id = auth.user.pengguna_id;
    }
  }, [auth.user, navigate]);

  // state and event handlers
  const [loading, setLoading] = useState(true);
  
  const [pemesanans, setPemesanans] = useState([]);
  const [selectedPemesananId, setSelectedPemesananId] = useState('');
  const [formData, setFormData] = useState({
    paymentProof: null,
    totalPayment: '',
  });

  // set pemesananan (memuat data pemesanan)
  useEffect(() => {
    if (user_id) {
      const fetchPemesanan = async () => {
        try {
          const response = await fetch(`${serverApi}/pemesanan/pengguna/${user_id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          const data = await response.json();
          // jika data ada
          if (data.success) {
            setPemesanans(data.pemesanan);
          }else{
            setPemesanans([]);
          }
        } catch (error) {
          console.error("Error fetching pemesanan:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPemesanan();
    }
  }, [user_id]);

  // handle change function
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPemesananId) {
      alert("Pilih pesanan yang akan dibayar terlebih dahulu!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('pemesanan_id', selectedPemesananId);
    formDataToSend.append('jumlah_pembayaran', formData.totalPayment);
    formDataToSend.append('metode_pembayaran', 'Transfer Bank');
    formDataToSend.append('status_pembayaran', 'Menunggu Konfirmasi');
    formDataToSend.append('paymentProof', formData.paymentProof);

    // API Request
    try {
      const response = await fetch(`${serverApi}/pembayaran`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: formDataToSend
      });

      // handle response
      const result = await response.json();
      if (result.success) {
        alert('Pembayaran berhasil dibuat');
        navigate('/list-mobil');
      } else {
        alert(result.message);
      }
      // error handling
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Terjadi kesalahan saat membuat pembayaran');
    }

  };

  return (
    <div>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Label>Pilih Pesanan yang Akan Dibayar</Label>

          <Select name="pemesanan_id" onChange={(e) => setSelectedPemesananId(e.target.value)} required>
            <option value="">Pilih Pesanan</option>
            {pemesanans.length === 0 ? (
              <option value="">Tidak ada pesanan</option>
            ) : (
              pemesanans.map(pemesanan => (
                <option key={pemesanan.pemesanan_id} value={pemesanan.pemesanan_id}>
                  {pemesanan.nama_mobil} - {pemesanan.tanggal_pengambilan} sampai {pemesanan.tanggal_pengembalian} (total {pemesanan.total_pembayaran})
                </option>
              ))
            )}
          </Select>
          <Label>Bukti Pembayaran</Label>

          <Input
            type="file"
            name="paymentProof"
            onChange={handleChange}
            required
          />
          <Label>Total Pembayaran</Label>
          <Input
            type="text"
            name="totalPayment"
            value={formData.totalPayment}
            onChange={handleChange}
            placeholder="Rp."
            required
          />
          <Button type="submit">Bayar</Button>
        </Form>
      </FormContainer>
    </div>
  );
};

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

export default PaymentPage;
