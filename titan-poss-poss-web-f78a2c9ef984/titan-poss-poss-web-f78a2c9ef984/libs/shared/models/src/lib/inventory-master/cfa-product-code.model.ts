export interface CFAProducts {
  productGroupCode: string;
  productType: string;
  hallmarkingExcludeGrams: number;
  itemTypeCode: string;
  orgCode: string;
  isActive: boolean;
  configDetails: any;
}
export interface CFAProductsResponse {
  productGroupCode: string;
  description: string;
  isActive: boolean;
}
export interface ProductType {
  id: string;
  name: string;
  isActive: boolean;
}
export interface ItemTypesResponse {
  id: string;
  name: string;
}
export interface LoadCFAProductCodeListingSuccessPayload {
  CFAProductCodeListing: CFAProductsResponse[];
  totalElements: number;
}
export interface LoadCFAProductCodeListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface UpdateCFAProductsPayload {
  productGroupCode: string;
  data: any;
}
export interface ProductGroupDetails {
  productGroupCode: string;
  hallmarkingExcludeGrams: number;
  description: string;
  hallmarkingExcludeKarat:string;
  itemTypeCode: string;
  orgCode: string;
  isEligibleForLoyaltyPoints: boolean;
  printGuranteeCard: boolean;
  isGRNEnabled: boolean;
  isConversionEnabled: boolean;
  isBestGoldRateEnabled: boolean;
  isGoldPriceMandatory: boolean;
  isMakingChargeMandatory: boolean;
  isAllowedForDigiGoldMandatory: boolean;
  isAllowedForTCS:boolean;
  isHallmarked:boolean;
  isPlatinumPriceMandatory: boolean;
  isSilverPriceMandatory: boolean;
  isStonePriceMandatory: boolean;
  isActive: boolean;
  isMia: boolean;
  plainStudded: string;
  plainStuddedTep: string;
  plainStuddedGrn: string;
  plainStuddedGrf: string;
  pricingType: string;
  isSolitaireStudded: boolean;
}
