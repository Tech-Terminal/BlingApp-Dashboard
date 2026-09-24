export interface MaidData {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  idDocument?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
