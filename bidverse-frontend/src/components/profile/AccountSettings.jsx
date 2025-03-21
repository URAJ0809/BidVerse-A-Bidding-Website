// src/components/profile/AccountSettings.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function AccountSettings() {
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = () => {
    // Real usage: POST /api/update-profile with newPassword, address, etc.
    alert('Account settings updated (demo).');
    setNewPassword('');
    setAddress('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Update Password</Typography>
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Typography variant="h6">Shipping Address</Typography>
      <TextField
        label="Address"
        multiline
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button variant="contained" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}

export default AccountSettings;
