import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import Logo from '../../assets/checklist-logo.png';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <React.Fragment>
      <div className='header'>
        <Box
          // sx={{
          //   width: '7%',
          //   marginRight: '25px'
          // }}
          className='logo-app'
        >
          <img src={Logo} alt='my-checklist-logo' width='100%' />
        </Box>
        <Typography variant="poster">My Checklist App</Typography>
      </div>
    </React.Fragment>
  );
}
