// src/components/RatingPage.js
<<<<<<< HEAD
=======

>>>>>>> 08176f670c70f520702a299a1e8d090e899b915d
import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const RatingPage = () => {
  return (
    <div>
      <Navbar />
      <Container>
        <FormContainer>
          <h2>Rating</h2>
          <form>
            <Label>Nama Lengkap</Label>
            <Input type="text" placeholder="Masukan nama pelanggan" />

            <Label>Alamat</Label>
            <Input type="text" placeholder="Masukan alamat pelanggan" />

            <Label>Ulasan</Label>
            <Textarea placeholder="Apa kata pelanggan tentang kami?" />
          </form>
        </FormContainer>
      </Container>
      <Footer />
    </div>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default RatingPage;
