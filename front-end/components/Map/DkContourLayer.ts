import { Theme } from '@mui/material';
import { GeoJsonLayer, RGBAColor } from 'deck.gl';

export function getDKContourLayer(
  darkMode: boolean,
  isOpticalBasemap: boolean,
  th: Theme
) {
  // Courtesy of Laurits' GitHub Copilot
  const hexToRgb = (hex: string): RGBAColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
          170, // opagueness
        ]
      : [0, 0, 0];
  };

  return new GeoJsonLayer({
    id: 'dk-border-geojson',
    data: 'https://grasdatastorage.blob.core.windows.net/geojson/mst_soilmoisture_denmark_aoi.json',
    filled: false,
    lineWidthMinPixels: 4,
    lineWidthScale: 20,
    getLineColor: () =>
      hexToRgb(
        darkMode || isOpticalBasemap
          ? th.palette.secondary.main
          : th.palette.primary.main
      ),
  });
}
