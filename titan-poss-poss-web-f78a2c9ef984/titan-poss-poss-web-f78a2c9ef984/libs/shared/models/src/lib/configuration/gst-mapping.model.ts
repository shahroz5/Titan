export interface GSTMappingDetails {
  isActive: boolean;
  applicableTax: string;
  customerTaxType: string;
  destLocationApplicableTax: string;
  destLocationTaxType: string;
  isSameState: boolean;
  srcLocationApplicableTax: string;
  srcLocationTaxType: string;
  srcTaxApplicable: boolean;
  txnType: string;
  id: string;
}
export interface GSTMappingPayload {
  isActive: boolean;
  applicableTax: string;
  customerTaxType: string;
  destLocationApplicableTax: string;
  destLocationTaxType: string;
  isSameState: boolean;
  srcLocationApplicableTax: string;
  srcLocationTaxType: string;
  srcTaxApplicable: boolean;
  txnType: string;
}

export interface LoadGSTMappingListPayload {
  pageIndex: number;
  pageSize: number;
  filter: GSTMappingFilter;
}
export interface GSTMappingResponse {
  gstMappingList: GSTMappingDetails[];
  totalElements: number;
}

export interface Tax {
  taxCode: string;
  description: string;
}

export interface GSTMappingFilter {
  isActive: boolean;
  customerTaxType: string;
  destLocationTaxType: string;
  srcLocationTaxType: string;
  txnType: string;
}

export enum GSTMappingFormTypeEnum {
  NEW,
  EDIT,
  FILTER
}

export enum GSTMappingActiveStatusEnum {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface GSTMappingTxnType {
  value: string;
  description: string;
}

export const TAXTRANSACTIONTYPE = 'TAXTRANSACTIONTYPE';
