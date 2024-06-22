import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '../app/AuthProvider';
import { serverApi } from '../app/config';

const EditCarPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { carId } = useParams();
  const [carData, setCarData] = useState({
    nama_mobil: '',
    warna: '',
    transmisi: '',
    harga_sewa: '',
    fasilitas: '',
    jumlah_kursi: '',
    gambar: null
  });

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    } else if (auth.user.role !== 'admin') {
      navigate("/list-mobil");
    } else {
      const fetchCarData = async () => {
        try {
          const response = await fetch(`${serverApi}/cars/${carId}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          const data = await response.json();
          if (data.success === false) {
            alert(data.message);
            navigate("/admin/cars");
          } else {
            setCarData(data);
          }
        } catch (error) {
          console.error("Error fetching car data:", error);
        }
      };

      fetchCarData();
    }
  }, [auth.user, auth.token, carId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCarData({ ...carData, gambar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in carData) {
      formData.append(key, carData[key]);
    }

    const response = await fetch(`${serverApi}/cars/${carId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      alert('Mobil berhasil diperbarui');
      navigate("/admin/cars");
    } else {
      alert(result.message);
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
          <h1>Edit Mobil</h1>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Nama Mobil</label>
              <input type="text" name="nama_mobil" value={carData.nama_mobil} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Warna</label>
              <input type="text" name="warna" value={carData.warna} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Transmisi</label>
              <input type="text" name="transmisi" value={carData.transmisi} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Harga Sewa</label>
              <input type="number" name="harga_sewa" value={carData.harga_sewa} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Fasilitas</label>
              <textarea name="fasilitas" value={carData.fasilitas} onChange={handleChange} required></textarea>
            </FormGroup>
            <FormGroup>
              <label>Jumlah Kursi</label>
              <input type="number" name="jumlah_kursi" value={carData.jumlah_kursi} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Gambar (kosongkan jika tidak ingin mengubah gambar)</label>
              <input type="file" name="gambar" onChange={handleFileChange} />
            </FormGroup>
            <SubmitButton type="submit">Perbarui Mobil</SubmitButton>
          </Form>
        </Content>
      </AdminContainer>
    </div>
  );
};

const AdminContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
  }

  input, textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default EditCarPage;
