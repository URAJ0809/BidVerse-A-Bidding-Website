// src/components/admin/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // When the user selects a file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Build FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      if (file) {
        formData.append('image', file);
      }

      // POST multipart/form-data
      const response = await axios.post('http://localhost:8080/api/catalog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If successful, show success message and clear fields
      setSuccess('Product added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setFile(null);
    } catch (err) {
      console.error('Add product error:', err);

      if (err.response && err.response.data) {
        // Convert the error response to a string
        if (typeof err.response.data === 'object') {
          // If there's a 'message' field, show that
          if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            // Otherwise, stringify the entire object
            setError(JSON.stringify(err.response.data));
          }
        } else {
          // It's already a string
          setError(err.response.data);
        }
      } else {
        setError('Failed to add product. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Product
          </Typography>

          {/* Display Error if any */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Display Success if any */}
          {success && (
            <Typography color="primary" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}

          {/* The Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />

            {/* File input for local image */}
            <Button variant="outlined" component="label">
              Choose Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {file && <Typography>Selected: {file.name}</Typography>}

            <Button type="submit" variant="contained">
              Add Product
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddProduct;
