export interface WeightToleranceResponse {
  weightTolerance: WeightTolerance[];
  totalElements: number;
}

export interface WeightTolerance {
  weightRange?: string;
  rangeId?: string;
  range?: string;
  tolerance: string;
  productGroupCode: string;
  id: string[];
  isSaved?: boolean;
}

export interface LoadWeightToleranceByConfigidPayload {
  pageIndex?: number;
  pageSize?: number;
  configId: string;
  productGroupCode?: string;
}
export interface SaveWeightTolerancePayload {
  configDetail: {
    description: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  weightToleranceRequest: WeightToleranceRequest;
}

export interface WeightToleranceListPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
}
export interface WeightToleranceList {
  configList: ConfigDetails[];
  totalElements: number;
}

export interface ConfigDetails {
  configId?: string;
  configType?: string;
  configName?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}
export interface UpdateWeightTolerancePayload {
  id: string;
  data: any;
}
export interface WeightToleranceRequest {
  addProducts?: {
    productGroupCode: string;
    rangeId: string;
    rowId: number;
    ruleDetails: {
      data: {
        weightTolGrams: string;
      };
      type: string;
    };
  }[];
  removeProducts?: string[];
}

export interface WeightRange {
  range: string;
  rowId: string;
  id: string;
}

export enum weightToleranceEnum {
  ruleType = 'WEIGHT_TOLERANCE',
  new = 'new',
  weightTolerance = 'weightTolerance',
  productGroups = 'productGroups',
  weightRange = 'weightRange'
}
