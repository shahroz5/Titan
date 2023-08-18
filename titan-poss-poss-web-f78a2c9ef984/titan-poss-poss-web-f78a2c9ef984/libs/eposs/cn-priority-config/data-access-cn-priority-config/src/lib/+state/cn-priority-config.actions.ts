import { Action } from '@ngrx/store';
import {
  CnPriorityConfig,
  CnPriorityConfigList,
  CnPriorityConfigListPayload,
  CnPriorityConfigResponse,
  CnTypeList,
  CustomErrors
} from '@poss-web/shared/models';

export enum CnPriorityConfigActionTypes {
  LOAD_CN_PRIORITY_CONFIG_LIST = '[cn-priority-config] Load Cn Priority Config List',
  LOAD_CN_PRIORITY_CONFIG_LIST_SUCCESS = '[cn-priority-config] Load Cn Priority Config List Success',
  LOAD_CN_PRIORITY_CONFIG_LIST_FAILURE = '[cn-priority-config] Load Cn Priority Config List Failure',

  SAVE_CN_PRIORITY_CONFIG = '[cn-priority-config] Save Cn Priority Config ',
  SAVE_CN_PRIORITY_CONFIG_SUCCESS = '[cn-priority-config] Save Cn Priority Config Success ',
  SAVE_CN_PRIORITY_CONFIG_FAILURE = '[cn-priority-config] Save Cn Priority Config Failure ',

  UPDATE_CN_PRIORITY_CONFIG = '[cn-priority-config] Update Cn Priority Config ',
  UPDATE_CN_PRIORITY_CONFIG_SUCCESS = '[cn-priority-config] Update Cn Priority Config Success ',
  UPDATE_CN_PRIORITY_CONFIG_FAILURE = '[cn-priority-config] Update Cn Priority Config Failure ',

  SEARCH_CONFIG_BY_CONFIG_NAME = '[cn-priority-config] Search Config by Config Name',
  SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS = '[cn-priority-config] Search Config by Config Name Success',
  SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE = '[cn-priority-config] Search Config by Config Name Failure',

  LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID = '[cn-priority-config] Load Cn Priority Config By Config Id',
  LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_SUCCESS = '[cn-priority-config] Load Cn Priority Config By Config Id Success',
  LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_FAILURE = '[cn-priority-config] Load Cn Priority Config By Config Id Failure',

  LOAD_CN_TYPE_LIST = '[cn-priority-config] Load CN Type List',
  LOAD_CN_TYPE_LIST_SUCCESS = '[cn-priority-config] Load CN Type List Success',
  LOAD_CN_TYPE_LIST_FAILURE = '[cn-priority-config] Load CN Type List Failure',

  LOAD_NEW_CN_PRIORITY_CONFIG_BY_CONFIG_ID = '[cn-priority-config] Load New Cn Priority Config By Config Id',

  LOAD_RESET = '[cn-priority-config] Load Reset'
}

export class LoadCnPriorityConfigList implements Action {
  readonly type = CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST;
  constructor(public payload: CnPriorityConfigListPayload) {}
}
export class LoadCnPriorityConfigListSuccess implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_SUCCESS;
  constructor(public payload: CnPriorityConfigList) {}
}

export class LoadCnPriorityConfigListFailure implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCnPriorityConfig implements Action {
  readonly type = CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG;
  constructor(public payload: CnPriorityConfig) {}
}

export class SaveCnPriorityConfigSuccess implements Action {
  readonly type = CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_SUCCESS;
  constructor(public payload: CnPriorityConfigResponse) {}
}
export class SaveCnPriorityConfigFailure implements Action {
  readonly type = CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCnPriorityConfig implements Action {
  readonly type = CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG;
  constructor(public payload: CnPriorityConfig) {}
}
export class UpdateCnPriorityConfigSuccess implements Action {
  readonly type = CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_SUCCESS;
  constructor(public payload: CnPriorityConfigResponse) {}
}
export class UpdateCnPriorityConfigFailure implements Action {
  readonly type = CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchConfigByConfigName implements Action {
  readonly type = CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigByConfigNameSuccess implements Action {
  readonly type =
    CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS;
  constructor(public payload: CnPriorityConfigList) {}
}
export class SearchConfigByConfigNameFailure implements Action {
  readonly type =
    CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCnPriorityConfigByConfigId implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID;
  constructor(public payload: string) {}
}
export class LoadCnPriorityConfigByConfigIdSuccess implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: CnPriorityConfigResponse) {}
}
export class LoadCnPriorityConfigByConfigIdFailure implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewCnPriorityConfigByConfigId implements Action {
  readonly type =
    CnPriorityConfigActionTypes.LOAD_NEW_CN_PRIORITY_CONFIG_BY_CONFIG_ID;
}

export class LoadCnTypeList implements Action {
  readonly type = CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST;
}
export class LoadCnTypeListSuccess implements Action {
  readonly type = CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_SUCCESS;
  constructor(public payload: CnTypeList[]) {}
}

export class LoadCnTypeListFailure implements Action {
  readonly type = CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CnPriorityConfigActionTypes.LOAD_RESET;
}

export type CnPriorityConfigActions =
  | LoadCnPriorityConfigList
  | LoadCnPriorityConfigListSuccess
  | LoadCnPriorityConfigListFailure
  | LoadCnPriorityConfigByConfigId
  | LoadCnPriorityConfigByConfigIdFailure
  | LoadCnPriorityConfigByConfigIdSuccess
  | UpdateCnPriorityConfig
  | UpdateCnPriorityConfigFailure
  | UpdateCnPriorityConfigSuccess
  | SearchConfigByConfigName
  | SearchConfigByConfigNameSuccess
  | SearchConfigByConfigNameFailure
  | SaveCnPriorityConfigFailure
  | SaveCnPriorityConfigSuccess
  | SaveCnPriorityConfig
  | LoadReset
  | LoadCnTypeList
  | LoadCnTypeListSuccess
  | LoadCnTypeListFailure;
