import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function AdminPanel() {
  const { user, isAdmin } = useAuth(); // Changed to get isAdmin as well
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !isAdmin()) { // Check if user is admin
      navigate('/'); // Redirect if not admin
    } else {
      fetchAdminProducts(); // Renamed function for clarity
    }
  }, [user, isAdmin, navigate]); // Added isAdmin to dependency array

  const fetchAdminProducts = async () => {
    try {
      // Fetch products owned by the current admin user
      const response = await axios.get(`http://localhost:8080/api/admin/products?userId=${user.id}`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
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
                <Typography variant="body2">Price: ₹{product.price}</Typography> {/* Changed $ to ₹ */}
                <Typography variant="body2">Status: {product.status}</Typography> {/* Added status */}
                <Typography variant="body2" sx={{ maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminPanel;
