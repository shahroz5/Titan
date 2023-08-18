import { Action } from '@ngrx/store';
import {
  CustomErrors,
  IbtConfigurationListPayload,
  IbtConfigurationList,
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';

export enum IbtConfigurationActionTypes {
  LOAD_IBT_CONFIGURATION_LIST = '[ibt-configuration] Load Ibt Configuration List',
  LOAD_IBT_CONFIGURATION_LIST_SUCCESS = '[ibt-configuration] Load Ibt Configuration List Success',
  LOAD_IBT_CONFIGURATION_LIST_FAILURE = '[ibt-configuration] Load Ibt Configuration List Failure',

  SAVE_IBT_CONFIGURATION = '[ibt-configuration] Save Ibt Configuration ',
  SAVE_IBT_CONFIGURATION_SUCCESS = '[ibt-configuration] Save Ibt Configuration Success ',
  SAVE_IBT_CONFIGURATION_FAILURE = '[ibt-configuration] Save Ibt Configuration Failure ',

  UPDATE_IBT_CONFIGURATION = '[ibt-configuration] Update Ibt Configuration ',
  UPDATE_IBT_CONFIGURATION_SUCCESS = '[ibt-configuration] Update Ibt Configuration Success ',
  UPDATE_IBT_CONFIGURATION_FAILURE = '[ibt-configuration] Update Ibt Configuration Failure ',

  SEARCH_CONFIG_BY_CONFIG_NAME = '[ibt-configuration] Search Config by Config Name',
  SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS = '[ibt-configuration] Search Config by Config Name Success',
  SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE = '[ibt-configuration] Search Config by Config Name Failure',

  LOAD_IBT_CONFIGURATION_BY_CONFIG_ID = '[ibt-configuration] Load Ibt Configuration By Config Id',
  LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_SUCCESS = '[ibt-configuration] Load Ibt Configuration By Config Id Success',
  LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_FAILURE = '[ibt-configuration] Load Ibt Configuration By Config Id Failure',

  LOAD_NEW_IBT_CONFIGURATION_BY_CONFIG_ID = '[ibt-configuration] Load New Ibt Configuration By Config Id',

  LOAD_RESET = '[ibt-configuration] Load Reset',
  CLEAR_SEARCH = '[ibt-configuration] Clear Search'
}

export class LoadIbtConfigurationList implements Action {
  readonly type = IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST;
  constructor(public payload: IbtConfigurationListPayload) {}
}
export class LoadIbtConfigurationListSuccess implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_SUCCESS;
  constructor(public payload: IbtConfigurationList) {}
}

export class LoadIbtConfigurationListFailure implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveIbtConfiguration implements Action {
  readonly type = IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION;
  constructor(public payload: IbtConfiguration) {}
}

export class SaveIbtConfigurationSuccess implements Action {
  readonly type = IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_SUCCESS;
  constructor(public payload: IbtConfigurationResponse) {}
}
export class SaveIbtConfigurationFailure implements Action {
  readonly type = IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateIbtConfiguration implements Action {
  readonly type = IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION;
  constructor(public payload: IbtConfiguration) {}
}
export class UpdateIbtConfigurationSuccess implements Action {
  readonly type = IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_SUCCESS;
  constructor(public payload: IbtConfigurationResponse) {}
}
export class UpdateIbtConfigurationFailure implements Action {
  readonly type = IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchConfigByConfigName implements Action {
  readonly type = IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigByConfigNameSuccess implements Action {
  readonly type =
    IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS;
  constructor(public payload: IbtConfigurationList) {}
}
export class SearchConfigByConfigNameFailure implements Action {
  readonly type =
    IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIbtConfigurationByConfigId implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID;
  constructor(public payload: string) {}
}
export class LoadIbtConfigurationByConfigIdSuccess implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: IbtConfigurationResponse) {}
}
export class LoadIbtConfigurationByConfigIdFailure implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewIbtConfigurationByConfigId implements Action {
  readonly type =
    IbtConfigurationActionTypes.LOAD_NEW_IBT_CONFIGURATION_BY_CONFIG_ID;
}

export class LoadReset implements Action {
  readonly type = IbtConfigurationActionTypes.LOAD_RESET;
}

export class ClearSearch implements Action {
  readonly type = IbtConfigurationActionTypes.CLEAR_SEARCH;
}

export type IbtConfigurationActions =
  | LoadIbtConfigurationList
  | LoadIbtConfigurationListSuccess
  | LoadIbtConfigurationListFailure
  | LoadIbtConfigurationByConfigId
  | LoadIbtConfigurationByConfigIdFailure
  | LoadIbtConfigurationByConfigIdSuccess
  | UpdateIbtConfiguration
  | UpdateIbtConfigurationFailure
  | UpdateIbtConfigurationSuccess
  | SearchConfigByConfigName
  | SearchConfigByConfigNameSuccess
  | SearchConfigByConfigNameFailure
  | SaveIbtConfigurationFailure
  | SaveIbtConfigurationSuccess
  | SaveIbtConfiguration
  | LoadReset
  | ClearSearch;
