import Tag from '../../types/Tag';

interface OnDelete {
  (id: number): void;
}

export interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  tags: Tag[];
  icon: string;
  timeLocation: string;
  large: boolean;
  articleURL?: string;
  id: number;
  coords?: { lat: number; lng: number };
  zoomLevel?: number;
  onDelete: OnDelete;
}
