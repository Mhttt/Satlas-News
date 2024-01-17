import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { StatisticProps } from './types';
import DashboardCard from '../DashboardCard/DashboardCard';

const Statistic: FC<StatisticProps> = ({
  title,
  description,
  number,
  numberDescription,
}) => {

  return (
    <DashboardCard
        title={title}
        description={description}
        children={
            <Box textAlign='center'>
                <Typography variant='h1' color={number > 0 ? 'success.main' : 'error.main'}>
                  {`${number > 0 ? '+' : ''}${number}`}
                </Typography>
          
                <Typography variant='caption'>
                  {numberDescription}
                </Typography>
            </Box>
        }
    ></DashboardCard>
  );
};

export default Statistic;
