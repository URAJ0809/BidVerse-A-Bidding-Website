// src/components/ContactForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // If you have a backend, replace with your endpoint:
    axios.post('http://localhost:8080/api/contact', formData)
      .then((response) => {
        console.log('Message sent:', response.data);
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
    console.log('Message sent:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Box sx={{ width: '100%', py: 5, px: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Get in Touch
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Have a question or feedback for us? Feel free to reach out.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 600,
          mx: 'auto',        // centers the form horizontally
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ContactForm;
