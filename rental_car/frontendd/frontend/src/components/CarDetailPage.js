import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import carImage from '../assets/images/inova_putih.jpg';

const CarDetailPage = () => {
  const { id } = useParams();
  // Fetch car details based on the id from a data source or state management

  return (
    <PageWrapper>
      <Navbar />
      <DetailContainer>
        <ImageSection>
          <CarImage src={carImage} alt="Car Detail" />
        </ImageSection>
        <InfoSection>
          <Title>Toyota Yaris GR Sport 2021</Title>
          <Price>Rp. 350.000/day</Price>
          <Details>
            <DetailItem>Jumlah Kursi: 5</DetailItem>
            <DetailItem>Transmisi: CVT 7-percepatan</DetailItem>
            <DetailItem>Warna: Putih</DetailItem>
          </Details>
          <Button>Sewa Mobil</Button>
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
