export interface ComplexityPriceGroupDetails {
  id: string;
  complexityCode: string;
  priceGroup: string;
  makingChargesPerUnit: string;
  makingChargesPerGram: string;
  wastagePercentage: string;
  makingChargesPercentage: string;
  isActive: boolean;
}

export interface ComplexityCodeData {
  id: string;
  name: string;
}

export interface PriceGroupData {
  id: string;
  name: string;
}

export enum ComplexityPriceGroupEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface LoadComplexityPriceGroupListingPayload {
  pageIndex: number;
  pageSize: number;
  complexityCode?: string;
}

export interface LoadComplexityPriceGroupListingSuccessPayload {
  complexityPricegroupListing: ComplexityPriceGroupDetails[];
  totalElements: number;
}

export interface SaveComplexityPriceGroupFormPayload {
  // id: string;
  complexityCode: string;
  priceGroup: string;
  makingChargePunit: string;
  makingChargePgram: string;
  wastagePct: string;
  makingChargePct: string;
}

export interface EditComplexityPriceGroupFormPayload {
  id: string;
  complexityCode: string;
  priceGroup: string;
  makingChargePunit: string;
  makingChargePgram: string;
  wastagePct: string;
  makingChargePct: string;
}

export interface ComplexityPricegroupFilter {
  complexityCode: string;
  priceGroup: string;
}
