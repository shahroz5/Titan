export interface GEPPurityConfigListPayload {
  description: string;
  pageIndex: number;
  pageSize: number;
  type: string;
}
export interface GEPPurityConfigResponse {
  gepPurityConfigList: GepConfiguration[];
  totalElements: number;
}
export interface GEPPurityConfig {
  description: string;
  isActive: boolean;
  configId?: string;
  createdDate:string
}

export interface GepConfiguration {
  description: string;
  isActive: boolean;
  type?: string;
}
export interface MetalType {
  materialTypeCode: string;
  description: string;
}
export interface ItemType {
  itemCode: string;
  description: string;
}
export interface Ranges {
  fromRange: number;
  toRange: number;
  isActive?: boolean;
  id: string;
  range?: string;
}
export interface PurityDetails {
  deductionPercent: number;
  endDate: number;
  itemType: string;
  metalType: string;
  rangeId: string;
  schemePercent: number;
  startDate: number;
  id?: string;
}
export interface PurityDetailsPayload {
  configuration: GepConfiguration;
  purityDetails: {
    addConfigDetails: PurityDetails[];
    removeConfigDetails: string[];
    updateConfigDetails: PurityDetails[];
  };
  configId: string;
}
export interface ExcludeThemeCodes {
  configId: string;
  id: string;
  isActive: boolean;
  themeCode: string;
}
export interface ExcludeItemCodes {
  configId: string;
  id: string;
  isActive: boolean;
  itemCode: string;
}
export interface ProductGroupDeduction {
  config: GepConfiguration;
  productGroups: ProductGroupPayload;
  configId: string;
}
export interface ProductGroupPayload {
  addProductGroups?: ProductGroupDeductionPayload[];
  addRanges: AddRanges[];
  removeProductGroups: string[];
  updateProductGroups?: ProductGroupDeductionPayload[];
  updateGepProductGroups?: ProductGroupDeductionPayload[];
  updateRanges?: AddRanges[];
  rivaahExchangeConfigDto?: RivaahExchangeConfigPayload;
}
export interface AddRanges {
  percentValue: any;
  rangeId: string;
}
export interface GepPurityConfigOfferDetails {
  gepCNUtilizationPercentage: number;
  gepDiscountStartDate: number;
  gepDiscountEndDate: number;
  daysForGEPCNAfterOffer: number;
  daysForGRNAndRebillingAfterOffer: number;
  grnCNUtilizationPercentage: number;
  isRivaah: boolean;
}
export interface GepConfigDetails {
  gepDaysAfterCOOffer: number;
  gepDaysAfterABOffer: number;
  minKaratAccepted: number;
  gepDiscountDeductionAmt: boolean;
  gepAsPayment: boolean;
  baseKaratForPurity: number;
  holdTime: number;
  isPreMeltingDetailsMandatory: boolean;
}
export interface GEPDetailsPayload {
  gepConfiguration: GepConfiguration;
  gepDetails: {
    configDetails: GepConfigDetails;
    isOfferEnabled?: boolean;
    offerDetails: GepPurityConfigOfferDetails;
    description: string;
    isActive: boolean;
  };
  configId: string;
}
export interface GepDetails {
  offerDetails: GepPurityConfigOfferDetails;
  configDetails: GepConfigDetails;
  isOfferEnabled: boolean;
  description: string;
  isActive: boolean;
  configId: string;
}
export interface PurityDetailsResponse {
  rangeId: string;
  deductionPercent: number;
  schemePercent: number;
  startDate: number;
  endDate: number;
  metalType: string;
  itemType: string;
  id: string;
  configId: string;
}
export interface ProductGroupsDeduction {
  id: string;
  productGroupCode: string;
  rangeId: string;
  percentValue: string;
  configId: string;
  rivaahAdditionalDiscount: string;
}
export interface SearchProdcutGroup {
  searchValue: string;
  configId: string;
}
export interface ThemeCodesPayload {
  addThemes: string[];
  removeThemes: string[];
}
export interface RemoveThemeCodesPayload {
  configId: string;
  deleteThemeCode: {
    addThemes: string[];
    removeThemes: string[];
  };
}
export interface SaveThemeCodesPayload {
  saveThemeCodes: ThemeCodesPayload;
  config: GepConfiguration;
  configId: string;
}
export interface RemoveProductGroupDeduction {
  configId: string;
  deleteProductGroup: ProductGroupPayload;
}
export interface ExcludeItemCodeStatus {
  id: string;
  isExcluded: string;
}
export interface ExcludeItemCodesPayload {
  gepConfiguration: GepConfiguration;
  uploadPayload: {
    configId: string;
    type: string;
    formData: FormData;
  };
}
export interface ProductGroupDeductionPayload {
  configDetails: {};
  productGroupCode?: string;
  id?: string;
}
export interface RivaahExchangeConfigPayload {
  rivaahAdditionalDiscount?: any;
}