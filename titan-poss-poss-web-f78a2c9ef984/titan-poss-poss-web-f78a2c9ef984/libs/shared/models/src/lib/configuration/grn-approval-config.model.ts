export interface GrnApprovalConfig {
  ruleId?: string;
  ruleType?: string;
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}

export interface GrnApprovalConfigList {
  grnApprovalConfigList: GrnApprovalConfig[];
  totalElements: number;
}

export interface GrnApprovalConfigResponse {
  ruleId: string;
  ruleType: string;
  description: string;
  isActive: boolean;
  config: GrnConfigDetail[];
}

export interface GrnConfigDetail {
  roleCode: string;
  processType: string;
  fromDays: number;
  tillDays: number;
  upperLimit?: number;
}

export interface GrnApprovalConfigListPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface RoleList {
  roleCode: string;
  roleName: string;
  isActive?: boolean;
}
