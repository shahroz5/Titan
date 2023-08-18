export interface LoadResidualWeightConfigListingPayload {
  description?: string,
  pageIndex: number;
  pageSize: number;
}
export interface LoadResidualToleranceByConfigidPayload {
  pageIndex?: number;
  pageSize?: number;
  configId: string;
}
export interface ResidualWeightConfigResponse {
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: any;
    type: string;
  };
  ruleId?: number;
  ruleType?: string;
}

export interface LoadResidualWeightConfigPayload {
  page: number;
  size: number;
}

export interface ResidualWeightRange {
  range: string;
  id: string;
  rowId: any;
}
export interface RangeMappingRules {
  id: string;
  rangeId: string;
  ruleDetails: {
    data: any;
    type: string;
  };
}
export interface RangeMappingResponse {
  ruleId: number;
  ruleType: string;
  rules: RangeMappingRules[];
}
export interface UpdateRangeMappingPayload {
  id: string;
  data: any;
}
export interface RangeConfigRequest {
  addRangeConfigs?: {
    rangeDetails: { data: {}; type: string };
  }[];
  removeRangeConfigs?: string[];
  updateRangeConfigs?: {
    id: string;
    rangeId: string;
    rangeDetails: { data: {}; type: string };
  }[];
}

export interface SaveResidualTolerancePayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  residualTolerance: RangeConfigRequest;
}
export interface ResidualWeightToleranceResponse {
  weightTolerance: RangeMappingResponse[];
  totalElements: number;
}
