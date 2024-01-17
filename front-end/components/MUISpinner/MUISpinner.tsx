import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

const MUISpinner: FC = () => {
  const boxStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Box sx={boxStyle}>
      <CircularProgress />
    </Box>
  );
};
export default MUISpinner;
