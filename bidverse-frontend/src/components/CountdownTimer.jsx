import React, { useState, useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';

const CountdownTimer = ({ endTime, onEnd, status }) => {
  const calculateTimeLeft = useCallback(() => {
    if (!endTime || status === 'PAUSED' || status === 'SOLD' || status === 'UNSOLD') {
      return null;
    }
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return {}; // Auction ended
    }
    return timeLeft;
  }, [endTime, status]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!endTime || status === 'PAUSED' || status === 'SOLD' || status === 'UNSOLD') {
      setTimeLeft(null);
      return;
    }
    
    const newTimeLeft = calculateTimeLeft();
    if (Object.keys(newTimeLeft).length === 0 && timeLeft && Object.keys(timeLeft).length > 0) { // Check if it just ended
        if (onEnd) onEnd();
    }
    setTimeLeft(newTimeLeft);


    const timer = setInterval(() => {
      const currentNewTimeLeft = calculateTimeLeft();
      setTimeLeft(currentNewTimeLeft);
      if (Object.keys(currentNewTimeLeft).length === 0) {
        if (onEnd) onEnd();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd, status, calculateTimeLeft, timeLeft]);

  if (status === 'PAUSED') {
    return <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Auction Paused</Typography>;
  }
  
  if (!timeLeft) { // Covers null or undefined initial state before endTime is valid or if paused
    if (status === 'AVAILABLE' && endTime && new Date(endTime) < new Date()) {
         return <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>Auction Ended</Typography>;
    }
    if (status === 'AVAILABLE' && !endTime) {
         return <Typography variant="body2" color="text.secondary">No end time set</Typography>;
    }
    return null;
  }

  if (Object.keys(timeLeft).length === 0) {
    return <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>Auction Ended</Typography>;
  }

  return (
    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
      Time Left: {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
      {`${String(timeLeft.hours).padStart(2, '0')}h `}
      {`${String(timeLeft.minutes).padStart(2, '0')}m `}
      {`${String(timeLeft.seconds).padStart(2, '0')}s`}
    </Typography>
  );
};

export default CountdownTimer;