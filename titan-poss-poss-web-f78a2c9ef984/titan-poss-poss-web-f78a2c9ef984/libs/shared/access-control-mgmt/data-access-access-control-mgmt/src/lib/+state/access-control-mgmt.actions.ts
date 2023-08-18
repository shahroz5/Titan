import {
  CustomErrors,
  ACLDetails,
  ACLUpdateRequest,
  ACLModuleDetails,
  ACLLoadRequest,
  ACLRole
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum AccessControlManagementActionTypes {
  LOAD_ROLES = '[ access-control-management ] Load Roles',
  LOAD_ROLES_SUCCESS = '[ access-control-management ] Load Roles Success',
  LOAD_ROLES_FAILURE = '[ access-control-management ]  Load Roles Failure',

  LOAD_MODULES = '[ access-control-management ] Load Modules',
  LOAD_MODULES_SUCCESS = '[ access-control-management ] Load Modules Success',
  LOAD_MODULES_FAILURE = '[ access-control-management ] Load Modules Failure',

  LOAD_SUB_MODULES = '[ access-control-management ] Load Sub Modules',
  LOAD_SUB_MODULES_SUCCESS = '[ access-control-management ] Load Sub Modules Success',
  LOAD_SUB_MODULES_FAILURE = '[ access-control-management ] Load Sub Modules Failure',

  LOAD_FEATURES = '[ access-control-management ] Load Features',
  LOAD_FEATURES_SUCCESS = '[ access-control-management ] Load Features Success',
  LOAD_FEATURES_FAILURE = '[ access-control-management ] Load Features Failure',

  LOAD_ACL = '[ access-control-management ] Load Acl',
  LOAD_ACL_SUCCESS = '[ access-control-management ] Load Acl Success',
  LOAD_ACL_FAILURE = '[ access-control-management ] Load Acl Failure',
  CLEAR_ACL = '[ access-control-management ] Clear Acl',

  UPDATE_ACL = '[ access-control-management ] Update Acl',
  UPDATE_ACL_SUCCESS = '[ access-control-management ] Update Acl Success',
  UPDATE_ACL_FAILURE = '[ access-control-management ] Update Acl Failure',

  RESET_ERROR = '[ access-control-management ] Reset Error'
}

export class LoadAcl implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ACL;
  constructor(public readonly payload: ACLLoadRequest) {}
}

export class LoadAclSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ACL_SUCCESS;
  constructor(public readonly payload: ACLDetails[]) {}
}

export class LoadAclFailure implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ACL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearAcl implements Action {
  readonly type = AccessControlManagementActionTypes.CLEAR_ACL;
}

export class UpdateAcl implements Action {
  readonly type = AccessControlManagementActionTypes.UPDATE_ACL;
  constructor(public readonly payload: ACLUpdateRequest) {}
}

export class UpdateAclSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.UPDATE_ACL_SUCCESS;
}

export class UpdateAclFailure implements Action {
  readonly type = AccessControlManagementActionTypes.UPDATE_ACL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadModules implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_MODULES;
  constructor(public readonly payload: string) {}
}

export class LoadModulesSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_MODULES_SUCCESS;
  constructor(public readonly payload: ACLModuleDetails[]) {}
}

export class LoadModulesFailure implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_MODULES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubModules implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_SUB_MODULES;
  constructor(public readonly payload: { groupCode: string; role: string }) {}
}

export class LoadSubModulesSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_SUB_MODULES_SUCCESS;
  constructor(public readonly payload: ACLModuleDetails[]) {}
}

export class LoadSubModulesFailure implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_SUB_MODULES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadFeatures implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_FEATURES;
  constructor(public readonly payload: { groupCode: string; role: string }) {}
}

export class LoadFeaturesSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_FEATURES_SUCCESS;
  constructor(public readonly payload: ACLModuleDetails[]) {}
}

export class LoadFeaturesFailure implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_FEATURES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoles implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ROLES;
}

export class LoadRolesSuccess implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ROLES_SUCCESS;
  constructor(public readonly payload: ACLRole[]) {}
}

export class LoadRolesFailure implements Action {
  readonly type = AccessControlManagementActionTypes.LOAD_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = AccessControlManagementActionTypes.RESET_ERROR;
}

export type AccessControlManagementActions =
  | LoadRoles
  | LoadRolesSuccess
  | LoadRolesFailure
  | LoadModules
  | LoadModulesSuccess
  | LoadModulesFailure
  | LoadSubModules
  | LoadSubModulesSuccess
  | LoadSubModulesFailure
  | LoadAcl
  | LoadAclFailure
  | LoadAclSuccess
  | UpdateAcl
  | UpdateAclSuccess
  | UpdateAclFailure
  | LoadFeatures
  | LoadFeaturesSuccess
  | LoadFeaturesFailure
  | ClearAcl
  | ResetError;
