export interface CustomerTown {
  townCode: string;
  description: string;
  stateName: string;
  isActive: boolean;
}

export interface LoadCustomerTownListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadCustomerTownListingSuccessPayload {
  customerTownDetailsListing: CustomerTown[];
  totalElements: number;
}

export interface SaveCustomerTownFormDetailsPayload {
  description: string;
  stateName: string;
  isActive: boolean;
}

export interface CustomerStateDetails {
  description: string;
  stateId: string;
}

export enum CustomerTownEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
