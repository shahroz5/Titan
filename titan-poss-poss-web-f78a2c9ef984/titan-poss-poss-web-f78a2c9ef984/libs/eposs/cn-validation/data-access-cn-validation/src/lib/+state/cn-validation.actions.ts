import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CnValidationListPayload,
  CnValidationList,
  CnValidation,
  CnTypeList
} from '@poss-web/shared/models';

export enum CnValidationActionTypes {
  LOAD_CN_VALIDATION_LIST = '[cn-validation] Load CN Validation List',
  LOAD_CN_VALIDATION_LIST_SUCCESS = '[cn-validation] Load CN Validation List Success',
  LOAD_CN_VALIDATION_LIST_FAILURE = '[cn-validation] Load CN Validation List Failure',

  SAVE_CN_VALIDATION = '[cn-validation] Save CN Validation ',
  SAVE_CN_VALIDATION_SUCCESS = '[cn-validation] Save CN Validation Success ',
  SAVE_CN_VALIDATION_FAILURE = '[cn-validation] Save CN Validation Failure ',

  UPDATE_CN_VALIDATION = '[cn-validation] Update CN Validation ',
  UPDATE_CN_VALIDATION_SUCCESS = '[cn-validation] Update CN Validation Success ',
  UPDATE_CN_VALIDATION_FAILURE = '[cn-validation] Update CN Validation Failure ',

  SEARCH_CN_VALIDATION_BY_CN_TYPE = '[cn-validation] Search CN Validation by CN Type',
  SEARCH_CN_VALIDATION_BY_CN_TYPE_SUCCESS = '[cn-validation] Search CN Validation by CN Type Success',
  SEARCH_CN_VALIDATION_BY_CN_TYPE_FAILURE = '[cn-validation] Search CN Validation by CN Type Failure',

  LOAD_CN_VALIDATION_BY_RULE_ID = '[cn-validation] Load CN Validation By Rule Id',
  LOAD_CN_VALIDATION_BY_RULE_ID_SUCCESS = '[cn-validation] Load CN Validation By Rule Id Success',
  LOAD_CN_VALIDATION_BY_RULE_ID_FAILURE = '[cn-validation] Load CN Validation By Rule Id Failure',

  LOAD_CN_TYPE_LIST = '[cn-validation] Load CN Type List',
  LOAD_CN_TYPE_LIST_SUCCESS = '[cn-validation] Load CN Type List Success',
  LOAD_CN_TYPE_LIST_FAILURE = '[cn-validation] Load CN Type List Failure',

  LOAD_NEW_CN_VALIDATION_BY_RULE_ID = '[cn-validation] Load New CN Validation By Rule Id',

  LOAD_RESET = '[cn-validation] Load Reset'
}

export class LoadCnValidationList implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_LIST;
  constructor(public payload: CnValidationListPayload) {}
}
export class LoadCnValidationListSuccess implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_SUCCESS;
  constructor(public payload: CnValidationList) {}
}

export class LoadCnValidationListFailure implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCnValidation implements Action {
  readonly type = CnValidationActionTypes.SAVE_CN_VALIDATION;
  constructor(public payload: CnValidation) {}
}

export class SaveCnValidationSuccess implements Action {
  readonly type = CnValidationActionTypes.SAVE_CN_VALIDATION_SUCCESS;
  constructor(public payload: CnValidation) {}
}
export class SaveCnValidationFailure implements Action {
  readonly type = CnValidationActionTypes.SAVE_CN_VALIDATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCnValidation implements Action {
  readonly type = CnValidationActionTypes.UPDATE_CN_VALIDATION;
  constructor(public payload: CnValidation) {}
}
export class UpdateCnValidationSuccess implements Action {
  readonly type = CnValidationActionTypes.UPDATE_CN_VALIDATION_SUCCESS;
  constructor(public payload: CnValidation) {}
}
export class UpdateCnValidationFailure implements Action {
  readonly type = CnValidationActionTypes.UPDATE_CN_VALIDATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchCnValidationByCnType implements Action {
  readonly type = CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE;
  constructor(public payload: string) {}
}
export class SearchCnValidationByCnTypeSuccess implements Action {
  readonly type =
    CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_SUCCESS;
  constructor(public payload: CnValidationList) {}
}
export class SearchCnValidationByCnTypeFailure implements Action {
  readonly type =
    CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCnValidationByRuleId implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID;
  constructor(public ruleId: any, public ruleType: string) {}
}
export class LoadCnValidationByRuleIdSuccess implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_SUCCESS;
  constructor(public payload: CnValidation) {}
}
export class LoadCnValidationByRuleIdFailure implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewCnValidationByRuleId implements Action {
  readonly type = CnValidationActionTypes.LOAD_NEW_CN_VALIDATION_BY_RULE_ID;
}

export class LoadCnTypeList implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_TYPE_LIST;
}
export class LoadCnTypeListSuccess implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_TYPE_LIST_SUCCESS;
  constructor(public payload: CnTypeList[]) {}
}

export class LoadCnTypeListFailure implements Action {
  readonly type = CnValidationActionTypes.LOAD_CN_TYPE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CnValidationActionTypes.LOAD_RESET;
}

export type CnValidationActions =
  | LoadCnValidationList
  | LoadCnValidationListSuccess
  | LoadCnValidationListFailure
  | LoadCnValidationByRuleId
  | LoadCnValidationByRuleIdFailure
  | LoadCnValidationByRuleIdSuccess
  | UpdateCnValidation
  | UpdateCnValidationFailure
  | UpdateCnValidationSuccess
  | SearchCnValidationByCnType
  | SearchCnValidationByCnTypeSuccess
  | SearchCnValidationByCnTypeFailure
  | SaveCnValidation
  | SaveCnValidationSuccess
  | SaveCnValidationFailure
  | LoadNewCnValidationByRuleId
  | LoadReset
  | LoadCnTypeList
  | LoadCnTypeListSuccess
  | LoadCnTypeListFailure;
