import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '../app/AuthProvider';
import { serverApi } from '../app/config';


const AddCarsPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  // pemeriksaan autentikasi dan autorisasi
  if (!auth.user) {
    navigate("/login");
  }
  if (auth.user.role !== 'admin') {
    navigate("/list-mobil");
  }

  // state management
  const [carData, setCarData] = useState({
    nama_mobil: '',
    warna: '',
    transmisi: '',
    harga_sewa: '',
    fasilitas: '',
    jumlah_kursi: '',
    gambar: null
  });

  // event handlers
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

    const response = await fetch(`${serverApi}/cars`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      alert('Mobil berhasil ditambahkan');
      navigate("/admin/cars");
    } else {
      alert(result.message);
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
          <h1>Tambah Mobil</h1>
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
              <label>Gambar</label>
              <input type="file" name="gambar" onChange={handleFileChange} required />
            </FormGroup>
            <SubmitButton type="submit">Tambah Mobil</SubmitButton>
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  margin-top: 70px;
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

export default AddCarsPage;
