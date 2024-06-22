import React, { useState , useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from './app/AuthProvider';
import { serverApi } from './app/config';

const RentPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
      return;
    }
    if (auth.user.role !== 'user') {
      navigate("/admin");
      return;
    }else{
      // user_id = auth.user.pengguna_id;
      setLoading(false);
      setUserId(auth.user.pengguna_id);
    }
  }, [auth.user, navigate]);

  console.log(auth.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    sim: null,
    ktp: null,
    orderDate: '',
    pickupDate: '',
    returnDate: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('ktp', formData.ktp);
    data.append('sim', formData.sim);
    if(userId==null){
      alert('Pengguna belum terdaftar, silahkan login dahulu');
      return;
    }
    data.append('pengguna_id', userId);
    data.append('mobil_id', id);
    data.append('tanggal_pemesanan', formData.orderDate);
    data.append('tanggal_pengembalian', formData.returnDate);
    data.append('tanggal_pengambilan', formData.pickupDate);
    data.append('status_pemesanan', 'Menunggu Pembayaran');

    try {
      const response = await fetch(`${serverApi}/pemesanan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: data
      });
      const result = await response.json();
      if (result.success) {
        alert('Pemesanan berhasil dibuat');
        navigate('/'); // Ganti dengan navigasi ke halaman yang sesuai
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Terjadi kesalahan saat membuat pemesanan');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Column>
              <Label>Gambar SIM</Label>
              <Input
                type="file"
                name="sim"
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <Label>Gambar KTP</Label>
              <Input
                type="file"
                name="ktp"
                onChange={handleChange}
                required
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>Tanggal Pemesanan</Label>
              <Input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <Label>Tanggal Pengambilan</Label>
              <Input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <Label>Tanggal Pengembalian</Label>
              <Input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </Column>
          </Row>
          <Button type="submit">Kirim</Button>
        </Form>
      </FormContainer>
    </div>
  );
};

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
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

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  align-self: flex-end;
`;

export default RentPage;
