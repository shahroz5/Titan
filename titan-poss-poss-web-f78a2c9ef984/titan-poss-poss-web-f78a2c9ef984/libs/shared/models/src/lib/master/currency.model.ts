import { Moment } from 'moment';

export interface CurrencyDetails {
  currencyCode: string;
  currencySymbol: string;
  description: string;
  isActive: boolean;
  unicode: string;
  lastModifiedDate?: Moment;
}
export interface CurrencyFormDetails {
  currencyCode: string;
  currencySymbol: string;
  description: string;
  isActive: boolean;
}
export enum CurrencyDetailsEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface LoadCurrencyListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadCurrencyListingSuccessPayload {
  currencyListing: CurrencyDetails[];
  totalElements: number;
}

export interface SaveCurrencyDetailFormPayload {
  currencyCode: string;
  currencySymbol: string;
  description: string;
  isActive: boolean;
  // country?:string;
}
export interface EditCurrencyDetailFormPayload {
  currencyCode: string;
  currencySymbol: string;
  description: string;
  isActive: boolean;
}
