import React, { FC, CSSProperties } from 'react';
import { CircularProgress, LinearProgress } from '@mui/material';
import { LoaderProps } from './types';
import TopBarStyled from './TopBarBox.styled';
import { Box } from '@mui/system';

const styling = {
  blocking: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    height: '100vh',
    width: '100vw',
    zIndex: 2000,
    backgroundColor: 'primary.main',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topbar: {

  }
} as { [key: string]: CSSProperties };

const Loader: FC<LoaderProps> = ({
  isLoading = false,
  variant = 'blocking',
  style = {},
}) => {
  if (isLoading) {
    if (variant === 'blocking')
      return (
        <Box
          sx={styling.blocking}
        >
          <CircularProgress color="inherit" size={50} thickness={5}/>
        </Box>
      );

    return (
      <TopBarStyled style={{ ...style }}>
        <LinearProgress color="primary" />
      </TopBarStyled>
    );
  }

  return null;
};

export default Loader;