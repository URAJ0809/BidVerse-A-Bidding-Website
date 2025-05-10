import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function WonItems() {
  const [wonItems, setWonItems] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchWonItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${user.id}/won-items`);
        setWonItems(response.data);
      } catch (err) {
        console.error('Error fetching won items:', err);
        setError('Failed to load won items');
      }
    };

    fetchWonItems();
  }, [user]);

  if (!user) {
    return <Typography>Please log in to view your won items.</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (wonItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          You haven't won any auctions yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Your Won Items
      </Typography>
      <Grid container spacing={2}>
        {wonItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.productImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:8080${item.productImage}`}
                  alt={item.productName}
                />
              )}
              <CardContent>
                <Typography variant="h6">{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Won for: ₹{item.winningBid}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Won on: {new Date(item.wonAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/bill-payment"
          state={{ items: wonItems }} // Pass the won items as state
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
}

export default WonItems;
