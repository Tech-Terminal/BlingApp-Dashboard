import type { MaidData } from "./maid";

export interface PickupPointData {
  id: number;
  label: string;
  streetName?: string;
  buildingNumber?: string;
  lat?: number | string;
  long?: number | string;
  distance?: number;
  isActive: boolean;
  maids?: MaidData[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreatePickupPointPayload {
  label: string;
  streetName?: string;
  buildingNumber?: string;
  lat?: number;
  long?: number;
  distance?: number;
  isActive?: boolean;
  maidIds?: number[];
}

export type UpdatePickupPointPayload = Partial<CreatePickupPointPayload>;
