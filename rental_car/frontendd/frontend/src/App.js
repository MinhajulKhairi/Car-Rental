import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CarListPage from './components/CarListPage';
import CarDetailPage from './components/CarDetailPage'; // Import the CarDetailPage
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
          <Route path="/car-detail/:id" element={<CarDetailPage />} /> {/* Add route for CarDetailPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;