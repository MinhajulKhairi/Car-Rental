import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'; // Import axios for API requests
import { useAuth } from './app/AuthProvider'; // Import useAuth for authentication
import { serverApi } from './app/config';

// definition component
const CarListPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [cars, setCars] = useState([]);

  // pemeriksaan autentikasi dan autorisasi
  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
      return;
    }
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${serverApi}/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [auth.user, navigate]);


  // event handler
  const handleDetailClick = (carId) => {
    navigate(`/car-detail/${carId}`);
  };
  const handleRentClick = (carId) => {
    navigate(`/rent/${carId}`);
  };


  return (
    <PageWrapper>
      <Navbar />
      <ContentWrapper>
        <CarListContainer>
          {cars.map((car) => (
            <CarCard key={car.mobil_id}>
              <StatusLabel>{car.status}</StatusLabel>
              <CarImage src={`${serverApi}/${car.gambar}`} alt={car.nama_mobil} />
              <CarInfo>
                <CarTitle>
                  {car.nama_mobil}
                  <Price>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(car.harga_sewa)}/day</Price>
                </CarTitle>
                <CarDetails>
                  <DetailItem>Jumlah Kursi: {car.jumlah_kursi}</DetailItem>
                  <DetailItem>Transmisi: {car.transmisi}</DetailItem>
                  <DetailItem>Warna: {car.warna}</DetailItem>
                </CarDetails>
                <ButtonContainer>
                  <Button onClick={() => handleRentClick(car.mobil_id)}>Sewa Mobil</Button>
                  <Button onClick={() => handleDetailClick(car.mobil_id)}>Detail Mobil</Button>
                </ButtonContainer>
              </CarInfo>
            </CarCard>
          ))}
        </CarListContainer>
      </ContentWrapper>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const CarListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const CarCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;  /* Added for positioning StatusLabel */
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatusLabel = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => (props.children === 'Available' ? 'green' : 'red')};  /* Change color based on status */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
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
  font-size: 14px;
  color: #555;
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
  transition: background-color 0.3s;

  &:hover {
    background-color: #e67300;
  }
`;

export default CarListPage;
