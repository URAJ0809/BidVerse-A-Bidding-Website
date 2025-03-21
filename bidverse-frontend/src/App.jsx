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
import CatalogFull from './components/CatalogFull'; // if you have a full catalog
import Cart from './components/Cart';               // new cart page
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import ItemDetail from './components/ItemDetail';
import AddProduct from './components/AddProduct';



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
           <Route path="/" element={<Catalog />} />
           <Route path="/catalog-full" element={<CatalogFull />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/catalog/:id" element={<ItemDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/ContactForm" element={<ContactForm />} />
          {/* Cart route */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
        </Routes>
      </Paper>
    </Router>
  );
}

export default App;
