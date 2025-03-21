// src/components/Profile.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Tab, Tabs } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import MyBids from './profile/MyBids';
import WonItems from './profile/WonItems';
import AccountSettings from './profile/AccountSettings';

function Profile() {
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">You must be logged in to view this page.</Typography>
      </Box>
    );
  }

  // Handle tab switching
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Generate an avatar placeholder from username initials
  const avatarLetters = user.username
    ? user.username
        .split(' ')
        .map((name) => name[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Profile Card */}
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '1.5rem' }}>
            {avatarLetters}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            {/* Removed the hard-coded "Active Bids: 2" and "Won Items: 5" */}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs for sub-sections */}
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="My Bids" />
          <Tab label="Won Items" />
          <Tab label="Account Settings" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && <MyBids />}
          {tabIndex === 1 && <WonItems />}
          {tabIndex === 2 && <AccountSettings />}
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
