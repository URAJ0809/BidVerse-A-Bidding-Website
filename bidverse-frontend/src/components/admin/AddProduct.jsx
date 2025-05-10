// src/components/admin/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Make sure this is imported
import { TextField, Button, Box, Typography, Input } from '@mui/material';


function AddProduct() {
  const { user } = useAuth(); // Get user from AuthContext
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [endTime, setEndTime] = useState(''); // New state for endTime

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user || !user.id) {
        setError("Admin user ID is not available. Please log in.");
        return;
    }

    // Add time validation
    if (endTime) {
      const endDateTime = new Date(endTime);
      const currentTime = new Date();
      const hourDifference = (endDateTime - currentTime) / (1000 * 60 * 60);
      
      if (hourDifference < 1) {
        setError("Auction end time must be at least 1 hour from now");
        return;
      }
    }

    const adminUserId = user.id;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      if (file) {
        formData.append('image', file);
      }
      if (endTime) {
        const endDate = new Date(endTime);
        if (endDate > new Date()) { // Ensure end time is in the future
            formData.append('endTime', endDate.toISOString());
        } else {
            setError("Auction end time must be in the future.");
            return;
        }
      }

      await axios.post(`http://localhost:8080/api/admin/products?userId=${adminUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Product added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setFile(null);
      setEndTime(''); // Clear endTime field
      e.target.reset(); // Reset the form, including the file input
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to add product.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h5" gutterBottom>Add New Product</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Starting Price (₹)"
          type="number"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          inputProps={{ min: "0.01", step: "0.01" }}
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField // New field for End Time
          label="Auction End Time (Optional)"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Product Image (Optional)</Typography>
        <Input
          type="file"
          onChange={handleFileChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Add Product
        </Button>
      </form>
    </Box>
  );
}

export default AddProduct;
