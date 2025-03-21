// src/components/ItemDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext'; // <-- import your AuthContext

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

function ItemDetail() {
  const { id } = useParams(); // Product ID from URL
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // e.g. 60-second demo timer
  const [error, setError] = useState(null);

  // Get the logged-in user from AuthContext
  // e.g. user = { id: 5, username: "john", email: "john@example.com" }
  const { user } = useAuth();

  // 1. Fetch product + existing bids on mount
  useEffect(() => {
    // Fetch product details
    axios.get(`http://localhost:8080/api/catalog/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Fetch product error:', err));

    // Fetch existing bids (if your backend provides /api/catalog/:id/bids)
    axios.get(`http://localhost:8080/api/catalog/${id}/bids`)
      .then((res) => setBids(res.data))
      .catch((err) => console.error('Fetch bids error:', err));
  }, [id]);

  // 2. Timer logic (demo)
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auction ended; pick a winner from local state
      if (bids.length > 0) {
        // highest = the bid with the greatest amount
        const highest = bids.reduce((acc, b) => b.amount > acc.amount ? b : acc, bids[0]);
        if (highest.userId === user?.id) {
          alert(`You won the product at ₹${highest.amount}!`);
          // In a real system, call your backend to finalize or add to cart
        } else {
          alert(`Auction ended! The highest bidder is user #${highest.userId} at ₹${highest.amount}`);
        }
      } else {
        alert('Auction ended with no bids.');
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, bids, user]);

  // 3. Place a new bid
  const handlePlaceBid = async () => {
    setError(null);

    // Check if user is logged in
    if (!user) {
      setError('You must be logged in to place a bid.');
      return;
    }

    const bidValue = parseInt(newBid, 10);
    if (isNaN(bidValue) || bidValue <= 0) {
      setError('Please enter a valid positive bid.');
      return;
    }

    try {
      // POST the bid with userId from AuthContext
      await axios.post(`http://localhost:8080/api/catalog/${id}/bids`, {
        userId: user.id, // adjust if your backend expects 'username' or something else
        amount: bidValue,
      });

      // Re-fetch bids to update the list
      const res = await axios.get(`http://localhost:8080/api/catalog/${id}/bids`);
      setBids(res.data);
      setNewBid('');
    } catch (err) {
      console.error('Bid error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Failed to place bid. Please try again.');
      }
    }
  };

  if (!product) {
    return <Typography>Loading product...</Typography>;
  }

  // Build the image URL
  const imageSrc = product.imageUrl
    ? `http://localhost:8080${product.imageUrl}`
    : PLACEHOLDER_IMAGE;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Left column: product image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={imageSrc}
              alt={product.name}
              style={{
                width: '400px',       // fixed width
                height: 'auto',
                objectFit: 'cover',   // so it won't distort
                borderRadius: '8px'   // a bit of rounding
              }}
            />
          </Box>
        </Grid>

        {/* Right column: info + bidding */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Base Price: ₹{product.price}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Time Left: {timeLeft} seconds
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Bidding form */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              label="Your Bid"
              type="number"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
            />
            <Button variant="contained" onClick={handlePlaceBid}>
              Place Bid
            </Button>
          </Box>

          {/* Bids list */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Current Bids
          </Typography>
          {bids.length === 0 ? (
            <Typography>No bids yet.</Typography>
          ) : (
            bids.map((bid, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #ccc',
                  py: 1
                }}
              >
                {/* If bid.userId == your userId, show "You" */}
                <Typography>
                  {bid.userId === user?.id ? 'You' : `User #${bid.userId}`}
                </Typography>
                <Typography>₹{bid.amount}</Typography>
              </Box>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ItemDetail;
