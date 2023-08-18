import {
  CustomErrors,
  RoleDetail,
  RoleTypesData
} from '@poss-web/shared/models';

export interface RoleManagementState {
  roles: RoleDetail[];
  roleTypes: RoleTypesData[];
  updatedRole: string;
  fetchRole: RoleDetail;
  totalRoles: number;
  error: CustomErrors;
  isLoading: boolean;
  locationformats: Map<string, string>;
}
