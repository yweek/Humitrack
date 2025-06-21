export interface Cigar {
  id: string;
  brand: string;
  name: string;
  size: string;
  format: string;
  country: string;
  strength: 'Mild' | 'Medium' | 'Full';
  wrapper: string;
  price: number;
  quantity: number;
  photo?: string;
  addedDate: string;
  inWishlist?: boolean;
  tags: string[];
  ringGauge?: number;
  factory?: string;
  releaseYear?: number;
  purchaseLocation?: string;
  agingStartDate?: string;
  lowStockAlert?: number;
  humidorId?: string; // Reference to the humidor this cigar belongs to
}

export interface Humidor {
  id: string;
  name: string;
  description?: string;
  location?: string;
  capacity?: number;
  temperature?: number;
  humidity?: number;
  createdDate: string;
  isDefault?: boolean;
}

export interface TastingNote {
  id: string;
  cigarId: string;
  smokedDate: string;
  rating: number;
  comment?: string;
  tastingNotes?: string[];
  draw?: 'good' | 'average' | 'bad';
  burn?: 'good' | 'average' | 'bad';
  ash?: 'good' | 'average' | 'bad';
  photo?: string;
  agingTime: number;
}

export interface CigarDatabase {
  id: string;
  brand: string;
  name: string;
  size: string;
  format: string;
  country: string;
  strength: 'Mild' | 'Medium' | 'Full';
  wrapper: string;
  flavorProfile: string[];
  ringGauge: number;
  factory?: string;
  releaseYear?: number;
  vitola: string;
}

export interface UserTag {
  id: string;
  name: string;
  color: string;
}