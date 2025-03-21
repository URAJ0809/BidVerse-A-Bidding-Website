// src/components/CatalogFull.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
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

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

function CatalogFull() {
  const [items, setItems] = useState([]);

  // Fetch all products
  useEffect(() => {
    axios.get('http://localhost:8080/api/catalog')
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error('Error fetching full catalog:', error);
      });
  }, []);

  return (
    <Box sx={{ width: '100%', py: 5, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Grid container spacing={3}>
        {items.map((item) => {
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
      </Grid>
    </Box>
  );
}

export default CatalogFull;
