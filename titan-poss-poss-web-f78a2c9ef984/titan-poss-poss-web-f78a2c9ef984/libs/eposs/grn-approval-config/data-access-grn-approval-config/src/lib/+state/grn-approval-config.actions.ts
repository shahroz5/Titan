import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GrnApprovalConfigListPayload,
  GrnApprovalConfigList,
  GrnApprovalConfig,
  RoleList
} from '@poss-web/shared/models';

export enum GrnApprovalConfigActionTypes {
  LOAD_GRN_APPROVAL_CONFIG_LIST = '[grn-approval-config] Load GRN Approval Config List',
  LOAD_GRN_APPROVAL_CONFIG_LIST_SUCCESS = '[grn-approval-config] Load GRN Approval Config List Success',
  LOAD_GRN_APPROVAL_CONFIG_LIST_FAILURE = '[grn-approval-config] Load GRN Approval Config List Failure',

  SAVE_GRN_APPROVAL_CONFIG = '[grn-approval-config] Save GRN Approval Config ',
  SAVE_GRN_APPROVAL_CONFIG_SUCCESS = '[grn-approval-config] Save GRN Approval Config Success ',
  SAVE_GRN_APPROVAL_CONFIG_FAILURE = '[grn-approval-config] Save GRN Approval Config Failure ',

  UPDATE_GRN_APPROVAL_CONFIG = '[grn-approval-config] Update GRN Approval Config ',
  UPDATE_GRN_APPROVAL_CONFIG_SUCCESS = '[grn-approval-config] Update GRN Approval Config Success ',
  UPDATE_GRN_APPROVAL_CONFIG_FAILURE = '[grn-approval-config] Update GRN Approval Config Failure ',

  SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE = '[grn-approval-config] Search GRN Approval Config by GRN Type',
  SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_SUCCESS = '[grn-approval-config] Search GRN Approval Config by GRN Type Success',
  SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_FAILURE = '[grn-approval-config] Search GRN Approval Config by GRN Type Failure',

  LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID = '[grn-approval-config] Load GRN Approval Config By Rule Id',
  LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS = '[grn-approval-config] Load GRN Approval Config By Rule Id Success',
  LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_FAILURE = '[grn-approval-config] Load GRN Approval Config By Rule Id Failure',

  LOAD_ROLE_LIST = '[grn-approval-config] Load Role List',
  LOAD_ROLE_LIST_SUCCESS = '[grn-approval-config] Load Role List Success',
  LOAD_ROLE_LIST_FAILURE = '[grn-approval-config] Load Role List Failure',

  LOAD_NEW_GRN_APPROVAL_CONFIG_BY_RULE_ID = '[grn-approval-config] Load New GRN Approval Config By Rule Id',

  LOAD_RESET = '[grn-approval-config] Load Reset'
}

export class LoadGrnApprovalConfigList implements Action {
  readonly type = GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST;
  constructor(public payload: GrnApprovalConfigListPayload) {}
}
export class LoadGrnApprovalConfigListSuccess implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_SUCCESS;
  constructor(public payload: GrnApprovalConfigList) {}
}

export class LoadGrnApprovalConfigListFailure implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveGrnApprovalConfig implements Action {
  readonly type = GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG;
  constructor(public payload: GrnApprovalConfig) {}
}

export class SaveGrnApprovalConfigSuccess implements Action {
  readonly type = GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_SUCCESS;
  constructor(public payload: GrnApprovalConfig) {}
}
export class SaveGrnApprovalConfigFailure implements Action {
  readonly type = GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateGrnApprovalConfig implements Action {
  readonly type = GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG;
  constructor(public payload: GrnApprovalConfig) {}
}
export class UpdateGrnApprovalConfigSuccess implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_SUCCESS;
  constructor(public payload: GrnApprovalConfig) {}
}
export class UpdateGrnApprovalConfigFailure implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchGrnApprovalConfigByGrnType implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE;
  constructor(public payload: string) {}
}
export class SearchGrnApprovalConfigByGrnTypeSuccess implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_SUCCESS;
  constructor(public payload: GrnApprovalConfigList) {}
}
export class SearchGrnApprovalConfigByGrnTypeFailure implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnApprovalConfigByRuleId implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID;
  constructor(public ruleId: any, public ruleType: string) {}
}
export class LoadGrnApprovalConfigByRuleIdSuccess implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS;
  constructor(public payload: GrnApprovalConfig) {}
}
export class LoadGrnApprovalConfigByRuleIdFailure implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewGrnApprovalConfigByRuleId implements Action {
  readonly type =
    GrnApprovalConfigActionTypes.LOAD_NEW_GRN_APPROVAL_CONFIG_BY_RULE_ID;
}

export class LoadRoleList implements Action {
  readonly type = GrnApprovalConfigActionTypes.LOAD_ROLE_LIST;
}
export class LoadRoleListSuccess implements Action {
  readonly type = GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS;
  constructor(public payload: RoleList[]) {}
}

export class LoadRoleListFailure implements Action {
  readonly type = GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = GrnApprovalConfigActionTypes.LOAD_RESET;
}

export type GrnApprovalConfigActions =
  | LoadGrnApprovalConfigList
  | LoadGrnApprovalConfigListSuccess
  | LoadGrnApprovalConfigListFailure
  | LoadGrnApprovalConfigByRuleId
  | LoadGrnApprovalConfigByRuleIdFailure
  | LoadGrnApprovalConfigByRuleIdSuccess
  | UpdateGrnApprovalConfig
  | UpdateGrnApprovalConfigFailure
  | UpdateGrnApprovalConfigSuccess
  | SearchGrnApprovalConfigByGrnType
  | SearchGrnApprovalConfigByGrnTypeSuccess
  | SearchGrnApprovalConfigByGrnTypeFailure
  | SaveGrnApprovalConfig
  | SaveGrnApprovalConfigSuccess
  | SaveGrnApprovalConfigFailure
  | LoadNewGrnApprovalConfigByRuleId
  | LoadReset
  | LoadRoleList
  | LoadRoleListSuccess
  | LoadRoleListFailure;
