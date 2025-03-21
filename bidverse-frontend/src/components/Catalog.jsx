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
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

function Catalog() {
  const [items, setItems] = useState([]);

  // Fetch the product list
  useEffect(() => {
    axios.get('http://localhost:8080/api/catalog')
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error('Error fetching catalog:', error);
      });
  }, []);

  // Show only 7 items
  const limitedItems = items.slice(0, 7);

  return (
    <Box sx={{ width: '100%', py: 5, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Our Catalog
      </Typography>

      <Grid container spacing={3}>
        {/* Render 7 items */}
        {limitedItems.map((item) => {
          const imageSrc = item.imageUrl
            ? `http://localhost:8080${item.imageUrl}`
            : PLACEHOLDER_IMAGE;

          return (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  alt={item.name}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                  }}
                  image={imageSrc}
                />
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">₹{item.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    component={RouterLink}
                    to={`/catalog/${item.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}

        {/* 8th slot: Circle + right arrow, leading to /catalog-full */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RouterLink
            to="/catalog-full"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Circle with arrow */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                cursor: 'pointer',
              }}
            >
              <KeyboardArrowRightIcon sx={{ fontSize: '2rem', color: '#000' }} />
            </Box>
            {/* "More" text */}
            <Typography variant="h6" sx={{ color: '#000' }}>
              More
            </Typography>
          </RouterLink>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Catalog;
