import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import inovaImage from '../assets/images/inova_putih.jpg';
import avanzaImage from '../assets/images/avanza_hitam.jpg';
import rushImage from '../assets/images/rush_putih.jpg';

const CarListPage = () => {
  const navigate = useNavigate();

  const handleDetailClick = (carId) => {
    navigate(`/car-detail/${carId}`);
  };

  const handleRentClick = () => {
    navigate(`/rent`);
  };

  return (
    <div>
      <Navbar />
      <CarListContainer>
        <CarCard>
          <CarImage src={inovaImage} />
          <CarInfo>
            <CarTitle>Inova 2021 <Price>Rp. 350.000/day</Price></CarTitle>
            <CarDetails>
              <DetailItem>Jumlah Kursi: 5</DetailItem>
              <DetailItem>Transmisi: CVT 7-percepatan</DetailItem>
              <DetailItem>Warna: Putih</DetailItem>
            </CarDetails>
            <ButtonContainer>
              <Button onClick={handleRentClick}>Sewa Mobil</Button>
              <Button onClick={() => handleDetailClick(1)}>Detail Mobil</Button>
            </ButtonContainer>
          </CarInfo>
        </CarCard>

        <CarCard>
          <CarImage src={avanzaImage} />
          <CarInfo>
            <CarTitle>Avanza 2024 <Price>Rp. 1.750.000/day</Price></CarTitle>
            <CarDetails>
              <DetailItem>Jumlah Kursi: 7</DetailItem>
              <DetailItem>Transmisi: CVT</DetailItem>
              <DetailItem>Warna: Hitam</DetailItem>
            </CarDetails>
            <ButtonContainer>
              <Button onClick={handleRentClick}>Sewa Mobil</Button>
              <Button onClick={() => handleDetailClick(2)}>Detail Mobil</Button>
            </ButtonContainer>
          </CarInfo>
        </CarCard>

        <CarCard>
          <CarImage src={rushImage} />
          <CarInfo>
            <CarTitle>Rush 2024 <Price>Rp. 1.500.000/day</Price></CarTitle>
            <CarDetails>
              <DetailItem>Jumlah Kursi: 7</DetailItem>
              <DetailItem>Transmisi: CVT</DetailItem>
              <DetailItem>Warna: Putih</DetailItem>
            </CarDetails>
            <ButtonContainer>
              <Button onClick={handleRentClick}>Sewa Mobil</Button>
              <Button onClick={() => handleDetailClick(3)}>Detail Mobil</Button>
            </ButtonContainer>
          </CarInfo>
        </CarCard>
      </CarListContainer>
      <Footer />
    </div>
  );
};

const CarListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px;
`;

const CarCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  height: 450px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CarInfo = styled.div`
  padding: 20px;
  text-align: left;
  flex-grow: 1;
`;

const CarTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Price = styled.span`
  float: right;
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
  margin: 5px 0;
  cursor: pointer;
  width: 48%;
  border-radius: 5px;
`;

export default CarListPage;
