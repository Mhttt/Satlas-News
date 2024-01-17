import React, { useState, ReactNode, createContext, useCallback } from 'react';
import { ViewportProps, FlyToInterpolator } from 'react-map-gl';
import { easeCubicInOut } from 'd3-ease';
import { FC} from 'react';

interface MapContextValues {
  state: {
    isOpticalBasemap: boolean;
    viewport: ViewportProps;
    mapHeight: number;
    mapWidth: number;
    rasterOpacity: number;
    darkMode: boolean;
  };
  actions: {
    setIsOpticalBasemap: (val: boolean) => void;
    setViewport: (v: ViewportProps) => void;
    setMapHeight: (h: number) => void;
    setMapWidth: (w: number) => void;
    setRasterOpacity: (o: number) => void;
    handleViewportChange: (v: ViewportProps) => void;
    setDarkMode: (val: boolean) => void;
  };
}

type Context = MapContextValues;

export const MapContext = createContext<Context>(
  null as unknown as MapContextValues
);

export const defaultViewPort: ViewportProps = {
  longitude: 10.5683,
  latitude: 56.3261,
  zoom: 2,
  pitch: 0,
  bearing: 0,
  transitionDuration: 3000,
  transitionInterpolator: new FlyToInterpolator(),
};

interface Props {
  children: ReactNode;
}

const MapContextProvider: FC<Props> = ({ children }) => {
  const [isOpticalBasemap, setIsOpticalBasemap] = useState(false);
  const [viewport, setViewport] = useState(defaultViewPort);
  const [mapHeight, setMapHeight] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);
  const [rasterOpacity, setRasterOpacity] = useState(0.5);
  const [darkMode, setDarkMode] = useState(false);

  const handleViewportChange = useCallback(
    (v: Partial<ViewportProps>) => {
      setViewport({
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubicInOut,
        ...v,
      });
    },
    [setViewport]
  );

  return (
    <MapContext.Provider
      value={{
        state: {
          isOpticalBasemap,
          viewport,
          mapHeight,
          mapWidth,
          rasterOpacity,
          darkMode,
        },
        actions: {
          setIsOpticalBasemap,
          setViewport,
          setMapHeight,
          setMapWidth,
          setRasterOpacity,
          handleViewportChange,
          setDarkMode,
        },
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContextProvider;
