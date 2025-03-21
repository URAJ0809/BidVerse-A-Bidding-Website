// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 3, mt: 5, width: '100%' }}>
      <Container maxWidth="lg">
        <Typography variant="h6" sx={{ mb: 1 }}>
          BidVerse
        </Typography>
        <Typography variant="body2">123-456-7890</Typography>
        <Typography variant="body2">info@mySite.com</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          500 Terry Francine Street, 6th Floor, San Francisco, CA 94158
        </Typography>
        <Box>
          <Link href="#" sx={{ mr: 2 }}>
            Facebook
          </Link>
          <Link href="#" sx={{ mr: 2 }}>
            Twitter
          </Link>
          <Link href="#">
            Instagram
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
