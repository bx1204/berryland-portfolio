
import { Category, Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SILENT WEAVE',
    subtitle: 'Textile intervention in space',
    description: 'A large-scale installation exploring the boundary between industrial architecture and soft materials. Hand-woven panels spanning 12 meters.',
    category: Category.WEAVING,
    hoverImageUrl: 'https://images.unsplash.com/photo-1544273677-242bb23b35c3?auto=format&fit=crop&w=800&q=80',
    detailImageUrls: [
      'https://images.unsplash.com/photo-1544273677-242bb23b35c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'
    ],
    date: '2023',
    location: 'Amsterdam, NL'
  },
  {
    id: '2',
    title: 'EROSION PARK',
    subtitle: 'Strategic landscape intervention',
    description: 'A landscape project that utilizes natural erosion patterns to create new pedestrian pathways through the dunes.',
    category: Category.LANDSCAPE,
    hoverImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    detailImageUrls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'
    ],
    date: '2022',
    location: 'Zeeland, NL'
  },
  {
    id: '3',
    title: 'VOID STUDIES',
    subtitle: '3D spatial modeling',
    description: 'A series of digital and physical models exploring the concept of "negative space" in residential architecture.',
    category: Category.MODELING,
    hoverImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    detailImageUrls: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592dee39c560?auto=format&fit=crop&w=1200&q=80'
    ],
    date: '2024',
    location: 'Berryland Studio'
  }
];
