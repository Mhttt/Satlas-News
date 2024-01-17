import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC, ReactNode } from 'react';
import DynamicIcon, { getIcon } from '../../DynamicIcon/DynamicIcon';
import DropDownProps from '../types';
import { Router, useRouter } from 'next/router';

const DropDown: FC<DropDownProps> = ({
  articles,
  displayAllSearchResults,
  showMoreVisible,
}) => {
  const styling = {
    container: {
      width: '100%',
      backgroundColor: 'background.paper',
      position: 'absolute',
      zIndex: 2,
      padding: '5px 5px 0px 5px',
      boxSizing: 'border-box',
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: '0 0 8px 8px',
      display: 'flex',
      flexDirection: 'column',
    },
    listElement: {
      padding: '5px 0px',
      boxSizing: 'border-box',
      borderBottom: '1px solid #ccc',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: '30px',
      '&:hover': {
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
      },
    },
    categoryIcon: {
      margin: 'auto 8px',
    },
    displayMoreButton: {
      margin: '8px auto',
      width: '50%',
      minWidth: '100px',
      height: '10%',
    },
    noResults: {
      margin: '5px auto',
    },
  };

  const router = useRouter()

  return (
    <Box sx={styling.container}>
      {articles.length !== 0 ? (
        <>
          {articles.map((article, i) => {
            return (
              <Box
                key={article.id}
                sx={
                  !showMoreVisible && i === articles.length - 1
                    ? { ...styling.listElement, borderBottom: 'none' }
                    : styling.listElement
                }
                onClick={() => router.push(`newsfeed/post/article/?article=${article.url}`)}
              >
                <Box sx={styling.categoryIcon}>
                  <DynamicIcon name={article.icon} />
                </Box>
                <Box>
                  <Typography variant="h5"> {article.title}</Typography>
                  <Typography variant="body1">
                    {' '}
                    {new Date(article.timestamp).toLocaleDateString('en-us', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </>
      ) : (
        <Typography sx={styling.noResults}>No results found</Typography>
      )}
      {showMoreVisible && (
        <Button
          sx={styling.displayMoreButton}
          variant="contained"
          onClick={() => displayAllSearchResults(true)}
        >
          Show all results
        </Button>
      )}
    </Box>
  );
};

export default DropDown;
