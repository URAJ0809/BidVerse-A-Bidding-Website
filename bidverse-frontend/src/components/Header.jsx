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
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { user, logout } = useAuth();

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
    <AppBar position="static" sx={{ backgroundColor: '#000', width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          BidVerse
        </Typography>

        <div>
          {/* Cart Icon */}
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/cart"
            sx={{ mr: 1 }}
          >
            <ShoppingCartIcon />
          </IconButton>

          {/* Three-dot menu */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {!user && [
            <MenuItem key="login" onClick={handleMenuClose}>
              <RouterLink
                to="/login"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Login
              </RouterLink>
            </MenuItem>,
            <MenuItem key="register" onClick={handleMenuClose}>
              <RouterLink
                to="/register"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Register
              </RouterLink>
            </MenuItem>,
          ]}

          {user && [
            <MenuItem key="profile" onClick={handleMenuClose}>
              <RouterLink
                to="/profile"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Hello, {user.username}
              </RouterLink>
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              Logout
            </MenuItem>,
          ]}
        </Menu>

      </Toolbar>
    </AppBar>
  );
}

export default Header;
