import React from 'react';
import { Paper, Typography } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { PageNotFound } from '../../utils/constants';

const NotFoundScreen = () => {
  return (
    <Paper sx={styles.root}>
      <SentimentDissatisfiedIcon sx={styles.icon} />
      <Typography variant="h5" sx={styles.message}>
        {PageNotFound.title}
      </Typography>
      <Typography variant="body1" sx={styles.message}>
        {PageNotFound.description}
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

export default NotFoundScreen;
