// src/components/Catalog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Container,
  Skeleton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.025em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const ItemName = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: '#1e293b',
}));

const ItemPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2563eb',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '0.5rem',
  textTransform: 'none',
  fontWeight: 600,
  padding: '0.5rem 1rem',
  margin: theme.spacing(0, 2, 2, 2),
}));

const ViewMoreCard = styled(motion(Box))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  borderRadius: '1rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  cursor: 'pointer',
  border: '2px dashed #cbd5e1',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#2563eb',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  },
}));

const ViewMoreIcon = styled(KeyboardArrowRightIcon)(({ theme }) => ({
  fontSize: '2.5rem',
  color: '#2563eb',
  marginBottom: theme.spacing(2),
}));

const ViewMoreText = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#2563eb',
}));

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/catalog')
      .then((response) => {
        // Filter out sold items
        const availableItems = response.data.filter(item => item.status === 'AVAILABLE');
        setItems(availableItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching catalog:', error);
        setLoading(false);
      });
  }, []);

  const limitedItems = items.slice(0, 7);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ width: '100%', py: 8, backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <SectionTitle>
          Featured Auctions
        </SectionTitle>

        <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          {loading ? (
            // Loading skeletons
            [...Array(7)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" sx={{ fontSize: '1.125rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
              </Grid>
            ))
          ) : (
            limitedItems.map((item) => {
              const imageSrc = item.imageUrl
                ? `http://localhost:8080${item.imageUrl}`
                : PLACEHOLDER_IMAGE;

              return (
                <Grid item xs={12} sm={6} md={3} key={item.id} variants={itemVariants}>
                  <StyledCard>
                    <StyledCardMedia
                      component="img"
                      alt={item.name}
                      image={imageSrc}
                    />
                    <StyledCardContent>
                      <ItemName>{item.name}</ItemName>
                      <ItemPrice>₹{item.price}</ItemPrice>
                    </StyledCardContent>
                    <CardActions>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/catalog/${item.id}`}
                        fullWidth
                      >
                        View Details
                      </StyledButton>
                    </CardActions>
                  </StyledCard>
                </Grid>
              );
            })
          )}

          {/* View More Card */}
          <Grid item xs={12} sm={6} md={3} variants={itemVariants}>
            <RouterLink to="/catalog-full" style={{ textDecoration: 'none' }}>
              <ViewMoreCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ViewMoreIcon />
                <ViewMoreText>View All Items</ViewMoreText>
              </ViewMoreCard>
            </RouterLink>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Catalog;
