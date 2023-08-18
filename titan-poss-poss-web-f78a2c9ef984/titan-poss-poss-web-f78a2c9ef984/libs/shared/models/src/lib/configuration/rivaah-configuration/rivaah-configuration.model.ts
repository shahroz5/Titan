import { Moment } from "moment";

export interface RivaahConfigurationResponse {
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: any;
    type: string;
  };
  ruleId?: number;
  ruleType: string;
  createdDate?: any;
  lastModifiedDate?: any;
}

export interface RivaahEligibilityConfig {
  productGroupCount?: string;
  productCategoryCode?: string;
  eleventhDigit?: string[];
  grammage?: any;
  occasion?: string;
  isActive?: boolean;
  isNew?: boolean;
  isConcate?: boolean;
  id?: string;
}
export interface RivaahEligibilityConfigResponse {
  rivaahEligibilityConfig: RivaahEligibilityConfig[];
  totalElements: number;
}

export interface RivaahEligibilityConfigRequest {
  ruleId?: string;
  addProducts: {
    productCategoryCode: string;
    productGroupCode: string;

    ruleDetails: {
      data: {
        grammage: string;
        eleventhDigit: string[];
        occasion: string;
        isActive: boolean;
      };
      type: 'RIVAAH_CARD_ELIGIBILITY';
    };
  }[];
  removeProducts: any;
  updateProducts: {
    id: string;
    productCategoryCode: string;
    productGroupCode: string;

    ruleDetails: {
      data: {
        grammage?: string;
        eleventhDigit?: string[];
        occasion?: string;
        isActive: boolean;
      };
      type: 'RIVAAH_CARD_ELIGIBILITY';
    };
  }[];
}

export interface searchConfigRequest {
  configId: string;
  ruleType: string;
  productCategoryCode?: string;
  productGroupCode?: string;
  pageIndex?: number;
  pageSize?: number;
}
export interface LoadProductGroupsPayload {
  productId?: string;
  ruleId?: string;
  ruleType: string;
}
export interface SaveProductGroups {
  productId?: string;
  addProducts: any[];
  removeProducts: any[];
  ruleId?: string;
  ruleType: string;
}
export interface SaveRivaahLocationsPayload {
  ruleId?: string;
  payload: {
    addLocations?: string[];
    overwriteLocations?: string[];
    removeLocations?: string[];
    validity?: {
      offerEndDate: number;
      offerStartDate: number;
    };
  };
}

export interface RivaahLocationListPayload {
  ruleId?: string;
  pageIndex?: number;
  pageSize?: number;
  locationCode?: any;
  offerEndDate?: Moment;
  offerStartDate?: Moment;
}

export interface RivaahLocationList {
  description: string;
  ruleId: string;
  locationCode: string;
  offerEndDate: Moment;
  offerStartDate: Moment;
  subBrandCode: string;
}

export interface RivaahLocationSuccessList {
  rivaahLocationList: RivaahLocationList[];
  count: number;
}

export interface MappedLocDetails {
  ruleId?: string;
  id?: string;
  description?: string;
}