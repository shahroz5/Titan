import { Observable } from 'rxjs';


export interface LoadStateTaxConfigurationListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface StateTaxConfigurationListingResult {
  stateTaxConfigurationListing: StateTaxConfigurationListingData[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface StateTaxConfigurationListingData {
  id: string;
  stateId: string;
  stateName: string;
  stateCode: string;
  stateTaxCode?: number;
  taxComponent?: TaxComponentData;
  isActive: boolean;
}

export interface TaxComponentData {
  taxSystem: string;
  tax: TaxDataConfig[];
  cess: CessData[];
}

export interface CessData {
  cessCode: string;
  cessOnTax: boolean;
  selected?: boolean;
}

export interface TaxDataConfig {
  taxCode: string;
}



// ---------------------------------------------------------------------------------------------------
// export interface StateTaxDetails {
//   id: string;
//   taxClass: string;
//   CGST: number;
//   IGST: number;
//   UTGST: number;
//   SGST: number;
//   CESS: number;
//   isSelected: boolean;
// }

export interface TaxDetailsSelect {
  checked: boolean; taxDetailsId: string
}



/// --------------- State Details
export interface StateTaxConfigurationStateDetails {
  id?: string;
  stateId?: string;
  stateName?: string;
  stateCode?: string;
  stateTaxCode?: number;
  taxComponent?: TaxComponentData;
  isActive: boolean;
}

export interface TaxComponentData {
  taxSystem: string;
  tax: TaxDataConfig[];
  cess: CessData[];
}

export interface CessData {
  cessCode: string;
  cessOnTax: boolean;
}

export interface TaxDataConfig {
  taxCode: string;
}



/// ------------------------ Tax Details
export interface TaxDetailsConfig {
  id: string;
  taxClassCode: string;
  taxDetails: ConfigTaxDetailsData;
  isSelected: boolean;
}

export interface ConfigTaxDetailsData {
  data: { [key: string]: number };
}

// Tax List /// ---------------------------------- Tax system
export interface TaxsList {
  taxCode: string;
  description: string;
  isActive: null;
  taxSystem: string;
}


// --- Tax details popup
export interface TaxDetailsPopup {
  taxComponent$: Observable<string[]>;
  allTaxClassList$: Observable<string[]>;
  stateTaxDetailsList$: Observable<TaxDetailsConfig[]>;
  mode: boolean;
}

export interface TaxDetailsPopupFormData {
  id?: string,
  taxClassCode: string,
  taxDetails: ConfigTaxDetailsData
}


export interface TaxDetailsSubmit {
  addStateTaxDetails?: TaxDetailsPopupFormData[];
  updateStateTaxDetails?: TaxDetailsPopupFormData[];
}


