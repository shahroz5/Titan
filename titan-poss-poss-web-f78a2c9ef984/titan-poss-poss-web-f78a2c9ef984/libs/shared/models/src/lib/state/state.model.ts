export interface LoadStateListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadStatesDetailsListingSuccessPayload {
  stateDetailsListing: StateData[];
  totalElements: number;
}

export interface SaveStateDetailsPayload {
  configDetails: {};
  countryCode: string;
  description: string;
  isActive: boolean;
  stateCode: string;
  isUnionTerritory: boolean;
  stateId?: number;
  stateTaxCode?: number;
}

export interface StateData {
  configDetails: {};
  countryCode: string;
  description: string;
  isActive: boolean;
  stateCode: string;
  isUnionTerritory: boolean;
  stateId?: number;
  stateTaxCode?: number;
  eghsRefStateId?: number;
}

export interface LoadCountryDetailsListingSuccessPayload {
  countryDetailsListing: CountriesDetails[];
  totalElements: number;
}

export interface CountriesDetails {
  countryCode: string;
  description: string;
}

// export interface TaxClassDetails {
//   stateTaxCode: number;
//   description: string;
// }

// export interface LoadTaxClassListingSuccessPayload {
//   taxClassListing: TaxClassDetails[];
//   totalElements: number;
// }

export interface LoadStateTaxDetailsListing {
  stateTaxDetails: LoadStateTaxClassListing[];
  totalElements: number;
}

export interface LoadStateTaxClassListing {
  isActive: boolean;
  taxClassCode: string;
  taxDetails: TaxDetails[];
}

export interface TaxDetails {
  LST: string;
  RST: string;
  CST: string;
  VAT: string;
  CGST: string;
  SGST: string;
  IGST: string;
}

export enum stateEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
