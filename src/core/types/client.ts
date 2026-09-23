import type { AddressData } from "./address";

export interface ClientData {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  isActive: boolean;
  addresses?: AddressData[];
  createdAt: string;
  updatedAt?: string;
}
