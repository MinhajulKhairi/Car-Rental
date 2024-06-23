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
    return <div>Loading...</div>; 
  }

  return (
    <PageWrapper>
      <Navbar />
      <DetailContainer>
        <ImageSection>
          <CarImage src={`${serverApi}/${car.gambar}`} style={{ width: '100%', maxWidth: '300px', borderRadius: '10px' }} />
        </ImageSection>
        <InfoSection>
          <Title>{car.nama_mobil}</Title>
          <Price>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(car.harga_sewa)}/day</Price>
          <Details>
            <DetailItem>Jumlah Kursi: {car.jumlah_kursi}</DetailItem>
            <DetailItem>Transmisi: {car.transmisi}</DetailItem>
            <DetailItem>Warna: {car.warna}</DetailItem>
            <DetailItem>Status: {car.status}</DetailItem> {/* Make sure 'status' is part of the data returned by API */}
          </Details>
          <Button onClick={handleRentClick}>Sewa Mobil</Button>
        </InfoSection>
      </DetailContainer>
      <Footer />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const DetailContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageSection = styled.div`
  flex: 1;
  text-align: center;
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  color: #ff8000;
  margin-bottom: 20px;
`;

const Details = styled.div`
  margin-bottom: 20px;
`;

const DetailItem = styled.p`
  margin: 5px 0;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
`;

export default CarDetailPage;
