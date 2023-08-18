import { FormGroup } from '@angular/forms';

export interface FocConfigurationList {
  focConfigList: SchemeDetails[];
  totalElements: string;
}
export interface LocationListSuccessPayload {
  totalLocations: number;
  locationList: FocLocationList[];
}
export interface FocLocationList {
  id: string;
  description: string;
}

export interface FocLocationList {
  locationCode: string;
  description: string;
  startDate: any;
  endDate: any;
  isActive: string | boolean;
  id: string;
  mobileNo?: string;
  subBrandCode: string;
}
export interface SaveLocationPayload {
  id?: string;
  saveLocationPayload?: {
    addLocations?: string[];
    configDetails?: {
      data?: {};
      type?: string;
    };

    removeLocations?: any[];
    updateLocations?: any[];
    validity?: {
      endDate?: any;
      startDate?: any;
      status?: boolean;
    };
  };
}

export interface FocConfigurationListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface FocLocationListPayload {
  pageIndex: any;
  pageSize: any;
  length: any;
  id: string;
}
export interface SchemeDetails {
  id?: string;
  lastPublishedDate?: any;
  isPublishPending?: boolean;
  lastPublishTime?: string;
  lastModifiedTime?: string;
  lastModifiedDate?: any;
  isAccrualUlp?: boolean;
  clubbingConfigData?: {
    data: {
      isExchangeOffer: boolean;
      isCBO: boolean;
      isGHS: boolean;
      isRiva: boolean;
      isEmpowerment?: boolean;
      isDV: boolean;
    };
    type: string;
  };
  description?: string;
  grnConfigData?: {
    data: {
      noOfDaysBeforeOfferPeriod: string;
      noOfDaysAfterOfferPeriod: string;
      utilizationPercent: string;
    };
    type: string;
  };
  isActive?: boolean;
  name?: string;
  orderConfigData?: {
    data: {
      isGoldRateFrozenForCO: boolean;
      isGoldRateFrozenForAB: boolean;
      offerPeriodForCO: string;
      offerPeriodForAB: string;
      coPercent: string;
      abPercent: string;
    };
    type: string;
  };
  tepConfigData?: {
    data: {
      isEnabled: boolean;
      tepDetails: {
        durationInDays: string;
        recoveryPercent: string;
      }[];
    };
    type: string;
  };
}

export interface GoldStdRowData {
  id: string;
  stdValue: string;
  karatage: string;
  formGroup: FormGroup;
  totalFocWt: string;
  productGroup: any[];
  rowId: string;
  productGroupCount?: number;
  isActive: boolean;
}

export interface GoldSlabRowData {
  id: string;
  multiplyingValue: string;
  karatage: string;
  slabFrom: string;
  slabTo: string;
  productGroupCount?: number;

  totalFocWt: string;
  rowId: string;
  isActive: boolean;
}
export interface OthersStdRowData {
  id: string;
  stdValue: string;
  itemCode: string;
  qty: string;
  productGroupCount?: number;
  formGroup: FormGroup;
  productGroup: any;
  rowId: string;
  isActive: boolean;
}
export interface OthersSlabRowData {
  id: string;
  multiplyingValue: string;
  itemCode: string;
  qty: string;
  productGroupCount?: number;
  slabFrom: string;
  slabTo: string;

  rowId: string;
  isActive: boolean;
}

export interface ValueBasedVariantDetails {
  id: string;
  stdValue?: string;
  slabFrom?: string;
  slabTo?: string;
  multiplyingValue?: string;
  isMultiple?: boolean;
  karatage?: string;
  totalFocWt?: string;
  isSingle?: boolean;
  isActive?: boolean;
  itemCode: string;
  quantity?: string;
  rowId?: string;
  focEligibility?: string;
  discountType?: string;
  productGroupCount?: number;
}
export interface WeightBasedVariantDetails {
  id: string;
  stdValue?: string;
  slabFrom?: string;
  slabTo?: string;
  multiplyingValue?: string;
  isMultiple?: boolean;
  karatage?: string;
  totalFocWt?: string;
  isSingle?: boolean;
  isActive?: boolean;
  itemCode: string;
  quantity?: string;
  rowId?: string;
  focEligibility?: string;
  productGroupCount?: number;
}
export interface VariantDetails {
  valueBasedVariantDetails: ValueBasedVariantDetails[];
  weightBasedVariantDetails: WeightBasedVariantDetails[];
}

export interface FocTypeRequestPaylaod {
  tabName: string;
  focType: string;
}
export interface LoadVariantDetailsPayload {
  id?: string;
  offerType?: string;
  itemType?: string;
  category?: string;
}

export interface FocTypeState {
  valueBasedGoldCoin: focSchemeBasedEnums;
  valueBasedOthers: focSchemeBasedEnums;
  weightBasedGoldCoin: focSchemeBasedEnums;
  weightBasedOthers: focSchemeBasedEnums;
}

export interface SaveProductGroup {
  masterId?: string;
  schemeDetailsId?: string;
  addProducts: any[];
  category: string;
  itemType?: string;
  removeProducts: any[];
}

export interface LoadProductGroupPayload {
  masterId?: string;
  category: string;
  itemType?: string;
  schemeDetailsId?: string;
}
export interface SaveVariantDetailsPayload {
  masterId?: string;
  addSchemeDetails: AddSchemeDetails[];
  updateSchemeDetails: UpdateSchemeDetails[];
  deleteSchemeDetails: string[];
  discountType?: string;
}
export enum focSchemeBasedEnums {
  NEW = 'new',
  VALUE_BASED = 'VALUE_BASED',
  WEIGHT_BASED = 'WEIGHT_BASED',
  GOLD_COIN = 'GOLD_COIN',
  OTHERS = 'OTHERS',
  STANDARD = 'STANDARD',
  SLAB = 'SLAB',
  CLUBBING_CONFIG = 'CLUBBING_CONFIG',
  TEP_CONFIG = 'TEP_CONFIG',
  GRN_CONFIG = 'GRN_CONFIG',
  ORDER_CONFIG = 'ORDER_CONFIG',
  PRE_DISCOUNT_TAX = 'PRE_DISCOUNT_TAX',
  PRE_DISCOUNT_WITHOUT_TAX = 'PRE_DISCOUNT_WITHOUT_TAX',
  POST_DISCOUNT_TAX = 'POST_DISCOUNT_TAX',
  POST_DISCOUNT_WITHOUT_TAX = 'POST_DISCOUNT_WITHOUT_TAX',
  GROSS_WEIGHT = 'GROSS_WEIGHT',
  NET_WEIGHT = 'NET_WEIGHT'
}

export enum tabTypeEnums {
  WEIGHT_BASED_OTHERS = 'WEIGHT_BASED_OTHERS',
  VALUE_BASED_GOLD_COIN = 'VALUE_BASED_GOLD_COIN',
  VALUE_BASED_OTHERS = 'VALUE_BASED_OTHERS',
  WEIGHT_BASED_GOLD_COIN = 'WEIGHT_BASED_GOLD_COIN'
}

export interface AddSchemeDetails {
  category: string;
  focEligibility: string;
  fromSaleValue?: string;
  isActive: boolean;
  isMultiple?: boolean;
  isSingle?: boolean;
  itemCode?: string;
  itemType?: string;
  karat?: string;
  offerType?: string;
  quantity?: string;
  rowId?: string;
  stdSaleValue?: string;
  toSaleValue?: string;
  weight?: string;
}

export interface UpdateSchemeDetails {
  category?: string;
  focEligibility?: string;
  fromSaleValue?: string;
  isActive?: boolean;
  isMultiple?: boolean;
  isSingle?: boolean;
  itemCode?: string;
  itemType?: string;
  karat?: string;
  offerType?: string;
  quantity?: string;
  rowId: string;
  schemDetailsId?: string;
  stdSaleValue?: string;
  toSaleValue?: string;
  weight?: string;
}

export interface FOCItemCodes {
  itemCode: string;
  stdWeight: number;
  karat: number;
  isSelected?: boolean;
  id?: string;
}
export interface FOCItemCodesPayload {
  excludeProductCategories: string[];
  excludeProductGroups: string[];
  includeProductCategories: string[];
  includeProductGroups: string[];
  isFocItem: boolean;
}
export interface FOCItemCodesPopupPayload {
  data: {
    selectedItemCodes: [];
    focItemCodes: FOCItemCodes[];
    isViewMode?: boolean;
    viewModeLabel?: string;
  };
}
export interface FocItemMappingApplyResponse {
  selectedItemCodes: FOCItemCodes[];
  addItemCodes: FOCItemCodes[];
  removeItemCodes: FOCItemCodes[];
}
export interface FocItemsSavePayload {
  savePayload: {
    addItems: FOCItemCodes[];
    removeItems: FOCItemCodes[];
  };
  id: string;
}
export interface FocItemsPayload {
  pageIndex: number;
  pageSize: number;
  id: string;
}
export interface FocItemsResponse {
  items: FOCItemCodes[];
  totalElements: number;
}
