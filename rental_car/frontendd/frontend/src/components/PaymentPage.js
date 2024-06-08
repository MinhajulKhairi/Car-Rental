import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    paymentProof: null,
    totalPayment: '',
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
          <Label>Nama Lengkap</Label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Masukan nama lengkap"
            required
          />
          <Label>Alamat Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Masukan alamat email"
            required
          />
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

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

export default PaymentPage;
