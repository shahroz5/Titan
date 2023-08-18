export interface BgrConfigListingParams {
  pageIndex: number;
  pageSize: number;
}

export interface BgrConfigListingRequestPayload {
  description?: string;
  isActive?: boolean;
  locationCode?: string[];
  productCategoryCode?: string[];
  productGroupCode?: string[];
  ruleGroup?: string;
  ruleId?: number;
  ruleType: string;
}

export interface BgrConfigListingResult {
  results: BgrConfigDetails[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface BgrConfigDetails {
  ruleId: number;
  ruleType: string;
  description: string;
  ruleDetails: RuleDetailsBgrConfig;
  isActive?: boolean;
}

export interface RuleDetailsBgrConfig {
  type: string;
  data: DataBgrConfig;
}

export interface DataBgrConfig {
  BGROfferFromdate: string;
  BGROfferTodate: string;
  redemptionFromDate: string;
  redemptionToDate: string;
  downSideAmount: number;
  noOfDaysFromCurrentDate: number;
  otherDetails: {
    isFirstGoldRate: boolean;
    isLastGoldRate: boolean;
  };
}

export enum BgrConfigConstants {
  NEW = 'NEW',
  BGR_CONFIG = 'BGR_CONFIG'
}
