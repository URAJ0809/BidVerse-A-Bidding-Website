// src/components/Header.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1e293b',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  borderBottom: '1px solid #e2e8f0',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  maxWidth: '1280px',
  margin: '0 auto',
  width: '100%',
  padding: '0.75rem 1rem',
  [theme.breakpoints.up('md')]: {
    padding: '0.75rem 2rem',
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.025em',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#64748b',
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '0.75rem 1.5rem',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: '#f8fafc',
  },
}));

const AdminButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  backgroundColor: '#4f46e5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#4338ca',
  },
}));

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { user, logout, isAdmin } = useAuth(); // Use isAdmin to check if the user is an admin

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        {/* Left side: Title */}
        <Logo
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', flexGrow: 1 }}
        >
          BidVerse
        </Logo>

        <div>
          {/* Admin Login Button - Only visible if no user is logged in */}
          {!user && (
            <AdminButton
              component={RouterLink}
              to="/admin-login"
              variant="contained"
              startIcon={<AdminPanelSettingsIcon />}
            >
              Admin Login
            </AdminButton>
          )}

          {/* Cart Icon - Visible for all logged-in users */}
          {user && (
            <StyledIconButton
              component={RouterLink}
              to="/cart"
              sx={{ mr: 1 }}
            >
              <ShoppingCartIcon />
            </StyledIconButton>
          )}

          {/* Admin Panel Icon - Only visible for admin users */}
          {user && isAdmin() && (
            <StyledIconButton
              component={RouterLink}
              to="/admin"
              sx={{ mr: 1 }}
            >
              <AdminPanelSettingsIcon />
            </StyledIconButton>
          )}

          {/* Three-dot menu */}
          <StyledIconButton
            edge="end"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </StyledIconButton>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }
          }}
        >
          {!user && [
            <StyledMenuItem key="login" onClick={handleMenuClose}>
              <RouterLink
                to="/login"
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                Login
              </RouterLink>
            </StyledMenuItem>,
            <StyledMenuItem key="register" onClick={handleMenuClose}>
              <RouterLink
                to="/register"
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                Register
              </RouterLink>
            </StyledMenuItem>,
          ]}

          {user && [
            <StyledMenuItem key="profile" onClick={handleMenuClose}>
              <RouterLink
                to="/profile"
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                Hello, {user.username}
              </RouterLink>
            </StyledMenuItem>,
            <StyledMenuItem key="logout" onClick={handleLogout}>
              Logout
            </StyledMenuItem>,
          ]}
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Header;
