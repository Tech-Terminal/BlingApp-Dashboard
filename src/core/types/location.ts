export interface GovernorateData {
  id: number;
  nameEn: string;
  nameAr: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaData {
  id: number;
  governorateId: number;
  nameEn: string;
  nameAr: string;
  lat?: number | string;
  long?: number | string;
  governorate?: GovernorateData;
  createdAt?: string;
  updatedAt?: string;
}
