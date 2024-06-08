import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CarListPage from './components/CarListPage';
import CarDetailPage from './components/CarDetailPage';
import PaymentPage from './components/PaymentPage';
import RentPage from './components/RentPage';
import RatingPage from './components/RatingPage'; // Import the RatingPage
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/list-mobil" element={<CarListPage />} />
          <Route path="/car-detail/:id" element={<CarDetailPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/rating" element={<RatingPage />} /> {/* Add route for RatingPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;