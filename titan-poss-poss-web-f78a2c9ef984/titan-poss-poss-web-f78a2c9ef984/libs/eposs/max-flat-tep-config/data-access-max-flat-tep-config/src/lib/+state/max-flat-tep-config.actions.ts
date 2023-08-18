import { Action } from '@ngrx/store';
import {
  CustomErrors,
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';

export enum MaxFlatTepConfigActionTypes {
  LOAD_MAX_FLAT_TEP_CONFIG = '[MAX FLAT TEP CONFIG] Load Max Flat Tep Config',
  LOAD_MAX_FLAT_TEP_CONFIG_SUCCESS = '[MAX FLAT TEP CONFIG] Load Max Flat Tep Config Success',
  LOAD_MAX_FLAT_TEP_CONFIG_FAILURE = '[MAX FLAT TEP CONFIG] Load Max Flat Tep Config Failure',
  UPDATE_MAX_FLAT_TEP_CONFIG = '[MAX FLAT TEP CONFIG] Update Max Flat Tep Config',
  UPDATE_MAX_FLAT_TEP_CONFIG_SUCCESS = '[MAX FLAT TEP CONFIG] Update Max Flat Tep Config Success',
  UPDATE_MAX_FLAT_TEP_CONFIG_FAILURE = '[MAX FLAT TEP CONFIG] Update Max Flat Tep Config Failure',
  RESET_DATA = '[MAX FLAT TEP CONFIG] Reset Data'
}

export class LoadMaxFlatTepConfig implements Action {
  readonly type = MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG;

}

export class LoadMaxFlatTepConfigSuccess implements Action {
  readonly type = MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_SUCCESS;
  constructor(readonly payload: MaxFlatTepConfigDetails) {}
}

export class LoadMaxFlatTepConfigFailure implements Action {
  readonly type = MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateMaxFlatTepConfig implements Action {
  readonly type = MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG;
  constructor(
    readonly configId: string,
    readonly payload: MaxFlatValuePatchPayload
  ) {}
}

export class UpdateMaxFlatTepConfigSuccess implements Action {
  readonly type =
    MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_SUCCESS;
  constructor(readonly payload: MaxFlatTepConfigDetails) {}
}

export class UpdateMaxFlatTepConfigFailure implements Action {
  readonly type =
    MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetData implements Action {
  readonly type = MaxFlatTepConfigActionTypes.RESET_DATA;

}

export type MaxFlatTepConfigActions =
  | LoadMaxFlatTepConfig
  | LoadMaxFlatTepConfigSuccess
  | LoadMaxFlatTepConfigFailure
  | UpdateMaxFlatTepConfig
  | UpdateMaxFlatTepConfigSuccess
  | UpdateMaxFlatTepConfigFailure
  | ResetData;
