export interface LoadCorporateTownListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadCorporateTownListingSuccessPayload {
  corporateTownDetailsListing: CorporateTown[];
  totalElements: number;
}

export interface LoadStateListingSuccessPayload {
  stateDetailsListing: StateDetails[];
  totalElements: number;
}
export interface LoadCountryCode {
  countryCode: string;
  descriprtion: string;
}

// export interface LoadRegionDetailsListingSuccessPayload {
//   regionDetailsListing: RegionDetails[];
//   totalElements: number;
// }

export interface SaveTownFormDetailsPayload {
  townCode?: string;
  stateId?: string;
  description: string;
  isActive: boolean;
}

export interface CorporateTown {
  townId?: number;
  townCode: string;
  stateId: string;
  description: string;
  stateName: string;
  isActive?: boolean;
  eghsRefTownId?: number;
}

export interface StateDetails {
  description: string;
  stateId: string;
}

// export interface RegionDetails {
//   description: string;
//   isActive: boolean;
//   parentRegionCode: string;
//   regionCode: string;
// }

export enum CorporateTownEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
