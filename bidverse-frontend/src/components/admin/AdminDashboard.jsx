// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !isAdmin()) return;
    fetchMyProducts();
  }, [user, isAdmin]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/products?userId=${user.id}`);
      // Filter out sold items
      const availableProducts = res.data.filter(product => product.status === 'AVAILABLE');
      setProducts(availableProducts);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Button
        variant="contained"
        component={RouterLink}
        to="/add-product"
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      {/* Manage Bids button */}
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to="/admin/manage-bids"
        sx={{ mb: 2, ml: 2 }}
      >
        Manage Bids
      </Button>

      <Grid container spacing={2}>
        {products.map((prod) => (
          <Grid item xs={12} sm={6} md={4} key={prod.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{prod.name}</Typography>
                <Typography variant="body2">Price: ₹{prod.price}</Typography>
                <Typography variant="body2">Status: {prod.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
