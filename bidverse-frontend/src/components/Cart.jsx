// src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Alert,
  Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  // Fetch cart items from DB
  useEffect(() => {
    if (!user) return; // must be logged in
    const fetchCartItems = async () => {
      try {
        await axios.delete('http://localhost:8080/api/cart/remove-ended-auctions'); // Remove ended auctions
        const response = await axios.get(`http://localhost:8080/api/cart?userId=${user.id}`);
        setCartItems(response.data);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, [user]);

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
                      src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/placeholder.jpg'} // Prepend base URL
                      alt={item.name}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell align="right">
                    {!item.bidded && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Cart;
