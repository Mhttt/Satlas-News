import React, { useContext, useLayoutEffect} from 'react';
import {
  Public as PublicIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { IconButton, Grid, Tooltip } from '@mui/material';
import { MapContext } from './MapContextProvider';
import { FlyToInterpolator, ViewportProps } from 'react-map-gl';
import { easeCubicInOut } from 'd3-ease';

interface ZoomControlsProps {
  zoomInLevel?: number;
  zoomInCoords?: {latitude: number, longitude: number};
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomInLevel, zoomInCoords }) => {
  const {
    state: { isOpticalBasemap, viewport, darkMode },
    actions: { setViewport, setIsOpticalBasemap, setDarkMode },
  } = useContext(MapContext);

  const zoominOnPlace =
    zoomInCoords !== undefined
      ? zoomInCoords
      : { lattitude: viewport.latitude, longitude: viewport.longitude };

  useLayoutEffect(() => {
    setViewport({
      ...viewport,
      ...zoominOnPlace,
      zoom: zoomInLevel !== undefined ? zoomInLevel : 6.5,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 4000,
      transitionEasing: easeCubicInOut,
    });
  }, []);

  const handleViewport = (newViewport: ViewportProps) => {
    setViewport({
      ...viewport,
      ...newViewport,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2000,
      transitionEasing: easeCubicInOut,
    });
  };

  const buttonStyle = {
    backgroundColor: 'background.paper',
    border: '1px solid #ccc',
    padding: '80%',
    width: '22px',
    height: '22px',
    fill: 'primary.main',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: 'background.paper',
    },
    
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <IconButton
          sx={buttonStyle}
          onClick={() => {
            handleViewport({
              ...viewport,
              zoom: viewport.zoom !== undefined ? viewport.zoom + 1 : 1,
            });
          }}
        >
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          sx={buttonStyle}
          onClick={() =>
            handleViewport({
              ...viewport,
              zoom: viewport.zoom !== undefined ? viewport.zoom - 1 : 1,
            })
          }
        >
          <RemoveIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Tooltip placement="right" title="Change basemap">
          <IconButton
            sx={buttonStyle}
            onClick={() => {
              setDarkMode(false);
              setIsOpticalBasemap(!isOpticalBasemap);
            }}
          >
            <PublicIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip
          placement="right"
          title={darkMode ? 'Light mode' : 'Dark mode🤘🏻'}
        >
          <IconButton
            sx={buttonStyle}
            onClick={() => {
              setDarkMode(!darkMode);
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default ZoomControls;
