"use client";

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/joy';
import { useLoading } from '@/contexts/LoadingContext';

const LoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress
        size="lg"
        sx={{
          '--CircularProgress-size': '60px',
          '--CircularProgress-trackThickness': '4px',
          '--CircularProgress-progressThickness': '4px',
          '--CircularProgress-progressColor': 'var(--CircularProgress-Color)',
        }}
      />
      <Typography
        level="h4"
        sx={{
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {loadingMessage}
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;