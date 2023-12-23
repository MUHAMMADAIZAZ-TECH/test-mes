import React from 'react';
import { Paper, Typography } from '@mui/material';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import { ConnectionScreen } from '../../utils/constants';

const InternetConnectionLostScreen = () => {
  return (
    <Paper sx={styles.root}>
      <SignalWifiOffIcon sx={styles.icon} />
      <Typography variant="h5" sx={styles.message}>
        {ConnectionScreen.title}
      </Typography>
      <Typography variant="body1" sx={styles.message}>
        {ConnectionScreen.description}
      </Typography>
    </Paper>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  icon: {
    fontSize: 100,
    color: (theme) => theme.palette.error.main,
  },
  message: {
    marginTop: 2,
    textAlign: 'center',
  },
};

export default InternetConnectionLostScreen;
