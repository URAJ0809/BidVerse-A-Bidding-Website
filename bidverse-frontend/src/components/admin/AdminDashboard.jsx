// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material'; // Added CardActions
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
      // Display all products by the admin
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    }
  };

  const handleRelist = async (productId) => {
    if (!user || !isAdmin()) {
      console.error("User is not an admin or not logged in.");
      return;
    }
    try {
      // For a simple relist, we might send an empty object or specific fields if needed by backend.
      // The backend AdminController's relistProduct expects Product newData in RequestBody.
      // If no specific changes to product details (like endTime) are needed on relist,
      // an empty object or an object with a new endTime could be sent.
      // For now, let's assume we might want to reset/update endTime.
      // If your backend handles an empty body gracefully or defaults endTime, adjust as needed.
      const newEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Example: relist for 7 days

      await axios.put(`http://localhost:8080/api/admin/products/${productId}/relist?userId=${user.id}`, {
        endTime: newEndTime.toISOString(), // Sending endTime as an example
      });
      // Refresh products list
      fetchMyProducts();
      alert('Product relisted successfully!');
    } catch (err) {
      console.error('Error relisting product:', err);
      alert(`Failed to relist product: ${err.response?.data?.message || err.message}`);
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
              {(prod.status === 'SOLD' || prod.status === 'UNSOLD') && (
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleRelist(prod.id)}
                  >
                    Relist Item
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
