import {
  ACLRole,
  ACLModuleDetails,
  CustomErrors,
  ACLDetails
} from '@poss-web/shared/models';

export const ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY = 'accessControlManagement';

export interface AccessControlManagementState {
  roles: ACLRole[];
  modules: ACLModuleDetails[];
  subModules: ACLModuleDetails[];
  features: ACLModuleDetails[];
  error: CustomErrors;
  isLoading: boolean;
  acl: ACLDetails[];
  isACLUpdateSuccess: boolean;
}
