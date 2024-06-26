import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LogoutPage from './components/LogoutPage';
import LogoutDirect from './components/LogoutDirect';
import CarListPage from './components/CarListPage';
import CarDetailPage from './components/CarDetailPage';
import PaymentPage from './components/PaymentPage';
import RentPage from './components/RentPage';
import RatingPage from './components/RatingPage';
import AdminPage from './components/AdminPage';
// import UsersPage from './components/admin/UsersPage';
import CarsPage from './components/admin/CarsPage';
import AddCarsPage from './components/admin/AddCarsPage';
import EditCarPage from './components/admin/EditCarsPage';
import BookingsPage from './components/admin/BookingsPage';
import PaymentsPage from './components/admin/PaymentsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProvider from './components/app/AuthProvider';
import PrivateRoute from './components/app/PrivateRoute';
import { useAuth } from './components/app/AuthProvider';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/logout-direct" element={<LogoutDirect />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/list-mobil" element={<CarListPage  />} />
            <Route path="/car-detail/:id" element={<CarDetailPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/rent/:id" element={<RentPage />} />
            {/*<Route path="/rating" element={<RatingPage />} />*/}
            <Route path="/admin" element={<AdminPage />} />
            {/*<Route path="/admin/users" element={<UsersPage />} />*/}
            <Route path="/admin/cars" element={<CarsPage />} />
            <Route path="/admin/cars/add" element={<AddCarsPage />} />
            <Route path="/admin/cars/edit/:carId" element={<EditCarPage />} />
            <Route path="/admin/bookings" element={<BookingsPage />} />
            <Route path="/admin/payments" element={<PaymentsPage />} />
          </Routes>
          <Footer/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
