export interface MaidData {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  idDocument?: string;
  isActive: boolean;
  pickupPointId?: number;
  pickupPoint?: any;
  createdAt: string;
  updatedAt?: string;
}
