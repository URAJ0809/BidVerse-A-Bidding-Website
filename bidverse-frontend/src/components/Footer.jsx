// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e293b',
  color: '#f8fafc',
  padding: theme.spacing(8, 0),
  marginTop: 'auto',
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #60a5fa 30%, #3b82f6 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#94a3b8',
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#60a5fa',
  },
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: '#94a3b8',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: '#60a5fa',
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#94a3b8',
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    color: '#60a5fa',
  },
}));

const Copyright = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: '#64748b',
  padding: theme.spacing(2, 0),
  borderTop: '1px solid #334155',
  marginTop: theme.spacing(4),
}));

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <FooterSection>
              <FooterTitle>BidVerse</FooterTitle>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Your premier destination for online auctions. Discover unique items and join our vibrant community of collectors and enthusiasts.
              </Typography>
            </FooterSection>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                Quick Links
              </Typography>
              <FooterLink href="/catalog">Browse Auctions</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </FooterSection>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                Contact Us
              </Typography>
              <ContactInfo>
                <PhoneIcon />
                <Typography variant="body2">123-456-7890</Typography>
              </ContactInfo>
              <ContactInfo>
                <EmailIcon />
                <Typography variant="body2">info@bidverse.com</Typography>
              </ContactInfo>
              <ContactInfo>
                <LocationOnIcon />
                <Typography variant="body2">
                  KL UNIVERSITY
                </Typography>
              </ContactInfo>
            </FooterSection>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3}>
            <FooterSection>
              <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                Follow Us
              </Typography>
              <Box>
                <SocialIcon aria-label="Facebook">
                  <FacebookIcon />
                </SocialIcon>
                <SocialIcon aria-label="Twitter">
                  <TwitterIcon />
                </SocialIcon>
                <SocialIcon aria-label="Instagram">
                  <InstagramIcon />
                </SocialIcon>
                <SocialIcon aria-label="LinkedIn">
                  <LinkedInIcon />
                </SocialIcon>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Copyright variant="body2">
          © {new Date().getFullYear()} BidVerse. All rights reserved.
        </Copyright>
      </Container>
    </FooterContainer>
  );
}

export default Footer;
