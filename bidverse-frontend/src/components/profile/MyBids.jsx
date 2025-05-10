// src/components/profile/MyBids.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function MyBids() {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // e.g. user = { id: 5, username: 'john' }

  useEffect(() => {
    if (!user) return; // must be logged in

    const fetchBids = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${user.id}/my-bids`);
        if (Array.isArray(response.data)) {
          setBids(response.data);
        } else {
          setBids([]); // Handle case where backend returns a message instead of an array
        }
      } catch (err) {
        console.error('Fetch my-bids error:', err);
        setError('Failed to load your bids.');
      }
    };

    fetchBids();
  }, [user]);

  if (!user) {
    return <Typography>Please log in to view your bids.</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (bids.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          You haven't placed any bids yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Bid Amount</TableCell>
              <TableCell>Bid Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>{bid.productId}</TableCell>
                <TableCell>₹{bid.amount}</TableCell>
                <TableCell>{new Date(bid.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MyBids;
