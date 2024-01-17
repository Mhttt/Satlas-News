import {
  Button,
  colors,
  IconButton,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import React, { FC } from 'react';
import BarLegend from '../BarLegend/BarLegend';
import { PopUpProps } from './types';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

const PopUp: FC<PopUpProps> = ({
  title,
  image,
  article,
  onClose,
  url,
  coords,
}) => {
  const theme = useTheme();

  const SmallScreen = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {},
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }));
  const LargeScreen = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {},
  }));

  const styles = {
    container: {
      backgroundColor: 'paper.background',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      boxSizing: 'border-box',
      justifyContent: 'space-between',
      width: '30vw',
      borderRadius: '5px',
      border: '3px solid',
      borderColor: 'secondary.main',
    },
    imageContainer: {
      display: 'block',
      width: '20%',
      height: '150px',
      position: 'relative',
      boxSizing: 'border-box',
      img: {
        objectFit: 'cover',
        borderRadius: '2px',
        width: '100%',
        height: '100%',
        objectPosition: 'center',
      },
    },
    contentContainer: {
      width: '80%',
      boxSizing: 'border-box',
      paddingLeft: '10px',
    },
    headerDiv: {
      width: '89%',
      boxSizing: 'border-box',
    },
    closeButton: {
      padding: '0px',
      display: 'block',
      fontWeight: 'bold',
      minWidth: 'auto',
      boxSizing: 'border-box',
      width: '25px',
      height: '25px',
      position: 'fixed',
      borderRadius: '50%',
      top: 0,
      right: 0,
      mr: 2,
      mt: 2,
      color: 'primary.main',
      '&:hover': {
        color: 'primary.dark',
        cursor: 'pointer'
      }
    },
    header: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    colorBar: {
      ml: 3,
      mr: 3,
    },
  };

  const imageToUse =
    coords?.lat && coords?.lng && !image
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coords.lng},${coords.lat},12,0/200x200?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      : image;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.imageContainer}>
        <img src={imageToUse} alt="The image of the post" />
      </Box>

      <Box sx={styles.contentContainer}>
        <Box sx={styles.headerContainer}>
          <SmallScreen sx={styles.headerDiv}>
            <Typography variant={'h4'} sx={styles.header}>
              {title}
            </Typography>
            <Typography variant={'body1'}>{article}</Typography>
          </SmallScreen>
          <LargeScreen sx={styles.headerDiv}>
            <Typography variant={'h2'} sx={styles.header}>
              {title}
            </Typography>
            <Typography variant={'body1'}>{article}</Typography>
          </LargeScreen>

          <CloseIcon sx={styles.closeButton} onClick={onClose} />
        </Box>

        <Box marginTop={2} textAlign="center">
          <SmallScreen>
            <Link href={`/newsfeed/post/article/?article=${url}`}>
              <Button variant={'outlined'} color={'secondary'} size="small">
                Read more
              </Button>
            </Link>
          </SmallScreen>
          <LargeScreen>
            <Link href={`/newsfeed/post/article/?article=${url}`}>
              <Button variant={'outlined'} color={'secondary'} size="medium">
                Read more
              </Button>
            </Link>
          </LargeScreen>
        </Box>
      </Box>
    </Box>
  );
};

export default PopUp;
