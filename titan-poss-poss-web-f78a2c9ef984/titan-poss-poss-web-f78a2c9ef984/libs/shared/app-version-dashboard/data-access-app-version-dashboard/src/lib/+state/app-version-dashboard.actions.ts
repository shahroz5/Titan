import { Action } from '@ngrx/store';
import {
  AddVersionRequestModel,
  AllAppVersionsList,
  AppVersionByStatusRequestPayloadWithQueryParams,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  CustomErrors,
  SelectDropDownOption
} from '@poss-web/shared/models';

export enum AppVersionDashboardActionTypes {
  GET_APPLICATION_VERSIONS = '[app version dashboard] Load AppVersions',
  GET_APPLICATION_VERSIONS_SUCCESS = '[app version dashboard] Load AppVersions Success',
  GET_APPLICATION_VERSIONS_FAILURE = '[app version dashboard] Load AppVersions Failure',

  LIST_ALL_APPLICATION_VERSIONS = '[app version dashboard] Load All Application versions',
  LIST_ALL_APPLICATION_VERSIONS_SUCCESS = '[app version dashboard] Load All Application versions Success',
  LIST_ALL_APPLICATION_VERSIONS_FAILURE = '[app version dashboard] Load All Application versions Failure',

  GET_APPLICATION_VERSIONS_BY_STATUS = '[app version dashboard] Load AppVersions by Status',
  GET_APPLICATION_VERSIONS_BY_STATUS_SUCCESS = '[app version dashboard] Load AppVersions by Status Success',
  GET_APPLICATION_VERSIONS_BY_STATUS_FAILURE = '[app version dashboard] Load AppVersions by Status Failure',

  GET_APPVERSION_STATUS_LIST = '[app version dashboard] Load AppVersions Status List',
  GET_APPVERSION_STATUS_LIST_SUCCESS = '[app version dashboard] Load AppVersions Status List Success',
  GET_APPVERSION_STATUS_LIST_FAILURE = '[app version dashboard] Load AppVersions Status List Failure',

  ADD_APP_VERSION = '[app version dashboard] Load AppVersion Data',
  ADD_APP_VERSION_SUCCESS = '[app version dashboard] Load AppVersion Data Success',
  ADD_APP_VERSION_FAILURE = '[app version dashboard] Load AppVersion Data Failure',

  PUBLISH_APP_VERSIONS = '[app version dashboard] Publish all App Versions',
  PUBLISH_APP_VERSIONS_SUCCESS = '[app version dashboard] Publish all App Versions Success',
  PUBLISH_APP_VERSIONS_FAILURE = '[app version dashboard] Publish all App Versions Failure',

  DELETE_APP_VERSION_BY_ID = '[app version dashboard] Delete App Version By Id',
  DELETE_APP_VERSION_BY_ID_SUCCESS = '[app version dashboard] Delete App Version By Id Success',
  DELETE_APP_VERSION_BY_ID_FAILURE = '[app version dashboard] Delete App Version By Id Failure',

  RESET = '[app version dashboard] Reset State'
}

export class GetAppVersions implements Action {
  readonly type = AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS;
}
export class GetAppVersionsSuccess implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_SUCCESS;
  constructor(public readonly payload: AppVersionsList) {}
}
export class GetAppVersionsFailure implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ListAllApplicationVersions implements Action {
  readonly type = AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS;
}
export class ListAllApplicationVersionsSuccess implements Action {
  readonly type =
    AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_SUCCESS;
  constructor(public readonly payload: AllAppVersionsList) {}
}
export class ListAllApplicationVersionsFailure implements Action {
  readonly type =
    AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetAppVersionsByStatus implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS;
  constructor(
    public payload: AppVersionByStatusRequestPayloadWithQueryParams
  ) {}
}
export class GetAppVersionsByStatusSuccess implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_SUCCESS;
  constructor(public readonly payload: AppVersionDataByStatusResponse) {}
}
export class GetAppVersionsByStatusFailure implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetStatusList implements Action {
  readonly type = AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST;
}
export class GetStatusListSuccess implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_SUCCESS;
  constructor(public readonly payload: SelectDropDownOption[]) {}
}
export class GetStatusListFailure implements Action {
  readonly type =
    AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddApplicationVersion implements Action {
  readonly type = AppVersionDashboardActionTypes.ADD_APP_VERSION;
  constructor(public readonly payload: AddVersionRequestModel) {}
}
export class AddApplicationVersionSuccess implements Action {
  readonly type = AppVersionDashboardActionTypes.ADD_APP_VERSION_SUCCESS;
  constructor(public readonly payload: any) {}
}

export class AddApplicationVersionFailure implements Action {
  readonly type = AppVersionDashboardActionTypes.ADD_APP_VERSION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PublishAllAppVersions implements Action {
  readonly type = AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS;
}
export class PublishAllAppVersionsSuccess implements Action {
  readonly type = AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_SUCCESS;
}
export class PublishAllAppVersionsFailure implements Action {
  readonly type = AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteAppVersionById implements Action {
  readonly type = AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID;
  constructor(public readonly payload: number) {}
}
export class DeleteAppVersionByIdSuccess implements Action {
  readonly type =
    AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_SUCCESS;
}
export class DeleteAppVersionByIdFailure implements Action {
  readonly type =
    AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class Reset implements Action {
  readonly type = AppVersionDashboardActionTypes.RESET;
}

export type AppVersionDashboardActions =
  | GetAppVersions
  | GetAppVersionsSuccess
  | GetAppVersionsFailure
  | ListAllApplicationVersions
  | ListAllApplicationVersionsSuccess
  | ListAllApplicationVersionsFailure
  | GetAppVersionsByStatus
  | GetAppVersionsByStatusSuccess
  | GetAppVersionsByStatusFailure
  | GetStatusList
  | GetStatusListSuccess
  | GetStatusListFailure
  | AddApplicationVersion
  | AddApplicationVersionSuccess
  | AddApplicationVersionFailure
  | PublishAllAppVersions
  | PublishAllAppVersionsSuccess
  | PublishAllAppVersionsFailure
  | DeleteAppVersionById
  | DeleteAppVersionByIdSuccess
  | DeleteAppVersionByIdFailure
  | Reset;
