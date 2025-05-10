import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

function BillPayment() {
  const { user } = useAuth(); // Get the logged-in user
  const userId = user?.id; // Use the logged-in user's ID
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch items for the bill payment
    const fetchItems = async () => {
      try {
        if (location.state && location.state.items) {
          setItems(location.state.items);
          calculateTotal(location.state.items);
        } else {
          const response = await axios.get(`http://localhost:8080/api/users/${userId}/won-items`);
          setItems(response.data);
          calculateTotal(response.data);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    fetchItems();
  }, [location.state, userId]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.winningBid, 0);
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    try {
      // Add payment logic here (e.g., integrate with a payment gateway)
      alert('Payment successful!');

      // Clear won items from the backend after payment
      await axios.delete(`http://localhost:8080/api/users/${userId}/won-items`);

      // Redirect to home or another page after payment
      navigate('/');
    } catch (err) {
      console.error('Error during payment:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bill Payment
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Please review your bill and proceed with the payment.
      </Typography>

      {items.length === 0 ? (
        <Typography>No items to display.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={`http://localhost:8080${item.productImage}`} // Prepend the base URL
                      alt={item.productName}
                      style={{ width: '50px', height: '50px', borderRadius: '8px' }}
                    />
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>₹{item.winningBid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Price: ₹{totalPrice}
      </Typography>

      <Button variant="contained" color="primary" onClick={handlePayment}>
        Pay Now
      </Button>
    </Box>
  );
}

export default BillPayment;