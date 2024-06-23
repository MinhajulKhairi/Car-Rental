import React , { useEffect } from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterSection>
        <h3>Rental Mobil</h3>
        <p>Temukan mobil impian Anda untuk setiap perjalanan.</p>
      </FooterSection>
      <FooterSection>
        <h3>Hubungi Kami</h3>
        <p>Alamat: Universitas Hasanuddin</p>
        <p>Telepon: 0829281291821</p>
        <p>Email: info@rentalmobil.com</p>
      </FooterSection>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center; /* Center items vertically */
  padding: 10px 20px; /* Adjust padding */
  background-color: #cac7c7;
   /* Set the height of the footer */
`;

const FooterSection = styled.div`
  margin: 20px;
`;

export default Footer;
