// src/components/Register.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, Card, CardContent } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null); // <-- For on-page errors

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        email,
        username,
        password,
      });

      const userData = response.data;
      if (userData) {
        login(userData);
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data); 
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
