import { Moment } from 'moment';

export class MarketCodeDetails {
  marketCode: string;
  description: string;
  lastModifiedBy?: string;
  lastModifiedDate?: Moment;
  isActive?: boolean;
  marketMaterialFacators?: any;
}
export interface MarketMaterialFactors {
  goldAddAmount: string;
  goldDeductAmount: string;
  goldMarkupFactor: string;
  silverAddAmount: string;
  silverDeductAmount: string;
  silverMarkupFactor: string;
  platinumAddAmount: string;
  platinumDeductAmount: string;
  platinumMarkupFactor: string;
  f1MarkupFactor: string;
  f2MarkupFactor: string;
  marketCode: string;
  description: string;
  isActive?: boolean;
}
export interface MarketMaterialTypes {
  goldAddAmount: string;
  goldDeductAmount: string;
  goldMarkupFactor: string;
  silverAddAmount: string;
  silverDeductAmount: string;
  silverMarkupFactor: string;
  platinumAddAmount: string;
  platinumDeductAmount: string;
  platinumMarkupFactor: string;
  f1MarkupFactor: string;
  f2MarkupFactor: string;
}
export interface LoadMarketCodesListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadMarketCodeListingSuccessPayload {
  marketCodeListing: MarketCodeDetails[];
  totalElements: number;
}
export interface SaveMarketCodeDetailsPayload {
  marketCode: string;
  description: string;
  isActive: boolean;
}
export interface SaveMarketMaterialFactorsPayload {
  marketCode: string;
  marketMarkupFactors: SaveMarketDetails[];
}
export interface SaveMarketDetails {
  addAmount?: number;
  deductAmount?: number;
  markupFactor?: number;
  metalTypeCode?: string;
}
export interface UpdateMarketCodeDetailsPayload {
  marketCode: string;
  updateMarketDetails: {
    isActive: boolean;
  };
}
