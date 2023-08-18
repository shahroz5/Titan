import { Action } from '@ngrx/store';

import {
  RoleDetail,
  CustomErrors,
  RoleRequest,
  RolesPage,
  RoleData,
  RoleTypesData
} from '@poss-web/shared/models';

export enum RoleManagementActionTypes {
  LOAD_ROLES = '[ role-management ] Load Roles',
  LOAD_ROLES_SUCCESS = '[ role-management ] Load Roles Success',
  LOAD_ROLES_FAILURE = '[ role-management ] Load Roles Failure',

  LOAD_ROLE_TYPES = '[ role-management ] Load Role Types',
  LOAD_ROLE_TYPES_SUCCESS = '[ role-management ] Load Role Types Success',
  LOAD_ROLE_TYPES_FAILURE = '[ role-management ] Load Role Types Failure',

  UPDATE_ROLE = '[ role-management ] Update Role',
  UPDATE_ROLE_SUCCESS = '[ role-management ] Update Role Success',
  UPDATE_ROLE_FAILURE = '[ role-management ] Update Role Failure',

  ADD_ROLE = '[ role-management ] Add Role',
  ADD_ROLE_SUCCESS = '[ role-management ] Add Role Success',
  ADD_ROLE_FAILURE = '[ role-management ] Add Role Failure',

  CLEAR_SEARCHED_ROLES = '[user-management ] Clear Searched Roles',

  FETCH_ROLE = '[ role-management ] Fetch Role',
  FETCH_ROLE_SUCCESS = '[ role-management ] Fetch Role Success',
  FETCH_ROLE_FAILURE = '[ role-management ] Fetch Role Failure',

  LOAD_LOCATION_FORMAT = '[ role-management ] Load Location Format',
  LOAD_LOCATION_FORMAT_SUCCESS = '[ role-management ] Load Location Format Success',
  LOAD_LOCATION_FORMAT_FAILURE = '[ role-management ] Load Location Format Failure'
}

export class FetchRole implements Action {
  readonly type = RoleManagementActionTypes.FETCH_ROLE;
  constructor(public readonly payload: string) {}
}

export class FetchRoleSuccess implements Action {
  readonly type = RoleManagementActionTypes.FETCH_ROLE_SUCCESS;
  constructor(public readonly payload: RoleDetail) {}
}

export class FetchRoleFailure implements Action {
  readonly type = RoleManagementActionTypes.FETCH_ROLE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoles implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLES;
  constructor(public readonly payload: RolesPage) {}
}

export class LoadRolesSuccess implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLES_SUCCESS;
  constructor(public readonly payload: RoleData) {}
}

export class LoadRolesFailure implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoleTypes implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLE_TYPES;
}

export class ClearSearchedRoles implements Action {
  readonly type = RoleManagementActionTypes.CLEAR_SEARCHED_ROLES;
}
export class LoadRoleTypesSuccess implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS;
  constructor(public readonly payload: RoleTypesData[]) {}
}

export class LoadRoleTypesFailure implements Action {
  readonly type = RoleManagementActionTypes.LOAD_ROLE_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRole implements Action {
  readonly type = RoleManagementActionTypes.UPDATE_ROLE;
  constructor(public readonly payload: RoleRequest) {}
}

export class UpdateRoleSuccess implements Action {
  readonly type = RoleManagementActionTypes.UPDATE_ROLE_SUCCESS;
  constructor(public readonly payload: string) {}
}

export class UpdateRoleFailure implements Action {
  readonly type = RoleManagementActionTypes.UPDATE_ROLE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddRole implements Action {
  readonly type = RoleManagementActionTypes.ADD_ROLE;
  constructor(public readonly payload: any) {}
}

export class AddRoleSuccess implements Action {
  readonly type = RoleManagementActionTypes.ADD_ROLE_SUCCESS;
  constructor(public readonly payload: string) {}
}

export class AddRoleFailure implements Action {
  readonly type = RoleManagementActionTypes.ADD_ROLE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationFormat implements Action {
  readonly type = RoleManagementActionTypes.LOAD_LOCATION_FORMAT;
}

export class LoadLocationFormatSuccess implements Action {
  readonly type = RoleManagementActionTypes.LOAD_LOCATION_FORMAT_SUCCESS;
  constructor(public readonly payload: Map<string, string>) {}
}

export class LoadLocationFormatFailure implements Action {
  readonly type = RoleManagementActionTypes.LOAD_LOCATION_FORMAT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type RoleManagementActions =
  | LoadRoles
  | LoadRolesSuccess
  | LoadRolesFailure
  | LoadRoleTypes
  | LoadRoleTypesSuccess
  | LoadRoleTypesFailure
  | UpdateRole
  | UpdateRoleSuccess
  | UpdateRoleFailure
  | AddRole
  | AddRoleSuccess
  | AddRoleFailure
  | FetchRole
  | FetchRoleSuccess
  | FetchRoleFailure
  | LoadLocationFormat
  | LoadLocationFormatSuccess
  | LoadLocationFormatFailure
  | ClearSearchedRoles;
