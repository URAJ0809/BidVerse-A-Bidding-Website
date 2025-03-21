// src/components/profile/MyBids.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function MyBids() {
  const [bids, setBids] = useState([]);
  const { user } = useAuth(); // e.g. user = { id: 5, username: 'john' }

  useEffect(() => {
    if (!user) return; // must be logged in
    // Example: GET /api/users/{userId}/my-bids
    axios.get(`http://localhost:8080/api/users/${user.id}/my-bids`)
      .then(res => setBids(res.data))
      .catch(err => console.error('Fetch my-bids error:', err));
  }, [user]);

  if (!user) {
    return <Typography>Please log in to see your bids.</Typography>;
  }

  if (bids.length === 0) {
    return <Typography>No current bids found.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {bids.map((bid) => (
        <Card key={bid.id}>
          <CardContent>
            <Typography variant="h6">{bid.itemName}</Typography>
            <Typography variant="body2">Your Bid: ₹{bid.bidAmount}</Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {bid.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default MyBids;
