import {
  CustomErrors,
  GrnApprovalConfigResponse,
  RoleList
} from '@poss-web/shared/models';

export interface GrnApprovalConfigState {
  grnApprovalConfigList: GrnApprovalConfigResponse[];
  grnApprovalConfig: GrnApprovalConfigResponse;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  roleList: RoleList[];
}
