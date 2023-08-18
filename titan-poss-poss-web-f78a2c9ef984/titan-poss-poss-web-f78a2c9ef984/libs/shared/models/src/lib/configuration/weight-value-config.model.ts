export interface LoadWeightValueConfigListingPayload {
  pageIndex: number;
  pageSize: number;
  searchDescription?: string;
}

export interface WeightValueConfigListingResult {
  results: WeightValueConfigDetails[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface WeightValueConfigDetails {
  ruleId: number;
  ruleType?: string;
  description?: string;
  ruleDetails?: RuleDetailsWeightValueConfig;
  isActive: boolean;
}

export interface RuleDetailsWeightValueConfig {
  type: string;
  data: DataWeightValueConfig;
}

export interface DataWeightValueConfig {
  weightBased?: BasedWeightValueConfig[];
  valueBased?: BasedWeightValueConfig[];
}

export interface BasedWeightValueConfig {
  rowId?: string;
  fromRange: string;
  toRange: string;
  toleranceAllowed?: string;
  tolerancePercent?: string;
  toleranceValue?: string;
}

export enum WeightValueConfigConstants {
  NEW = 'NEW',
  GRF_CONFIGURATION = 'GRF_CONFIGURATION'
}
