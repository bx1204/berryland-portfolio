
export enum Category {
  WEAVING = 'weaving',
  LANDSCAPE = 'landscape',
  MODELING = 'modeling'
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: Category;
  hoverImageUrl: string;
  detailImageUrls: string[];
  date: string;
  location?: string;
}

export interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  category: Category;
  hoverImageUrl: string;
  detailImageUrls: string[];
  location: string;
}
