import {
  CustomErrors,
  FtepApprovalConfigResponse,
  RoleList
} from '@poss-web/shared/models';

export interface FtepApprovalConfigState {
  ftepApprovalConfigList: FtepApprovalConfigResponse[];
  ftepApprovalConfig: FtepApprovalConfigResponse;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  roleList: RoleList[];
}
