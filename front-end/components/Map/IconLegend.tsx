import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { CSSProperties, FC } from 'react';

interface iconsProps {
  icons?: { [key: string]: string };
}

const IconLegend: FC<iconsProps> = ({ icons }) => {
  const containerStyle = {
    maxWidth: '120px',
  } as CSSProperties;

  const pStyling = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textTransform: 'capitalize',
  } as CSSProperties;

  const imgHeight = 20;

  const imageStyling = {
    width: imgHeight * 0.85 + 'px',
    height: imgHeight + 'px',
    margin: '2px 5px',
  };

  return (
    <Box sx={containerStyle}>
      {icons !== undefined &&
        Object.keys(icons).map((key) => {
          return (
            <Box key={key} style={pStyling}>
              <img src={icons[key]} alt={key} style={imageStyling} />
              <Typography> - {key}</Typography>
            </Box>
          );
        })}
    </Box>
  );
};

export default IconLegend;
