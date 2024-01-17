import React, { useEffect, useState, FC } from 'react';
import { Box, Typography } from '@mui/material';
import { BarLegendProps } from './types';

const styles = {
    colorbar: {
        width: '100%',
        height: 6,
        borderRadius: 4,
    },
    range: {
      fontSize: 10,
    },
}

const BarLegend: FC<BarLegendProps> = ({ src, length, range, unit = '' }) => {
  const [val, setVals] = useState<number[] | undefined>();

  useEffect(() => {
    if (
      length !== undefined &&
      range &&
      typeof range[0] === 'number' &&
      typeof range[1] === 'number'
    ) {
      const localLength = length - 1;

      const arr: number[] = [];
      const diff: number = range[1] - range[0];
      const incr: number = diff / localLength;

      for (let i = 0; i <= localLength; i += 1) {
        const value = range[0] + incr * i;
        arr.push(Number(value.toFixed(2)));
      }

      setVals(arr);
    }
  }, [range, length]);

  return (
    <Box width={1}>
      <img src={src} alt="legend-colorbar" style={styles.colorbar} />
      {range &&
        (typeof range[0] === 'number' && typeof range[1] === 'number' && val ? (
          <Box display="flex" justifyContent="space-between">
            {val.map((v: number) => (
              <Typography key={`value-${v}`} style={{ fontSize: 10 }}>
                {`${v} ${unit}`}
              </Typography>
            ))}
          </Box>
        ) : (
          ['number', 'string'].includes(typeof range[0]) &&
          ['number', 'string'].includes(typeof range[1]) && (
            <Box display="flex" justifyContent="space-between">
              <Typography sx={styles.range}>
                {`${range[0]} ${unit}`}
              </Typography>
              <Typography sx={styles.range}>
                {`${range[1]} ${unit}`}
              </Typography>
            </Box>
          )
        ))}
    </Box>
  );
};

export default BarLegend;