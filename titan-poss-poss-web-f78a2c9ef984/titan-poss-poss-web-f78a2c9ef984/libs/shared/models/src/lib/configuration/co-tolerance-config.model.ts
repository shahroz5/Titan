export interface CoToleranceConfigResponse {
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
export interface LoadCoToleranceConfigReqPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
  orderType: string;
}
export interface CoToleranceConfigResponseList {
  configList: CoToleranceConfigResponse[];
  totalElements: number;
}
export interface CoToleranceConfigDetailsReqPayload {
  pageIndex?: number;
  pageSize?: number;
  sort: string[];
  configId: string;
  ruleType: string;
}
export interface CoToleranceConfigDetailsResPayload {
  totalElements: number;
  ruleDetails: CoToleranceRangeMappingRules[];
}
export interface CoToleranceWeightRange {
  range: string;
  id: string;
  rowId: any;
}

export interface CoToleranceRangeMappingRules {
  id: string;
  rangeId: string;
  ruleDetails: {
    data: any;
    type: string;
  };
}
export interface CoToleranceRangeMappingResponse {
  ruleId: number;
  ruleType: string;
  rules: CoToleranceRangeMappingRules[];
}
export interface COToleranceUpdateRangeMappingPayload {
  id: string;
  data: any;
  ruleType: string;
}
export interface CoToleranceRangeConfigRequest {
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
export interface SaveCoTolerancePayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  ruleType: string;
  residualTolerance: CoToleranceRangeConfigRequest;
}
export interface CoToleranceConfigMetalType {
  materialTypeCode: string;
  description: string;
}
