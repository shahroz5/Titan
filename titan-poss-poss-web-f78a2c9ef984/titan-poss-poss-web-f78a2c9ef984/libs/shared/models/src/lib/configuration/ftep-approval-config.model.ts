export interface FtepApprovalConfig {
  ruleId?: string;
  ruleType?: string;
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}

export interface FtepApprovalConfigList {
  ftepApprovalConfigList: FtepApprovalConfig[];
  totalElements: number;
}

export interface FtepApprovalConfigResponse {
  ruleId: string;
  ruleType: string;
  description: string;
  isActive: boolean;
  config: FtepConfigDetail[];
}

export interface FtepConfigDetail {
  roleCode: string;
  processType: string;
  fromDays: number;
  tillDays: number;
  upperLimit?: number;
}

export interface FtepApprovalConfigListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
