import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import economyCarImage from '../assets/images/ekonomi.jpg';
import suvCarImage from '../assets/images/suv.jpg';
import { useAuth } from './app/AuthProvider';
import axios from 'axios'; // Import axios for API requests
import { useNavigate } from 'react-router-dom';
import { serverApi } from './app/config';

// Component definition
const HomePage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [cars, setCars] = useState([]);

  // melakukan fetch data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${serverApi}/carshome`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  // event handlers/tangani klik saat menekan tombol detail mobil dan sewa mobil
  const handleDetailClick = (carId) => {
    navigate(`/car-detail/${carId}`);
  };
  const handleRentClick = (carId) => {
    navigate(`/rent/${carId}`);
  };

  return (
    <div>
      <Header>
        <h1>Sewa Mobil dengan Mudah dan Cepat</h1>
        <p>Temukan mobil impian Anda untuk setiap perjalanan. Pilih, pesan, dan nikmati kenyamanan berkendara bersama kami.</p>
        {/* button sewa sekarang arahkan ke list mobil */}
        <Button as="a" href="/list-mobil">Sewa Sekarang</Button>
      </Header>
      <CarSection>
        {cars.map((car) => (
          <Car key={car.mobil_id}>
            <CarImage src={`${serverApi}/${car.gambar}`} />
            <CardContent>
              <h2>{car.nama_mobil}</h2>
              <p>{car.fasilitas}</p>
            </CardContent>
            <ButtonGroup>
              <Button onClick={() => handleRentClick(car.mobil_id)}>Sewa</Button>
              <Button onClick={() => handleDetailClick(car.mobil_id)}>Detail</Button>
            </ButtonGroup>
          </Car>
        ))}
      </CarSection>
      <Testimonials>
        <h2>Apa Kata Pelanggan Kami</h2>
        <Testimonial>
          <p>“Layanan luar biasa! Mobil bersih dan nyaman. Pasti akan sewa lagi!”</p>
          <span>Elva, Toraja</span>
        </Testimonial>
        <Testimonial>
          <p>“Proses pemesanan mudah dan cepat. Mobil siap pakai dengan kondisi prima.”</p>
          <span>Ajul, Makassar</span>
        </Testimonial>
        <Testimonial>
          <p>“Staf sangat membantu dan ramah. Pengalaman berkendara yang menyenangkan.”</p>
          <span>Imam, Sinjai</span>
        </Testimonial>
      </Testimonials>
    </div>
  );
};

const Header = styled.header`
  text-align: center;
  margin: 50px 0 80px 0; /* Increase bottom margin to push down the button */
  padding: 20px;
  font-size: 20px;
`;

const Button = styled.a`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 30px 0 0 0; /* Adjust margin-top for proper spacing */
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
`;

const CarSection = styled.section`
  display: flex;
  padding-top: 50px;
  justify-content: center;
  margin: 50px 0;
`;

const Car = styled.div`
  text-align: center;
  margin: 0 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px; 
  object-fit: cover;
  margin-top: 200px;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const Testimonials = styled.section`
  text-align: center;
  margin: 250px 0; /* Increase margin below testimonials section */
  margin: 50px 0;
  padding-top: 50px;

`;

const Testimonial = styled.div`
  margin: 20px;
`;

export default HomePage;
