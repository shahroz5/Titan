import { Moment } from 'moment';

export interface Country {
  id: string;
  countryCode: number;
  currencyCode: string;
  dateFormat: string;
  description: string;
  isActive: boolean;
  locale: string;
  phoneLength: number;
  timeFormat: string;
  isdCode: string;
  fiscalYear?: string;
}
export interface CountrySummary {
  countryCode: string;
  description: string;
  isdCode?: string;
}

export interface CountryDetails {
  countryCode: string;
  description: string;
  isdCode: string;
  dateFormat: string;
  phoneLength?: string;
  locale?: string;
  timeFormat?: string;
  isActive?: boolean;
  lastModifiedDate?: Moment;
}
export interface CountryMaster {
  countryCode: string;
  description: string;
  currencyCode: any;
  dateFormat: string;
  fiscalYearStart: string;
  isdCode: string;
  phoneLength: string;
  locale: string;
  timeFormat: string;
  fiscalYear: number;
  weightUnit: string;
  stoneWeightUnit: string;
  isActive: boolean;
}
export interface CountryNameData {
  id: string;
  name: string;
}

export interface CurrencyCodeData {
  id: string;
  name: string;
}
export enum CountryEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
export interface LoadCountryListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadCountryListingSuccessPayload {
  countryListing: CountryDetails[];
  totalElements: number;
}

export interface SaveCountryFormDetailsPayload {
  countryCode: string;
  description: string;
  currencyCode: string;
  dateFormat: string;
  fiscalYearStart?: string;
  isdCode: string;
  phoneLength: string;
  locale: string;
  timeFormat: string;
  fiscalYear: number;
  weightUnit: string;
  stoneWeightUnit: string;
  isActive: boolean;
}
