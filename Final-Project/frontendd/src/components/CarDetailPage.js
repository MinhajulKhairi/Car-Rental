import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'; // Import axios for API requests
import { useAuth } from './app/AuthProvider'; // Import useAuth for authentication
import { serverApi } from './app/config';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [car, setCar] = useState(null);

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
      return;
    }

    const fetchCarById = async () => {
      try {
        const response = await axios.get(`${serverApi}/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car:', error);
        // Handle error state if needed
      }
    };

    fetchCarById();
  }, [auth.user, id, navigate]);

  const handleRentClick = () => {
    navigate(`/rent/${id}`);
  };

  if (!car) {
    return <LoadingWrapper>Loading...</LoadingWrapper>;
  }

  return (
    <PageWrapper>
      <Navbar />
      <ContentWrapper>
        <DetailContainer>
          <ImageSection>
            <CarImage src={`${serverApi}/${car.gambar}`} alt={car.nama_mobil} />
          </ImageSection>
          <InfoSection>
            <Title>{car.nama_mobil}</Title>
            <Price>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(car.harga_sewa)}/day</Price>
            <Details>
              <DetailItem>Jumlah Kursi: {car.jumlah_kursi}</DetailItem>
              <DetailItem>Transmisi: {car.transmisi}</DetailItem>
              <DetailItem>Warna: {car.warna}</DetailItem>
            </Details>
            <Button onClick={handleRentClick}>Sewa Mobil</Button>
          </InfoSection>
        </DetailContainer>
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
  flex-direction: column;
  align-items: center;
  padding: 130px;
  background-color: #f8f8f8;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  margin: 20px;
`;

const InfoSection = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
`;

const Price = styled.p`
  font-size: 22px;
  color: #ff8000;
  margin-bottom: 20px;
`;

const Details = styled.div`
  margin-bottom: 20px;
`;

const DetailItem = styled.p`
  margin: 5px 0;
  font-size: 18px;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e67300;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;

export default CarDetailPage;
