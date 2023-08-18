export interface LoadTaxMasterListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadTaxMasterListingSuccessPayload {
  taxMasterListing: TaxMasterDetails[];
  totalElements: number;
}

export interface TaxMasterDetails {
  taxCode: string;
  description: string;
  isActive: boolean;
  taxSystem: string;
}
