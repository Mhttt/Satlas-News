import { Box } from '@mui/system';
import React, { FC, useContext } from 'react';
import Map from '../Map/Map';
import { MapContext } from '../Map/MapContextProvider';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

interface TerracottaProps {
  terracottaUrl: string;
  coords: { latitude: number; longitude: number };
}

const Terracotta: FC<TerracottaProps> = ({ terracottaUrl, coords }) => {
  const {
    state: { viewport, isOpticalBasemap, darkMode },
    actions: { setViewport },
  } = useContext(MapContext);

  const basemap =
    darkMode === true
      ? 'mapbox://styles/mapbox/dark-v10'
      : isOpticalBasemap
      ? 'mapbox://styles/mapbox/satellite-v9'
      : 'mapbox://styles/mapbox/light-v10';

  const layer = new TileLayer({
    data: terracottaUrl,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  const styling = {
    container: {
      position: 'relative',
      width: '80vw',
      height: '30vh',
      boxSizing: 'border-box',
      margin: '2vh auto',
    },
  };

  return (
    <Box sx={styling.container}>
      <Map
        view={viewport}
        setViewport={setViewport}
        mapStyle={basemap}
        layers={[layer]}
        zoomInLevel={10}
        zoomInCoords={coords}
        isSmallMap={true}
      />
    </Box>
  );
};

export default Terracotta;
