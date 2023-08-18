export interface CnPriorityConfigListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface CnPriorityConfigList {
  cnPriorityConfigList: CnPriorityConfig[];
  totalElements: number;
}

export interface CnPriorityConfig {
  configId?: string;
  configType?: string;
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}
export interface CnPriorityConfigResponse {
  configId: string;
  configType: string;
  description: string;
  isActive: boolean;
  priorityDetails: CnPriorityDetail[];
}

export interface CnPriorityDetail {
  cnType: string;
  priority: string;
}

export interface UpdateCnPriorityConfigPayload {
  configId: string;
  isActive: string;
  ruleDetails?: {
    data: {};
    type: string;
  };
}
