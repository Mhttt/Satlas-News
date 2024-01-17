import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)({
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  height: '100vh',
  width: '100vw',
  zIndex: 2000,
  backgroundColor: 'primary.main',
  color: 'white',
});