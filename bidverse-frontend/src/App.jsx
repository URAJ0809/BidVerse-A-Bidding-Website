// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Paper from '@mui/material/Paper';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Supporters from './components/Supporters';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import CatalogFull from './components/CatalogFull';
import Cart from './components/Cart';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import ItemDetail from './components/ItemDetail';
import AddProduct from './components/admin/AddProduct';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLogin from './components/AdminLogin';
import BillPayment from './components/BillPayment';

// Admin pages
import AdminDashboard from './components/admin/AdminDashboard';
import ManageBids from './components/admin/ManageBids';

function App() {
  return (
    <Router>
      <Paper
        elevation={3}
        sx={{
          m: 2,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          minHeight: 'calc(100vh - 4rem)',
          overflow: 'visible',
          backgroundColor: '#fff',
        }}
      >
        <Header />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Catalog />
                <Supporters />
                <ContactForm />
                <Footer />
              </>
            }
          />
          <Route path="/catalog-full" element={<CatalogFull />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/catalog/:id" element={<ItemDetail />} />
          <Route path="/ContactForm" element={<ContactForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/bill-payment" element={<BillPayment />} />

          {/* Protected Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedAdminRoute>
                <AddProduct />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/manage-bids"
            element={
              <ProtectedAdminRoute>
                <ManageBids />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Paper>
    </Router>
  );
}

export default App;
