import type { GovernorateData, AreaData } from "./location";
import type { ClientData } from "./client";

export interface AddressData {
  id: number;
  clientId: number;
  client?: ClientData;
  label: string;
  lat: number;
  long: number;
  governorateId: number;
  governorate?: GovernorateData;
  areaId: number;
  area?: AreaData;
  street: string;
  block: string;
  houseNumber: string;
  additionalDetails?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}
