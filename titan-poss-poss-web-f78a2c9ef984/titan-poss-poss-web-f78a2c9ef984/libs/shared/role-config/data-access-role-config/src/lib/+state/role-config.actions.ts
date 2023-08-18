import { Action } from '@ngrx/store';

import {
  RoleDetail,
  RoleCountRequest,
  RoleCountRequestListDetail,
  CustomErrors,
  LoadLocationFormatPayload,
  LocationSummaryList
} from '@poss-web/shared/models';

export enum RoleConfigActionTypes {
  LOAD_ROLES_FOR_COUNT = '[ role-config ] Load Roles for Count',
  LOAD_ROLES_FOR_COUNT_SUCCESS = '[ role-config ] Load Roles for Count Success',
  LOAD_ROLES_FOR_COUNT_FAILURE = '[ role-config ] Load Roles for Count Failure',

  LOAD_ROLE_COUNT_REQUEST_LIST = '[ role-config ] Load Role Count Request List',
  LOAD_ROLE_COUNT_REQUEST_LIST_SUCCESS = '[ role-config ] Load Role Count Request List Success',
  LOAD_ROLE_COUNT_REQUEST_LIST_FAILURE = '[ role-config ] Load Role Count Request List Failure',

  RESET_ROLE_COUNT_REQUEST_LIST = '[ role-config ] Reset Role Count Request List',

  LOAD_ROLE_COUNT_REQUEST = '[ role-config ] Load Role Count Request',
  LOAD_ROLE_COUNT_REQUEST_SUCCESS = '[ role-config ] Load Role Count Request Success',
  LOAD_ROLE_COUNT_REQUEST_FAILURE = '[ role-config ] Load Role Count Request Failure',

  CLEAR_ROLE_COUNT_REQUEST = '[ role-config ] CLEAR Role Count Request ',

  CHANGE_ROLE_COUNT = '[ role-config ] Change Role Count',
  CHANGE_ROLE_COUNT_SUCCESS = '[ role-config ] Change Role Count Success',
  CHANGE_ROLE_COUNT_FAILURE = '[ role-config ] Change Role Count Failure',

  LOAD_LOCATION = '[ role-config ] Load Location',
  LOAD_LOCATION_SUCCESS = '[ role-config ] Load Location Success',
  LOAD_LOCATION_FAILURE = '[ role-config ] Load Location Failure',

  LOAD_LOCATION_FORMAT = '[ role-config ] Load Location Format',
  LOAD_LOCATION_FORMAT_SUCCESS = '[ role-config ] Load Location Format Success',
  LOAD_LOCATION_FORMAT_FAILURE = '[ role-config ] Load Location Format Failure',

  LOAD_ROLE_REQUEST_COUNT = '[ role-config ] Load Role Request Count',
  LOAD_ROLE_REQUEST_COUNT_SUCCESS = '[ role-config ] Load Role Request Count Success',
  LOAD_ROLE_REQUEST_COUNT_FAILURE = '[ role-config ] Load Role Request Count Failure'
}

export class ResetRoleCountRequestList implements Action {
  readonly type = RoleConfigActionTypes.RESET_ROLE_COUNT_REQUEST_LIST;
}

export class LoadRoleCountRequestList implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST;
  constructor(
    public readonly payload: {
      pageNumber: number;
      pageSize: number;
      isBTQUser: boolean;
      locationCodes: string[];
      requestSearch: string;
    }
  ) {}
}

export class LoadRoleCountRequestListSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_SUCCESS;
  constructor(public readonly payload: RoleCountRequestListDetail) {}
}

export class LoadRoleCountRequestListFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearRoleCountRequestList implements Action {
  readonly type = RoleConfigActionTypes.CLEAR_ROLE_COUNT_REQUEST;

}

export class LoadRoleCountRequest implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST;
  constructor(
    public readonly payload: { requestId: string; isBTQUser: boolean }
  ) {}
}

export class LoadRoleCountRequestSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_SUCCESS;
  constructor(public readonly payload: any) {}
}

export class LoadRoleCountRequestFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRolesforCount implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT;
  constructor(
    public readonly payload: {
      isBTQUser: boolean;
      roleType?: string;
      locationCode?: string;
      locationFormat?: string;
    }
  ) {}
}

export class LoadRolesforCountSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_SUCCESS;
  constructor(public readonly payload: RoleDetail[]) {}
}

export class LoadRolesforCountFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ChangeRoleCount implements Action {
  readonly type = RoleConfigActionTypes.CHANGE_ROLE_COUNT;
  constructor(
    public readonly payload: {
      remarks?: string;
      rolesCount?: RoleCountRequest[];
      locationCode?: string;
      requestId?: string;
      status?: string;
    }
  ) {}
}

export class ChangeRoleCountSuccess implements Action {
  readonly type = RoleConfigActionTypes.CHANGE_ROLE_COUNT_SUCCESS;
}

export class ChangeRoleCountFailure implements Action {
  readonly type = RoleConfigActionTypes.CHANGE_ROLE_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocation implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION;
}

export class LoadLocationSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION_SUCCESS;
  constructor(public readonly payload: LocationSummaryList[]) {}
}

export class LoadLocationFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationFormat implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION_FORMAT;
}

export class LoadLocationFormatSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION_FORMAT_SUCCESS;
  constructor(public readonly payload: LoadLocationFormatPayload[]) {}
}

export class LoadLocationFormatFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_LOCATION_FORMAT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoleRequestCount implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT;
  constructor(
    public readonly payload: {
      pageNumber: number;
      pageSize: number;
    }
  ) {}
}

export class LoadRoleRequestCountSuccess implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_SUCCESS;
  constructor(public readonly payload: number) {}
}

export class LoadRoleRequestCountFailure implements Action {
  readonly type = RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type RoleConfigActions =
  | LoadRolesforCount
  | LoadRolesforCountSuccess
  | LoadRolesforCountFailure
  | LoadRoleCountRequestList
  | LoadRoleCountRequestListSuccess
  | LoadRoleCountRequestListFailure
  | LoadRoleCountRequest
  | LoadRoleCountRequestSuccess
  | LoadRoleCountRequestFailure
  | ResetRoleCountRequestList
  | ChangeRoleCount
  | ChangeRoleCountSuccess
  | ChangeRoleCountFailure
  | LoadLocation
  | LoadLocationSuccess
  | LoadLocationFailure
  | LoadLocationFormat
  | LoadLocationFormatSuccess
  | LoadLocationFormatFailure
  | LoadRoleRequestCount
  | LoadRoleRequestCountSuccess
  | LoadRoleRequestCountFailure
  | ClearRoleCountRequestList;
