interface OnClose {
  (): void;
}

export interface PopUpProps {
  /**
   * the location of the image
   */
  title: string;
  image: string;
  article: string;
  onClose: OnClose;
  url: string;
  coords?: { lat: number; lng: number };
}
