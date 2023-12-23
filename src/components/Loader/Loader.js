import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const loaderContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

export default function Loader() {
  return (
    <Box sx={loaderContainerStyle}>
      <CircularProgress />
    </Box>
  );
}
