// src/components/profile/WonItems.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function WonItems() {
  const [wonItems, setWonItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    // Example: GET /api/users/{userId}/won-items
    axios.get(`http://localhost:8080/api/users/${user.id}/won-items`)
      .then(res => setWonItems(res.data))
      .catch(err => console.error('Fetch won-items error:', err));
  }, [user]);

  if (!user) {
    return <Typography>Please log in to see your won items.</Typography>;
  }

  if (wonItems.length === 0) {
    return <Typography>You haven't won any items yet.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {wonItems.map((item) => (
        <Card key={item.id}>
          <CardContent>
            <Typography variant="h6">{item.itemName}</Typography>
            <Typography variant="body2">
              Final Price: ₹{item.finalPrice}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default WonItems;
