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
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Helper function to calculate remaining time
  const calculateTimeLeft = (endTime) => {
    const difference = +new Date(endTime) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  };

  // Fetch product and bids
  useEffect(() => {
    axios.get(`http://localhost:8080/api/catalog/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.endTime) {
          const timeRemaining = calculateTimeLeft(res.data.endTime);
          setTimeLeft(timeRemaining);
          setAuctionEnded(timeRemaining.total <= 0);
        } else {
          setAuctionEnded(true);
        }
      })
      .catch((err) => console.error('Fetch product error:', err));

    axios.get(`http://localhost:8080/api/catalog/${id}/bids`)
      .then((res) => setBids(res.data))
      .catch((err) => console.error('Fetch bids error:', err));
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!product?.endTime || auctionEnded) return;

    const timer = setInterval(() => {
      const timeRemaining = calculateTimeLeft(product.endTime);
      setTimeLeft(timeRemaining);

      if (timeRemaining.total <= 0) {
        setAuctionEnded(true);
        clearInterval(timer);
        
        // Handle auction end
        if (bids.length > 0) {
          const highest = bids.reduce((acc, b) => b.amount > acc.amount ? b : acc, bids[0]);
          if (highest.userId === user?.id) {
            alert(`Congratulations! You won the auction for ${product.name} at ₹${highest.amount}!`);
          } else {
            alert(`Auction ended! The winning bid was ₹${highest.amount} by user #${highest.userId}`);
          }
        } else {
          alert(`Auction ended with no bids for ${product.name}.`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product, auctionEnded, bids, user]);

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

  const imageSrc = product.imageUrl
    ? `http://localhost:8080${product.imageUrl}`
    : PLACEHOLDER_IMAGE;

  // Format time left for display
  const formatTimeLeft = () => {
    if (!timeLeft && product.status === 'AVAILABLE') return 'No end time set';
    if (timeLeft?.total <= 0 || product.status !== 'AVAILABLE') return 'Auction has ended';

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
    parts.push(`${timeLeft.seconds}s`);
    
    return parts.join(' ');
  };

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
                width: '400px',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px'
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
          
          {/* Status and Timer display */}
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Status: {product.status}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              color: timeLeft?.total <= 300000 ? 'error.main' : 'text.primary',
              fontWeight: timeLeft?.total <= 300000 ? 'bold' : 'normal'
            }}
          >
            {product.status === 'AVAILABLE' ? formatTimeLeft() : 'Auction has ended'}
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Bidding form - only show if auction is active */}
          {product.status === 'AVAILABLE' && !auctionEnded && timeLeft?.total > 0 && (
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
          )}

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
                <Box>
                  <Typography>
                    {bid.userId === user?.id ? 'You' : `User #${bid.userId}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {bid.timestamp ? 
                      new Date(bid.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      }) 
                      : 'Time not available'}
                  </Typography>
                </Box>
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
