import { Action } from '@ngrx/store';
import { CustomErrors, UpdateFieldValuePayload } from '@poss-web/shared/models';

export enum AmendmentConfigurationActionTypes {
  SAVE_AMENDMENT_CONFIGURATION = '[Amendment-configuration] Save Inv Global Configuration',
  SAVE_AMENDMENT_CONFIGURATION_SUCCESS = '[Amendment-configuration] Save Inv Global Configuration Success',
  SAVE_AMENDMENT_CONFIGURATION_FAILURE = '[Amendment-configuration] Save Inv Global Configuration Failure',

  LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE = '[Amendment-configuration] Load Inv Global Configuration Filed Value',
  LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_SUCCESS = '[Amendment-configuration] Load Inv Global Configuration Filed Value Success',
  LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_FAILURE = '[Amendment-configuration] Load Inv Global Configuration Filed Value Failure',

  LOAD_RESET = '[Amendment-configuration] Load Reset'
}

export class SaveAmendmentConfiguration implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION;
  constructor(public payload: UpdateFieldValuePayload) {}
}
export class SaveAmendmentConfigurationSuccess implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_SUCCESS;
  constructor(public payload: number) {}
}
export class SaveAmendmentConfigurationFailure implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAmendmentConfigurationFiledValue implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE;
}
export class LoadAmendmentConfigurationFiledValueSuccess implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadAmendmentConfigurationFiledValueFailure implements Action {
  readonly type =
    AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = AmendmentConfigurationActionTypes.LOAD_RESET;
}

export type AmendmentConfigurationActions =
  | LoadAmendmentConfigurationFiledValue
  | LoadAmendmentConfigurationFiledValueSuccess
  | LoadAmendmentConfigurationFiledValueFailure
  | SaveAmendmentConfiguration
  | SaveAmendmentConfigurationSuccess
  | SaveAmendmentConfigurationFailure
  | LoadReset;
