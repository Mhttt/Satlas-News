import React, { FC} from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { DashboardCardProps } from './types';

const styles = {
  cardHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #DBE4E9',
    padding: '2px 12px',
    position: 'sticky',
    display: 'flex',
    top: 0,
    zIndex: 1,
  },
  cardWrapper: {
    flexGrow: 1,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.16)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DBE4E9',
    borderRadius: 4,
    height: '100%',
    position: 'relative',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(11, 69, 102, .5)',
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontWeight: 600,
  },
  description: {
    color: '#86A2B3'
  }
};

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  description,
  disabled,
  children,
  style,
  isLoading,
  actions,
}) => {

  return (
    //<Suspense fallback={<CircularProgress />}>
      <Box
        sx={Object.assign(styles.cardWrapper, {
          transition: 'all .5s ease',
          overflow: !disabled ? 'auto' : 'hidden',
        }, style)}
        data-cy="dashboard-card"
      >
        {disabled && <Box sx={styles.overlay} />}
        <Box
          sx={styles.cardHeader}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box mr={2}>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={styles.title}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={styles.description}>
              {description}
            </Typography>
          </Box>
          <Box ml={2} display="flex" alignItems="center">
            {actions}
          </Box>
        </Box>
        {isLoading ? (
          <Box height="80%">
            <CircularProgress />
          </Box>
        ) : (
          <Box p={1}>{children}</Box>
        )}
      </Box>
    //</Suspense>
  );
};

export default DashboardCard;
