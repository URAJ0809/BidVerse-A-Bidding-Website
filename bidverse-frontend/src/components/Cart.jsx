// src/components/Cart.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext'; // to get user

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(null);
  const { user } = useAuth(); // e.g. user = { id: 5, username: 'john' }

  // Fetch cart items from DB
  useEffect(() => {
    if (!user) return; // must be logged in
    axios.get(`http://localhost:8080/api/cart?userId=${user.id}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error('Fetch cart error:', err));
  }, [user]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  // Remove item from DB + local state
  const handleRemove = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      setMessage('Item removed from cart');
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  if (!user) {
    return <Typography>Please log in to see your cart.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        sx={{ width: 56, height: 56, borderRadius: '8px' }}
                        src={item.imageUrl || '/placeholder.jpg'}
                        alt={item.name}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">{item.name}</Typography>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant="h6">
              Subtotal: ₹{subtotal.toLocaleString()}
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Cart;
