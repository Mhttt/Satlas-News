import { CSSProperties } from 'react';

export interface StatisticProps {
  title: string;
  description?: string;
  number: number;
  numberDescription: string;
  style?: CSSProperties;

}