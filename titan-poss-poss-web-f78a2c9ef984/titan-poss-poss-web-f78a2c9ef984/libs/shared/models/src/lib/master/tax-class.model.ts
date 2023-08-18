

export interface LoadTaxClassListingPayload {
  pageIndex: number;
  pageSize: number;
}


export interface LoadTaxClassListingSuccessPayload {
  taxClassListing: TaxClassDetails[];
  totalElements: number;
}

export interface TaxClassDetails {
  taxClassCode: string;
  description: string;
  isActive: boolean
}