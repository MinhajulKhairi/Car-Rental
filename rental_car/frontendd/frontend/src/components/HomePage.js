import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import economyCarImage from '../assets/images/ekonomi.jpg';
import suvCarImage from '../assets/images/suv.jpg';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Header>
        <h1>Sewa Mobil dengan Mudah dan Cepat</h1>
        <p>Temukan mobil impian Anda untuk setiap perjalanan. Pilih, pesan, dan nikmati kenyamanan berkendara bersama kami.</p>
        <Button>Sewa Sekarang</Button>
      </Header>
      <CarSection>
        <Car>
          <CarImage src={economyCarImage} alt="Mobil Ekonomi" />
          <h2>Mobil Ekonomi</h2>
          <p>Hemat dan nyaman untuk perjalanan sehari-hari.</p>
          <Button>Detail</Button>
          <Button>Sewa</Button>
        </Car>
        <Car>
          <CarImage src={suvCarImage} alt="Mobil SUV" />
          <h2>Mobil SUV</h2>
          <p>Kuat dan handal untuk petualangan di segala medan.</p>
          <Button>Detail</Button>
          <Button>Sewa</Button>
        </Car>
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
      <Footer />
    </div>
  );
};

const Header = styled.header`
  text-align: center;
  margin: 50px 0;
  padding: 20px;
`;

const Button = styled.button`
  background-color: #ff8000;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
`;

const CarSection = styled.section`
  display: flex;
  justify-content: center;
  margin: 50px 0;
`;

const Car = styled.div`
  text-align: center;
  margin: 0 20px;
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px; /* Set fixed height for the image */
  object-fit: cover;
`;

const Testimonials = styled.section`
  text-align: center;
  margin: 50px 0;
`;

const Testimonial = styled.div`
  margin: 20px;
`;

export default HomePage;
