// src/components/admin/ManageBids.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

function ManageBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchAllBids();
  }, []);

  const fetchAllBids = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/bids');
      setBids(res.data);
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  // Example: mark a product as sold, remove bids, etc.
  const markAsSold = async (bidId, productId) => {
    try {
      // e.g. POST /api/admin/mark-sold?bidId=..., or something similar
      await axios.post(`http://localhost:8080/api/admin/mark-sold?bidId=${bidId}`);
      // Then remove all old bids for that product
      await axios.delete(`http://localhost:8080/api/admin/clear-bids/${productId}`);
      fetchAllBids();
    } catch (err) {
      console.error('Error marking item as sold:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bids
      </Typography>

      {bids.length === 0 ? (
        <Typography>No active bids found.</Typography>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Product: {bid.productName}</Typography>
              <Typography variant="body1">Bid Amount: ₹{bid.amount}</Typography>
              <Typography variant="body2">Bidder: {bid.bidderUsername}</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => markAsSold(bid.id, bid.productId)}
              >
                Mark as Sold
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default ManageBids;
