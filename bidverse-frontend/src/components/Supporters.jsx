import React from 'react';
import { Box, Typography } from '@mui/material';

const SUPPORTER_LOGOS = [
  { src: 'src/assets/logo1.png', alt: 'Generator' },
  { src: 'src/assets/logo2.png', alt: 'GLMP.IT' },
  { src: 'src/assets/logo3.png', alt: 'gaze it' },
  { src: 'src/assets/logo4.png', alt: 'mtvs.news' },
];

function Supporters() {
  return (
    <Box sx={{ width: '100%', py: 5, px: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Our Supporters
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6, // Increased spacing
          mt: 3,
          flexWrap: 'wrap', // Allows wrapping on smaller screens
        }}
      >
        {SUPPORTER_LOGOS.map((logo, index) => (
          <React.Fragment key={index}>
            {/* Logo */}
            <Box
              component="img"
              src={logo.src}
              alt={logo.alt}
              sx={{
                width: 150,  // Increased width
                height: 'auto',
                objectFit: 'contain',
              }}
            />
            {/* Vertical line, except after the last logo */}
            {index < SUPPORTER_LOGOS.length - 1 && (
              <Box
                sx={{
                  width: '2px',
                  height: 60, // Increased height
                  backgroundColor: '#000',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

export default Supporters;
