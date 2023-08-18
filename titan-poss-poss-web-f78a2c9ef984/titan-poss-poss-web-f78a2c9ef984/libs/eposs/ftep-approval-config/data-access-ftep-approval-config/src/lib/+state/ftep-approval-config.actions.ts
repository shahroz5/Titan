import { Action } from '@ngrx/store';
import {
  CustomErrors,
  FtepApprovalConfigListPayload,
  FtepApprovalConfigList,
  FtepApprovalConfig,
  RoleList
} from '@poss-web/shared/models';

export enum FtepApprovalConfigActionTypes {
  LOAD_FTEP_APPROVAL_CONFIG_LIST = '[ftep-approval-config] Load FTEP Approval Config List',
  LOAD_FTEP_APPROVAL_CONFIG_LIST_SUCCESS = '[ftep-approval-config] Load FTEP Approval Config List Success',
  LOAD_FTEP_APPROVAL_CONFIG_LIST_FAILURE = '[ftep-approval-config] Load FTEP Approval Config List Failure',

  SAVE_FTEP_APPROVAL_CONFIG = '[ftep-approval-config] Save FTEP Approval Config ',
  SAVE_FTEP_APPROVAL_CONFIG_SUCCESS = '[ftep-approval-config] Save FTEP Approval Config Success ',
  SAVE_FTEP_APPROVAL_CONFIG_FAILURE = '[ftep-approval-config] Save FTEP Approval Config Failure ',

  UPDATE_FTEP_APPROVAL_CONFIG = '[ftep-approval-config] Update FTEP Approval Config ',
  UPDATE_FTEP_APPROVAL_CONFIG_SUCCESS = '[ftep-approval-config] Update FTEP Approval Config Success ',
  UPDATE_FTEP_APPROVAL_CONFIG_FAILURE = '[ftep-approval-config] Update FTEP Approval Config Failure ',

  SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE = '[ftep-approval-config] Search FTEP Approval Config by FTEP Type',
  SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_SUCCESS = '[ftep-approval-config] Search FTEP Approval Config by FTEP Type Success',
  SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_FAILURE = '[ftep-approval-config] Search FTEP Approval Config by FTEP Type Failure',

  LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID = '[ftep-approval-config] Load FTEP Approval Config By Rule Id',
  LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS = '[ftep-approval-config] Load FTEP Approval Config By Rule Id Success',
  LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_FAILURE = '[ftep-approval-config] Load FTEP Approval Config By Rule Id Failure',

  LOAD_ROLE_LIST = '[ftep-approval-config] Load Role List',
  LOAD_ROLE_LIST_SUCCESS = '[ftep-approval-config] Load Role List Success',
  LOAD_ROLE_LIST_FAILURE = '[ftep-approval-config] Load Role List Failure',

  LOAD_NEW_FTEP_APPROVAL_CONFIG_BY_RULE_ID = '[ftep-approval-config] Load New FTEP Approval Config By Rule Id',

  LOAD_RESET = '[ftep-approval-config] Load Reset'
}

export class LoadFtepApprovalConfigList implements Action {
  readonly type = FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST;
  constructor(public payload: FtepApprovalConfigListPayload) {}
}
export class LoadFtepApprovalConfigListSuccess implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_SUCCESS;
  constructor(public payload: FtepApprovalConfigList) {}
}

export class LoadFtepApprovalConfigListFailure implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveFtepApprovalConfig implements Action {
  readonly type = FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG;
  constructor(public payload: FtepApprovalConfig) {}
}

export class SaveFtepApprovalConfigSuccess implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_SUCCESS;
  constructor(public payload: FtepApprovalConfig) {}
}
export class SaveFtepApprovalConfigFailure implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateFtepApprovalConfig implements Action {
  readonly type = FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG;
  constructor(public payload: FtepApprovalConfig) {}
}
export class UpdateFtepApprovalConfigSuccess implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_SUCCESS;
  constructor(public payload: FtepApprovalConfig) {}
}
export class UpdateFtepApprovalConfigFailure implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchFtepApprovalConfigByFtepType implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE;
  constructor(public payload: string) {}
}
export class SearchFtepApprovalConfigByFtepTypeSuccess implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_SUCCESS;
  constructor(public payload: FtepApprovalConfigList) {}
}
export class SearchFtepApprovalConfigByFtepTypeFailure implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFtepApprovalConfigByRuleId implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID;
  constructor(public ruleId: any, public ruleType: string) {}
}
export class LoadFtepApprovalConfigByRuleIdSuccess implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS;
  constructor(public payload: FtepApprovalConfig) {}
}
export class LoadFtepApprovalConfigByRuleIdFailure implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewFtepApprovalConfigByRuleId implements Action {
  readonly type =
    FtepApprovalConfigActionTypes.LOAD_NEW_FTEP_APPROVAL_CONFIG_BY_RULE_ID;
}

export class LoadRoleList implements Action {
  readonly type = FtepApprovalConfigActionTypes.LOAD_ROLE_LIST;
}
export class LoadRoleListSuccess implements Action {
  readonly type = FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS;
  constructor(public payload: RoleList[]) {}
}

export class LoadRoleListFailure implements Action {
  readonly type = FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = FtepApprovalConfigActionTypes.LOAD_RESET;
}

export type FtepApprovalConfigActions =
  | LoadFtepApprovalConfigList
  | LoadFtepApprovalConfigListSuccess
  | LoadFtepApprovalConfigListFailure
  | LoadFtepApprovalConfigByRuleId
  | LoadFtepApprovalConfigByRuleIdFailure
  | LoadFtepApprovalConfigByRuleIdSuccess
  | UpdateFtepApprovalConfig
  | UpdateFtepApprovalConfigFailure
  | UpdateFtepApprovalConfigSuccess
  | SearchFtepApprovalConfigByFtepType
  | SearchFtepApprovalConfigByFtepTypeSuccess
  | SearchFtepApprovalConfigByFtepTypeFailure
  | SaveFtepApprovalConfig
  | SaveFtepApprovalConfigSuccess
  | SaveFtepApprovalConfigFailure
  | LoadNewFtepApprovalConfigByRuleId
  | LoadReset
  | LoadRoleList
  | LoadRoleListSuccess
  | LoadRoleListFailure;
