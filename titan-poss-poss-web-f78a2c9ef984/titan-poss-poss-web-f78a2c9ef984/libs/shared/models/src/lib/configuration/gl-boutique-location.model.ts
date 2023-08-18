export interface GlBoutiqueLocationList {
  costCenter: string;
  fitCode: string;
  glCode: string;
  pifSeriesNo: string;
  locationCode: string;
  isActive: boolean;
}

export interface GlBoutiqueLocationListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface GlBoutiqueLocationSuccessPayload {
  glBoutiqueLocationListing: GlBoutiqueLocationList[];
  totalElements: number;
}
