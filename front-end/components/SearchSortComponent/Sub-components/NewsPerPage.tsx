import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import React from 'react';
import { FC } from 'react';
import { NewsPerPageContainer } from '../style';
import { NewsPerPageProps } from '../types';

const styles = {
  dropDownMenu: {
    width: '100%',
    boxSizing: 'border-box',
  },
};

const NewsPerPageComp: FC<NewsPerPageProps> = ({
  updateAmount,
}) => {

  const theme = useTheme();

  return (
    <NewsPerPageContainer theme={theme}>
      <Paper elevation={1}>
        <FormControl variant="filled" sx={styles.dropDownMenu}>
          <InputLabel id="amountbar">News per page</InputLabel>
          <Select
            defaultValue={'10'}
            onChange={(e: SelectChangeEvent) => {
              const amount: number = +e.target.value;
              if(updateAmount) {
                updateAmount(amount);
              }
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </NewsPerPageContainer>
  );
};

export default NewsPerPageComp;
