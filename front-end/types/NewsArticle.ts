import Tag from "./Tag";

interface NewsArticle {
  title: string;
  shortdescription: string;
  tags: Tag[];
  url: string;
  timestamp: Date;
  previewImage: string;
  id: number;
  lat: number;
  lon: number;
  icon: string;
  jsonRepresentation: string;
}

export default NewsArticle;
