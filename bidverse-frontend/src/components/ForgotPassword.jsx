// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:8080/api/users/forgot-password', {
        email
      });
      // If success, show success message
      setSuccess(response.data); // e.g. "Reset link sent to X"
    } catch (err) {
      console.error('Error resetting password:', err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Could not send password reset link. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Forgot Password
          </Typography>

          {/* Error or Success Messages */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}

          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your email to receive a reset link.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Send Reset Link
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ForgotPassword;
