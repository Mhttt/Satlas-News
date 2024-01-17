import React, { ReactNode, useContext } from 'react';
import DeckGL from '@deck.gl/react';
import {
  StaticMap,
  ViewportProps,
  _MapContext as MapContextMapGL,
} from 'react-map-gl';
import { Box } from '@mui/system';
import ZoomControls from './ZoomControls';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContext } from './MapContextProvider';
import { FC } from 'react';
import IconLegend from './IconLegend';
import { useTheme } from '@mui/material';

interface Props extends Partial<any> {
  view: ViewportProps;
  children?: ReactNode;
  setViewport: (v: ViewportProps) => void;
  mapStyle: string;
  icons?: { [key: string]: string };
  zoomInCoords?: { latitude: number; longitude: number };
  zoomInLevel?: number;
  onClick?: (e: any) => void;
  isSmallMap?: boolean;
  cursor?: (e: {isDragging: boolean, isHovering: boolean}) => string;
}

type ResizeObj = {
  width: number;
  height: number;
};

const Map: FC<Props> = ({
  view,
  children,
  setViewport,
  mapStyle,
  icons,
  zoomInCoords,
  zoomInLevel,
  onClick,
  isSmallMap,
  cursor,
  ...otherProps
}) => {
  const {
    actions: { setMapHeight, setMapWidth },
  } = useContext(MapContext);

  const handleResize = (resizeObj: ResizeObj) => {
    setMapWidth(resizeObj.width);
    setMapHeight(resizeObj.height);
  };

  const getCursor = (e: any) => {
    if (cursor) {
      return cursor(e);
    }

    if (e.isHovering && !e.isDragging) {
      return 'pointer';
    }

    return e.isDragging ? 'grabbing' : 'grab'
  }

  const theme = useTheme();

  const styling = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
    },

    zoomControlsContainerLarge: {
      [theme.breakpoints.down('sm')]: {
        position: 'absolute', 
        top: 220, 
        left: 16,
      },
      [theme.breakpoints.up('sm')]: {
        position: 'absolute', 
        top: 95, 
        left: 23,
      }
    },

    zoomControlsContainerSmall: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: 10,
    },

    IconLegendContainer: {
      [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        bottom: 35,
        left: 23,
        bgcolor: 'background.paper',
        padding: '6px',
      },
      [theme.breakpoints.down('sm')]: {
        position: 'absolute',
        bottom: 35,
        left: 16,
        bgcolor: 'background.paper',
        padding: '6px',
      },
    },
  };

  return (
    <Box sx={styling.container}>
      <DeckGL
        onClick={onClick}
        ContextProvider={MapContextMapGL.Provider}
        initialViewState={view}
        controller={true}
        //onViewStateChange={(arg: ViewportProps) => setViewport(arg.viewState)}
        onResize={(obj: ResizeObj) => {
          handleResize(obj);
        }}
        height="100%"
        width="100%"
        getCursor={getCursor}
        {...otherProps}
      >
        <Box
          sx={
            isSmallMap
              ? styling.zoomControlsContainerSmall
              : styling.zoomControlsContainerLarge
          }
        >
          <ZoomControls zoomInLevel={zoomInLevel} zoomInCoords={zoomInCoords} />
        </Box>
        {icons !== undefined && (
          <Box sx={styling.IconLegendContainer}>
            <IconLegend icons={icons} />
          </Box>
        )}
        <StaticMap
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapStyle={mapStyle}
        />
        {children}
      </DeckGL>
    </Box>
  );
};

export default Map;
