export interface AbToleranceConfigResponse {
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
export interface LoadAbToleranceConfigReqPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
  orderType: string;
}
export interface AbToleranceConfigResponseList {
  configList: AbToleranceConfigResponse[];
  totalElements: number;
}
export interface AbToleranceConfigDetailsReqPayload {
  pageIndex?: number;
  pageSize?: number;
  sort: string[];
  configId: string;
  ruleType: string;
}
export interface AbToleranceConfigDetailsResPayload {
  totalElements: number;
  ruleDetails: AbToleranceRangeMappingRules[];
}
export interface AbToleranceWeightRange {
  range: string;
  id: string;
  rowId: any;
}

export interface AbToleranceRangeMappingRules {
  id: string;
  rangeId: string;
  ruleDetails: {
    data: any;
    type: string;
  };
}
export interface AbToleranceRangeMappingResponse {
  ruleId: number;
  ruleType: string;
  rules: AbToleranceRangeMappingRules[];
}
export interface ABToleranceUpdateRangeMappingPayload {
  id: string;
  data: any;
  ruleType: string;
}
export interface AbToleranceRangeConfigRequest {
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
export interface SaveAbTolerancePayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  ruleType: string;
  residualTolerance: AbToleranceRangeConfigRequest;
}
export interface AbToleranceConfigMetalType {
  materialTypeCode: string;
  description: string;
}
