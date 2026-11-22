
export interface Equipment {
  id: number;
  name: string;
  description?: string;
  category?: string;
  image?: string;
  status: 'available' | 'reserved' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}
