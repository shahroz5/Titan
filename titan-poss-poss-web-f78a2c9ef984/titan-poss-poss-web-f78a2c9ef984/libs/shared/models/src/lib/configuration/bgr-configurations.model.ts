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
  description?: string;
  ruleDetails?: RuleDetailsBgrConfig;
  isActive?: boolean;
}

export interface RuleDetailsBgrConfig {
  type: string;
  data: DataBgrConfig;
}

// export interface DataBgrConfig {
//   BGROfferFromdate: string;
//   BGROfferTodate: string;
//   redemptionFromDate: string;
//   redemptionToDate: string;
//   downSideAmount: number;
//   noOfDaysFromCurrentDate: number;
//   applicableGoldRate: string;
//   otherDetails?: {
//     isFirstGoldRate: boolean;
//     applicableDate: string;
//   };
// }

export interface DataBgrConfig {
  bgrOfferFromDate: number;
  bgrOfferToDate: number;
  redemptionPeriodFromDate: number;
  redemptionPeriodToDate: number;
  downSideAmount: string;
  applicableRateDate: string;
  otherDetails?: {
    applicableDate: number;
    applicableRate: string;
  };
}

export enum BgrConfigConstants {
  NEW = 'NEW',
  BGR_CONFIG = 'ORDER_AB_BGR_CONFIG'
}
