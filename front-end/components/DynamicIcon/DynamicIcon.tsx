import * as Icons from '@mui/icons-material';
import { Theme, useTheme } from '@mui/system';
import { FC } from 'react';
import ReactDOMServer from 'react-dom/server';

type ModuleType = typeof Icons;

export function getIcon<K extends keyof ModuleType>(input: K | string) {
  // Now it finds the icon based on lowercase input - making it more reliable
  const foundIcon = Object.keys(Icons).find(
    (key) => key.toLowerCase() === input.toLowerCase()
  );
  return foundIcon ? Icons[foundIcon as K] : undefined;
}

export function createSVGIcon(name: string, darkMode: boolean, th: Theme) {
  const iconString = ReactDOMServer.renderToString(
    <DynamicIcon name={name}></DynamicIcon>
  );
  const path = iconString.split('><path')[1].split('</path>')[0].trim();

  return `<svg focusable="false" fill="${
    darkMode !== true ? th.palette.primary.main : th.palette.secondary.main
  }" aria-hidden="true" width="250" height="250" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path ${path}</path></svg>`;
}

export function svgToDataURL(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const DynamicIcon: FC<{ name: string }> = ({ name }) => {
  const IconComponent = getIcon(name);

  if (!IconComponent) {
    // Return a default one
    return <Icons.LocationOn />;
  }

  return <IconComponent />;
};

export default DynamicIcon;
