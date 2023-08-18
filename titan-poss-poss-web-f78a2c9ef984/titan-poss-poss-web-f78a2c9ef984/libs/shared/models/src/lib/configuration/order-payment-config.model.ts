export interface OrderPaymentConfigPayload {
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: any;
    type: string;
  };
  ruleId?: number;
  ruleType?: string;
}
export interface OrderPaymentConfigReqPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface OrderPaymentConfigList {
  configList: OrderPaymentConfigPayload[];
  totalElements: number;
}

export interface SaveOrderPaymentsPayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  orderPaymentConfigRequest: OrderPaymentsRequest;
}
export interface OrderPaymentsRequest {
  addProducts?: {
    productGroupCode: string;
    rangeId: string;
    ruleDetails: {
      data: {
        metalWeightFrozenPercent: number;
        metalWeightNonFrozenPercent: number;
        bestRatePercent: number;
      };
      type: string;
    };
  }[];
  removeProducts?: string[];
}
export interface UpdateOrderPaymentConfigPayload {
  id: string;
  data: any;
}
export interface OrderPayementRulesRequest {
  pageIndex?: number;
  pageSize?: number;
  configId: string;
  productGroupCode?: string;
  isPageable?: boolean;
  sort?: string[];
}
export interface OrderpyamentRulesResponse {
  response: OrderPaymentResponse[];
  totalElements: number;
}
export interface OrderPaymentResponse {
  id: string;
  productGroupCode: string;
  productCategoryCode?: string;
  rangeId?: string;
  ruleDetails: {
    type: string;
    data: any;
  };
  metalRateFrozenPercent?: string;
  metalRateNonFrozenPercent?: string;
  bestRatePercent?: string;
  description?: string;
}
