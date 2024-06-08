import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const RentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    simImage: null,
    ktpImage: null,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to the server
    console.log(formData);
  };

  return (
    <div>
      <Navbar />
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Column>
              <Label>Nama Lengkap</Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukan nama lengkap"
                required
              />
            </Column>
            <Column>
              <Label>Alamat Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukan alamat email"
                required
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>Gambar SIM</Label>
              <Input
                type="file"
                name="simImage"
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <Label>Gambar KTP</Label>
              <Input
                type="file"
                name="ktpImage"
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
      <Footer />
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
