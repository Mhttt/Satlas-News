import Button from '@mui/material/Button';
import DotMenu from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import React, {
  MouseEvent,
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import Typography from '@mui/material/Typography';
import { NewsCardProps } from './types';
import { styles } from './styles';
import {
  Container,
  Menu,
  MenuItem,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { SnackbarContext } from '../Snackbar/SnackbarContextProvider';
import DynamicIcon from '../DynamicIcon/DynamicIcon';
import deleteArticle from '../../helpers/deleteArticle';
import { useAuth0 } from '../Authentication/AzureAuth0Provider';
import Confirm from '../Confirm/Confirm';

function parseDate(d: Date): string {
  return (
    ('0' + d.getDate()).slice(-2) +
    '-' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '-' +
    d.getFullYear() +
    ' ' +
    ('0' + d.getHours()).slice(-2) +
    ':' +
    ('0' + d.getMinutes()).slice(-2)
  );
}

const NewsCard: FC<NewsCardProps> = ({
  title,
  description,
  timeLocation,
  tags,
  large,
  icon,
  coords,
  zoomLevel,
  articleURL,
  image,
  id,
  onDelete,
}) => {
  const [mapImage, setMapImage] = useState({ isLoading: true, url: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(-1);
  const imageContainer = useRef({} as HTMLDivElement);
  const { user } = useAuth0();

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  useEffect(() => {
    const zoom = zoomLevel !== undefined ? zoomLevel : 10;
    if (imageContainer.current !== null) {
      const imageSize = {
        width: imageContainer.current.offsetWidth,
        height: imageContainer.current.offsetHeight,
      };
      let url = image;
      if (coords !== undefined) {
        url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coords.lng},${coords.lat},${zoom},0/${imageSize.width}x${imageSize.height}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      }
      setMapImage({ isLoading: false, url });
    }
  }, []);

  const theme = useTheme();

  const inlineStyles = {
    outer: {
      display: 'flex',
      position: 'relative',
      boxShadow: 3,
      borderRadius: 1,
      flexDirection: large ? 'column' : 'row',
      overflow: 'hidden',
      height: large ? '100%' : '200px',
      margin: '10px auto',
    },
    bottomContainerLarge: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        flexWrap: 'nowrap',
        mt: 'auto',
      },
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexWrap: 'wrap',
        mt: 'auto',
      },
    },
    bottomContainerSmall: {
      display: 'flex',
      justifyContent: large ? 'flex-end' : 'space-around',
      mt: 'auto',
    },
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <Container sx={inlineStyles.outer} maxWidth="md" disableGutters>
        {user !== undefined && (
          <>
            <DotMenu sx={styles.dotMenu} onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={async () => {
                  setAnchorEl(null);
                  setSelectedArticle(id);
                  setDeleteConfirmOpen(true);
                }}
              >
                Delete
              </MenuItem>
              <MenuItem sx={styles.menuitem}>
                <Link href={`/newsfeed/update?article=${articleURL}`}>
                  Update
                </Link>
              </MenuItem>
            </Menu>
          </>
        )}
        <Box sx={styles.map}>
          <div
            ref={imageContainer}
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            {mapImage.isLoading ? (
              <h3>Image loading...</h3>
            ) : (
              <img src={mapImage.url} alt="map" />
            )}
          </div>
        </Box>
        <Box sx={styles.elementsContainer}>
          <Box sx={styles.topElements}>
            <Box sx={styles.fireAndTitle}>
              <DynamicIcon name={icon} />
              <Box sx={styles.titleContainer}>
                <Typography variant="h2" className={'title'}>
                  {title}
                </Typography>
                <Typography className={'location'}>
                  {parseDate(new Date(timeLocation))}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography sx={styles.description}>{description}</Typography>
          <Box
            sx={
              large
                ? inlineStyles.bottomContainerLarge
                : inlineStyles.bottomContainerSmall
            }
          >
            <Stack direction="row" spacing={1} sx={styles.tags}>
              {tags.map((tag, index) => (
                <Chip key={index} label={tag.name}></Chip>
              ))}
            </Stack>
            <Link href={`/newsfeed/post/article/?article=${articleURL}`}>
              <Button
                variant="outlined"
                sx={large ? styles.button1Large : styles.button1Small}
              >
                Read more
              </Button>
            </Link>
            {!large && (
              <Button variant="contained" sx={styles.button2Small}>
                Show on map
              </Button>
            )}
          </Box>
        </Box>
      </Container>
      <Confirm
        title={'Confirm Article Deletion'}
        description={
          'Please confirm that you wish to delete this article. This action is not reversible.'
        }
        confirm={'Delete'}
        cancel={'Cancel'}
        open={deleteConfirmOpen}
        onConfirm={(obj) => {
          deleteArticle(id, openSnackbar, handleClose, onDelete);
        }}
        onCancel={() => {
          handleClose();
        }}
        object={selectedArticle}
        confirmStyle={{
          backgroundColor: 'error.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark',
          },
        }}
        cancelStyle={{
          border: '1px solid',
          color: 'secondary.main',
          borderColor: 'secondary.main',
        }}
      />
    </>
  );
};

export default NewsCard;
