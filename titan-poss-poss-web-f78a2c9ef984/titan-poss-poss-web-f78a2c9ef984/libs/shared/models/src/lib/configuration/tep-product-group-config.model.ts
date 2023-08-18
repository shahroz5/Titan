
export interface TEPProductGroupConfigListingPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
}

export interface TEPProductGroupConfigListing {
  results: TEPProductGroupConfigDetails[];
  totalElements: number;
}

export interface TEPProductGroupConfigDetails {
  description: string;
  isActive: boolean;
  offerDetails: TEPProductGroupConfigOfferConfigDetails;
  configDetails: TEPProductGroupConfigOfferConfigDetails;
  isOfferEnabled?: any;
  itemCode?: any;
  startDate?: any;
  endDate?: any;
  customerMobileNos: any[];
  configId: string;
  configType: string;
  createdDate?: number;
}

export interface TEPProductGroupConfigOfferConfigDetails {
  type?: any;
  data?: any;
}

export interface TEPProductGroupMappingListingPayload {
  configId: string;
  pageIndex: number;
  pageSize: number;
  sort: string[];
}

export interface TEPProductGroupMappingListing {
  results: TEPProductGroupMappingDetails[];
  totalElements: number;
}

export interface TEPProductGroupMappingDetails {
  id: string;
  productGroupCode: string;
  configDetails: TEPProductGroupMappingConfigDetails;
  configId: string;
}

export interface TEPProductGroupMappingConfigDetails {
  type: string;
  data: TEPProductGroupMappingConfigDetailsData;
}

export interface TEPProductGroupMappingConfigDetailsData {
  isTepAllowed: boolean;
  goldDeductionPercent: number;
  silverDeductionPercent: number;
  platinumDeductionPercent: number;
  ucpDeductionPercent: number;
  ucpDeductionFlatValue: number;
  isStoneChargesApplicable: boolean;
  stoneDeductionPercent: number;
  isCMMandatory: boolean;
  cmUnavailableDeductionPercent: number;
  isFVTAllowed: boolean;
  fvtDeductionPercent: number;
  isCutPieceTepAllowed: boolean;
  isInterBrandTepAllowed: boolean;
  typeOfExchange: string;
  recoverDiscountPercent: number;
  refundDeductionPercent: number;
  isTEPSaleBin: boolean;
  weightTolerancePercent: number;
  isProportionedValue: boolean;
  isCmDeductionAllowed: boolean;
  cmDeductionPercent: number;
}
export interface TEPProductGroupMappingGridData {
  uuid: string;
  productGroups: string;
  isTepAllowed: boolean;
  goldDeductionPercent: number;
  silverDeductionPercent: number;
  platinumDeductionPercent: number;
  ucpDeductionPercent: number;
  ucpDeductionFlatValue: number;
  isStoneChargesApplicable: boolean;
  stoneDeductionPercent: number;
  isCMMandatory: boolean;
  cmUnavailableDeductionPercent: number;
  isFVTAllowed: boolean;
  fvtDeductionPercent: number;
  isCutPieceTepAllowed: boolean;
  isInterBrandTepAllowed: boolean;
  typeOfExchange: string;
  recoverDiscountPercent: number;
  refundDeductionPercent: number;
  isTEPSaleBin: boolean;
  weightTolerancePercent: number;
  isProportionedValue: boolean;
  isCmDeductionAllowed: boolean;
  cmDeductionPercent: number;
  // formGroup?: FormGroup;
}

export interface AddTEPProductGroupsMapping {
  addProductGroups?: AddProductGroupMapping[];
  updateProductGroups?: UpdateProductGroupMapping[];
  removeProductGroups?: string[];
}

interface AddProductGroupMapping {
  configDetails: AddProductGroupMappingConfigDetails;
  productGroupCode: string;
}
interface UpdateProductGroupMapping {
  configDetails: AddProductGroupMappingConfigDetails;
  id: string;
}

interface AddProductGroupMappingConfigDetails {
  data: TEPProductGroupMappingGridData;
  type: string;
}

export interface TEPProductGroupMappingConfigFilter {
  configType: string;
  productGroup: string;
}

export enum TEPProductGroupConfigEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit',
  TEP_PRODUCT_CONFIG = 'TEP_PRODUCT_CONFIG'
}
