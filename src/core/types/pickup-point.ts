import type { MaidData } from "./maid";
import type { AreaData } from "./location";

export interface PickupPointData {
  id: number;
  label: string;
  streetName?: string;
  buildingNumber?: string;
  isActive: boolean;
  maids?: MaidData[];
  areas?: AreaData[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreatePickupPointPayload {
  label: string;
  streetName?: string;
  buildingNumber?: string;
  isActive?: boolean;
  maidIds?: number[];
  areaIds?: number[];
}

export type UpdatePickupPointPayload = Partial<CreatePickupPointPayload>;
