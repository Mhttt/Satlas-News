import React, { FC, useContext, useState } from 'react';
import { CoordSelectorProps } from './types';
import { MapContext } from '../../components/Map/MapContextProvider';
import Map from '../Map/Map';
import { Box, FormHelperText, useTheme} from '@mui/material';
import { IconLayer } from 'deck.gl';
import { createSVGIcon, svgToDataURL } from '../DynamicIcon/DynamicIcon';
import { getDKContourLayer } from '../Map/DkContourLayer';

const CoordSelector: FC<CoordSelectorProps> = ({
  selectedCoords,
  setSelectedCoords,
}) => {
  const {
    state: { viewport, isOpticalBasemap, darkMode },
    actions: { setViewport },
  } = useContext(MapContext);
  
  const th = useTheme();

  const basemap =
    darkMode === true
      ? 'mapbox://styles/mapbox/dark-v10'
      : isOpticalBasemap
      ? 'mapbox://styles/mapbox/satellite-v9'
      : 'mapbox://styles/mapbox/light-v10';

  const isCoordsSelected =
    selectedCoords[0] !== undefined && selectedCoords[1] !== undefined;

  let iconLayer;
  if (isCoordsSelected) {
    iconLayer = new IconLayer({
      id: 'icon-layer',
      data: [{ coordinates: selectedCoords }],
      getIcon: (_d: any) => {
        return {
          url: svgToDataURL(createSVGIcon('AddLocation', darkMode, th)), // AddLocation icon from MUI Icons
          width: 106,
          height: 128,
          anchorY: 128,
        };
      },
      sizeScale: 15,
      getPosition: (d: any) => d.coordinates,
      getSize: () => 2,
    });
  }

  const handleMapClick = (e: any) => setSelectedCoords(e.coordinate);

  const [mapClicked, setMapClicked] = useState(true);

  return (
    <Box 
      sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} 
      onClick={(e) => e.target instanceof HTMLButtonElement || e.target instanceof SVGElement ? setMapClicked(false) : ''}
    > 
        <Map
          zoomInLevel={isCoordsSelected ? 7 : 5}
          zoomInCoords={
            isCoordsSelected
              ? { latitude: selectedCoords[1], longitude: selectedCoords[0] }
              : undefined
          }
          onClick={(e) => mapClicked ? handleMapClick(e) : setMapClicked(true)}
          view={viewport}
          setViewport={setViewport}
          mapStyle={basemap}
          layers={iconLayer ? [getDKContourLayer(darkMode, isOpticalBasemap, th), iconLayer] : [getDKContourLayer(darkMode, isOpticalBasemap, th)]}
          isSmallMap={true}
          cursor={(e) => e.isDragging ? 'grabbing' : 'default'}
        />
      <FormHelperText>
        Select news location by clicking on the map <br />
        {isCoordsSelected ? (<>Coordinates of marker: lat {selectedCoords[1].toFixed(3)}, lon {selectedCoords[0].toFixed(3)}</>) : (<><em>No coordinates selected</em></>)}
      </FormHelperText>
    </Box>
  );
};

export default CoordSelector;
