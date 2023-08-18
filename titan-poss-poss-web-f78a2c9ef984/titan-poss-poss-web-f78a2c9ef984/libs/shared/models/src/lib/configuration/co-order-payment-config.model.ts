export interface CoOrderPaymentConfigPayload {
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: any;
    type: string;
  };
  ruleId?: number;
  ruleType?: string;
}
export interface CoOrderPaymentConfigReqPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface CoOrderPaymentConfigList {
  configList: CoOrderPaymentConfigPayload[];
  totalElements: number;
}

export interface SaveCoOrderPaymentsPayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  orderPaymentConfigRequest: CoOrderPaymentsRequest;
}
export interface CoOrderPaymentsRequest {
  addProducts?: {
    productGroupCode: string;
    rangeId: string;
    ruleDetails: {
      data: {
        ibtMetalRateFrozenPercentforGold: number;
        ibtMetalRateFrozenPercentforPlatinum: number;
        ibtMetalRateNonFrozenPercentforGold: number;
        ibtMetalRateNonFrozenPercentforPlatinum: number;
        ibtBestRatePercentforGold: number;
        ibtBestRatePercentforPlatinum: number;
        mtrMetalRateFrozenPercentforGold: number;
        mtrMetalRateFrozenPercentforPlatinum: number;
        mtrMetalRateNonFrozenPercentforGold: number;
        mtrMetalRateNonFrozenPercentforPlatinum: number;
        mtrBestRatePercentforGold: number;
        mtrBestRatePercentforPlatinum: number;
        prodMetalRateFrozenPercentforGold: number;
        prodMetalRateFrozenPercentforPlatinum: number;
        prodMetalRateNonFrozenPercentforGold: number;
        prodMetalRateNonFrozenPercentforPlatinum: number;
        prodBestRatePercentforGold: number;
        prodBestRatePercentforPlatinum: number;
        comMetalRateFrozenPercentforGold: number;
        comMetalRateFrozenPercentforPlatinum: number;
        comMetalRateNonFrozenPercentforGold: number;
        comMetalRateNonFrozenPercentforPlatinum: number;
        comBestRatePercentforGold: number;
        comBestRatePercentforPlatinum: number;
        autoApprovalFrozenPercentforGold: number;
        autoApprovalFrozenPercentforPlatinum: number;
        autoApprovalNonFrozenPercentforGold: number;
        autoApprovalNonFrozenPercentforPlatinum: number;
        autoApprovalBestRatePercentforGold: number;
        autoApprovalBestRatePercentforPlatinum: number;
      };
      type: string;
    };
  }[];
  removeProducts?: string[];
}
export interface UpdateCoOrderPaymentConfigPayload {
  id: string;
  data: any;
}
export interface CoOrderPayementRulesRequest {
  pageIndex?: number;
  pageSize?: number;
  configId: string;
  productGroupCode?: string;
  isPageable?: boolean;
  sort?: string[];
}
export interface CoOrderpyamentRulesResponse {
  response: CoOrderPaymentResponse[];
  totalElements: number;
}
export interface CoOrderPaymentResponse {
  id: string;
  productGroupCode: string;
  productCategoryCode?: string;
  rangeId?: string;
  ruleDetails: {
    type: string;
    data: any;
  };
  ibtMetalRateFrozenPercentforGold?: number;
  ibtMetalRateFrozenPercentforPlatinum?: number;
  ibtMetalRateNonFrozenPercentforGold?: number;
  ibtMetalRateNonFrozenPercentforPlatinum?: number;
  ibtBestRatePercentforGold?: number;
  ibtBestRatePercentforPlatinum?: number;
  mtrMetalRateFrozenPercentforGold?: number;
  mtrMetalRateFrozenPercentforPlatinum?: number;
  mtrMetalRateNonFrozenPercentforGold?: number;
  mtrMetalRateNonFrozenPercentforPlatinum?: number;
  mtrBestRatePercentforGold?: number;
  mtrBestRatePercentforPlatinum?: number;
  prodMetalRateFrozenPercentforGold?: number;
  prodMetalRateFrozenPercentforPlatinum?: number;
  prodMetalRateNonFrozenPercentforGold?: number;
  prodMetalRateNonFrozenPercentforPlatinum?: number;
  prodBestRatePercentforGold?: number;
  prodBestRatePercentforPlatinum?: number;
  comMetalRateFrozenPercentforGold?: number;
  comMetalRateFrozenPercentforPlatinum?: number;
  comMetalRateNonFrozenPercentforGold?: number;
  comMetalRateNonFrozenPercentforPlatinum?: number;
  comBestRatePercentforGold?: number;
  comBestRatePercentforPlatinum?: number;
  autoApprovalFrozenPercentforGold?: number;
  autoApprovalFrozenPercentforPlatinum?: number;
  autoApprovalNonFrozenPercentforGold?: number;
  autoApprovalNonFrozenPercentforPlatinum?: number;
  autoApprovalBestRatePercentforGold?: number;
  autoApprovalBestRatePercentforPlatinum?: number;
  description?: string;
}
