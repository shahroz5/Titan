import * as moment from 'moment';

export interface LoadMarketBasedOnMaterial {
  data: { materialCode: string; pageIndex: number; pageSize: number };
  selectedStock?: any;
  isAllSelected?: boolean;
  basePrice?: number;
}
export interface MaterialPricePayload {
  applicableDate: any;
  materialCode: string;
  configId?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface MaterialPriceList {
  priceType: string;
  time: string;
  price: number;
  remarks: string;
  id: string;
  createdDate: any;
}

export interface SelectedStock {
  id: string;
  computedPrice: string;
  isChecked: boolean;
}
export interface MaterialPricepType {
  code: string;
  value: string;
  isActive: boolean;
}
export interface MaterialTypes {
  materialCode: string;
  description: string;
  isActive: boolean;
}

export interface MarketListing {
  marketDetails: MarketDetails[];
  totalCount: number;
}

export interface MarketDetails {
  materialCode?: string;
  marketCode: string;
  description?: string;
  markupFactor: number;
  addAmount: number;
  deductAmount: number;
  computedPrice?: any;
  isChecked?: boolean;
}

export interface ComputeGoldPricePayload {
  applicableDate: number;
  basePrice: string;
  marketCodes: [];
  priceTypeCode: string;
}

export interface SavePricePayload {
  materialCode: string;
  data: {
    applicableDate: number;
    basePrice: number;
    marketCodes: string[];
    priceTypeCode: string;
    remarks: string;
  };
}
export interface LoadSavedBasePrice {
  pageIndex: number;
  pageSize: number;
  id: string;
  materialCode: string;
}
export interface ViewLocationPayload {
  pageIndex: number;
  pageSize: number;
  materialCode: string;
  data: {
    applicableDate: number;
    basePrice: number;
    marketCodes: string[];
    priceTypeCode: string;
  };
}
export interface SearchMarketCodePayload {
  data: { marketCode: string; materialCode: string };
  selectedStock: any;
  isAllSelected?: boolean;
  basePrice?: number;
}

export interface SearchSavedLocationPriceByLocationPayload {
  id: string;
  locationCode: string;
  materialCode: string;
  pageSize: number;
  pageIndex: number;
}

export interface SearchComputedPriceByLocationPayload {
  locationCode: string;
  materialCode: string;
  pageSize: number;
  pageIndex: number;
  data: any;
}
export interface LocationDetailsList {
  locationDetails: LocationDetails[];
  totalCount: number;
}
export interface LocationDetails {
  locationCode: string;
  locationDescription: string;
  marketCode: string;
  marketDescription: string;
  materialPrice: string;
  time?: string;
  basePrice?: number;
}
