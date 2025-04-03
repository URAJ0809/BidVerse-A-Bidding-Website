import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        username,
        password,
      });
      const userData = response.data;

      if (userData) {
        // Check if the user is an admin
        if (userData.role === 'admin') {
          login(userData);
          navigate('/admin');
        } else {
          setError('Access denied. This login is for administrators only.');
        }
      } else {
        setError('Invalid credentials or user not found.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#4f46e5', mr: 2 }} />
            <Typography variant="h4">Admin Login</Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
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
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                mt: 2, 
                backgroundColor: '#4f46e5',
                '&:hover': {
                  backgroundColor: '#4338ca',
                }
              }}
            >
              Admin Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AdminLogin; 