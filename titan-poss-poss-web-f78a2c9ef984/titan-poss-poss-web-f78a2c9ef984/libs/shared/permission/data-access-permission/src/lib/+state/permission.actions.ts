import { Action } from '@ngrx/store';
import {
  AclUrlPermissionRequestBody,
  CustomErrors,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';

export enum PermissionActionTypes {
  LOAD_ELEMENT_PERMISSIONS_FOR_URL = '[ permission ] Load Element Permissions For Url',
  LOAD_ELEMENT_PERMISSIONS_FOR_URL_SUCCESS = '[ permission ] Load Element Permissions For Url Success',
  LOAD_ELEMENT_PERMISSIONS_FOR_URL_FAILURE = '[ permission ] Load Element Permissions For Url Failure',

  LOAD_URL_PERMISSIONS = '[ permission ] Load Url Permissions',
  LOAD_URL_PERMISSIONS_SUCCESS = '[ permission ] Load Url Permissions Success',
  LOAD_URL_PERMISSIONS_FAILURE = '[ permission ] Load Url Permissions Failure',

  LOAD_URL_SUGGESTION = '[ permission ] Load Url Suggestion',
  LOAD_URL_SUGGESTION_SUCCESS = '[ permission ] Load Url Suggestion Success',
  LOAD_URL_SUGGESTION_FAILURE = '[ permission ] Load Url Suggestion Failure'
}

export class LoadElementPermissionsForUrl implements Action {
  readonly type = PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL;
  constructor(public readonly payload: string) {}
}

export class LoadElementPermissionsForUrlSuccess implements Action {
  readonly type =
    PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_SUCCESS;
  constructor(public readonly payload: ElementLevelPermissionItemModel[]) {}
}

export class LoadElementPermissionsForUrlFailure implements Action {
  readonly type =
    PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadUrlPermissions implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_PERMISSIONS;
  constructor(public readonly payload: AclUrlPermissionRequestBody) {}
}

export class LoadUrlPermissionsSuccess implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_PERMISSIONS_SUCCESS;
  constructor(public readonly payload: TransactionCodesModel[]) {}
}

export class LoadUrlPermissionsFailure implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_PERMISSIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadUrlSuggestion implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_SUGGESTION;
  constructor(public readonly payload: string) {}
}

export class LoadUrlSuggestionSuccess implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_SUGGESTION_SUCCESS;
  constructor(public readonly payload: string[]) {}
}

export class LoadUrlSuggestionFailure implements Action {
  readonly type = PermissionActionTypes.LOAD_URL_SUGGESTION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type PermissionActions =
  | LoadElementPermissionsForUrl
  | LoadElementPermissionsForUrlSuccess
  | LoadElementPermissionsForUrlFailure
  | LoadUrlPermissions
  | LoadUrlPermissionsSuccess
  | LoadUrlPermissionsFailure
  | LoadUrlSuggestion
  | LoadUrlSuggestionSuccess
  | LoadUrlSuggestionFailure;
