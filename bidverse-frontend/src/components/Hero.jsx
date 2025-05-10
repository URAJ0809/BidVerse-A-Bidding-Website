// src/components/Hero.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
    zIndex: 0,
  },
}));

const HeroImage = styled(motion.img)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  borderRadius: '1rem',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  marginBottom: theme.spacing(4),
  objectFit: 'cover',
  zIndex: 1,
}));

const Title = styled(motion(Typography))(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.025em',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const Subtitle = styled(motion(Typography))(({ theme }) => ({
  fontSize: '1.5rem',
  textAlign: 'center',
  color: '#64748b',
  marginBottom: theme.spacing(4),
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const Description = styled(motion(Typography))(({ theme }) => ({
  fontSize: '1.125rem',
  textAlign: 'center',
  color: '#475569',
  maxWidth: '600px',
  marginBottom: theme.spacing(4),
  lineHeight: 1.7,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const StyledButton = styled(motion(Button))(({ theme }) => ({
  padding: '1rem 2rem',
  fontSize: '1.125rem',
  borderRadius: '0.75rem',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  zIndex: 1,
}));

function Hero() {
  return (
    <HeroContainer>
      <Container maxWidth="lg">
        <HeroImage
          src="/src/assets/bidding_1920.jpg"
          alt="BidVerse Hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />

        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to BidVerse
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your Premier Destination for Online Auctions
        </Subtitle>

        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover a world of unique items and exciting bidding opportunities.
          Join our vibrant community of collectors, enthusiasts, and savvy buyers.
          Start your bidding journey today!
        </Description>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <StyledButton
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/catalog-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Auctions
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/ContactForm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </StyledButton>
        </Box>
      </Container>
    </HeroContainer>
  );
}

export default Hero;
