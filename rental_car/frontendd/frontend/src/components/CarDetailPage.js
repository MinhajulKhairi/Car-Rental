import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const CarDetailPage = ({ car }) => {
  return (
    <div>
      <Navbar />
      <CarDetailContainer>
        <CarImage src={car.image} alt={car.name} />
        <CarInfo>
          <CarTitle>{car.name} <Price>{car.price}</Price></CarTitle>
          <CarDetails>
            <DetailItem>Jumlah Kursi: {car.seats}</DetailItem>
            <DetailItem>Transmisi: {car.transmission}</DetailItem>
            <DetailItem>Warna: {car.color}</DetailItem>
          </CarDetails>
          <ButtonContainer>
            <Button>Sewa Mobil</Button>
          </ButtonContainer>
        </CarInfo>
      </CarDetailContainer>
      <Footer />
    </div>
  );
};

const CarDetailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px;
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
  margin: 20px;
`;

const CarInfo = styled.div`
  padding: 20px;
  text-align: left;
  max-width: 500px;
`;

const CarTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Price = styled.span`
  color: #ff8000;
  font-weight: bold;
`;

const CarDetails = styled.div`
  margin: 10px 0;
`;

const DetailItem = styled.p`
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
`;

export default CarDetailPage;