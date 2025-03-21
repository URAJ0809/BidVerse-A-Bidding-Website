import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect if not admin
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/catalog');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to="/add-product"
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>
      
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">{product.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminPanel;
