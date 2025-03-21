// src/components/Hero.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContactForm from './ContactForm';

function Hero() {
  return (
    <Box
      sx={{
        width: '100%',        // Full width
        py: 5,                // Vertical padding
      }}
    >
      {/* Top Image (centered) */}
      <Box
        component="img"
        sx={{
          display: 'block',     // So margin auto centers horizontally
          margin: '0 auto',
          width: 250,           // Set width and height equal for square shape
          height: 300,
          borderRadius: '10%',  // Slight rounded corners, remove for perfect square
          objectFit: 'cover',
          mb: 2,
        }}
        src="src/assets/bidding_1920.jpg"
        alt="BidVerse Hero"
      />


      {/* Main Title (centered) */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2,
        }}
      >
        BidVerse
      </Typography>

      {/* Horizontal line (full width) */}
      <Box
        sx={{
          borderTop: '1px solid #000',
          width: '100%',
          mb: 1,
        }}
      />

      {/* Subtitle (centered) */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: 1,
        }}
      >
        Join Our Bidding Community
      </Typography>

      {/* Another horizontal line (full width) */}
      <Box
        sx={{
          borderTop: '1px solid #000',
          width: '100%',
          mb: 3,
        }}
      />

      {/* Description Text (centered) */}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          mb: 3,
          px: 2, // optional padding if you want some spacing on smaller screens
        }}
      >
        Explore our upcoming auction events and join our vibrant community of bidders.
        With a diverse range of products on offer, there's something for everyone at BidVerse.
      </Typography>

      {/* RSVP Button (centered) */}
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" color="primary" component={RouterLink} to="/ContactForm">
          RSVP
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;
