import {
  CustomErrors,
  InvglobalConfigurationFiledValue,
  UpdateFieldValuePayload,
  InvglobalConfiguration
} from '@poss-web/shared/models';

import { Action } from '@ngrx/store';

export enum InvGlobalConfigurationActionTypes {
  LOAD_INV_GLOBAL_CONFIGURATION_LIST = '[global-configuration] Load Inv Global Configuration List ',
  LOAD_INV_GLOBAL_CONFIGURATION_LIST_SUCCESS = '[global-configuration] Load Inv Global Configuration List Success',
  LOAD_INV_GLOBAL_CONFIGURATION_LIST_FAILURE = '[global-configuration] Load Inv Global Configuration  List Failure',

  SAVE_INV_GLOBAL_CONFIGURATION = '[global-configuration] Save Inv Global Configuration',
  SAVE_INV_GLOBAL_CONFIGURATION_SUCCESS = '[global-configuration] Save Inv Global Configuration Success',
  SAVE_INV_GLOBAL_CONFIGURATION_FAILURE = '[global-configuration] Save Inv Global Configuration Failure',

  LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE = '[global-configuration] Load Inv Global Configuration Filed Value',
  LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_SUCCESS = '[global-configuration] Load Inv Global Configuration Filed Value Success',
  LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_FAILURE = '[global-configuration] Load Inv Global Configuration Filed Value Failure',

  UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE = '[global-configuration] Update Inv Global Configuration Field Value',
  UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_SUCCESS = '[global-configuration] Update Inv Global Configuration Field Value Success',
  UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_FAILURE = '[global-configuration] Update Inv Global Configuration Field Value Failure',

  LOAD_RESET = '[global-configuration] Load Reset'
}

export class SaveInvGlobalConfiguration implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION;
}
export class SaveInvGlobalConfigurationSuccess implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_SUCCESS;
  constructor(public payload: InvglobalConfiguration[]) {}
}
export class SaveInvGlobalConfigurationFailure implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadInvGlobalConfigurationList implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST;

}
export class LoadInvGlobalConfigurationListSuccess implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_SUCCESS;
  constructor(public payload: InvglobalConfiguration[]) {}
}
export class LoadInvGlobalConfigurationListFailure implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadInvGlobalConfigurationFiledValue implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE;
  constructor(public payload: string) {}
}
export class LoadInvGlobalConfigurationFiledValueSuccess implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_SUCCESS;
  constructor(public payload: InvglobalConfigurationFiledValue) {}
}
export class LoadInvGlobalConfigurationFiledValueFailure implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateInvGlobalConfigurationFieldValue implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE;
  constructor(public payload: UpdateFieldValuePayload) {}
}
export class UpdateInvGlobalConfigurationFieldValueSuccess implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_SUCCESS;
  constructor(public payload: InvglobalConfigurationFiledValue) {}
}
export class UpdateInvGlobalConfigurationFieldValueFailure implements Action {
  readonly type =
    InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadReset implements Action {
  readonly type = InvGlobalConfigurationActionTypes.LOAD_RESET;
}

export type InvGlobalConfigurationActions =
  | LoadInvGlobalConfigurationFiledValue
  | LoadInvGlobalConfigurationFiledValueSuccess
  | LoadInvGlobalConfigurationFiledValueFailure
  | UpdateInvGlobalConfigurationFieldValue
  | UpdateInvGlobalConfigurationFieldValueSuccess
  | UpdateInvGlobalConfigurationFieldValueFailure
  | LoadInvGlobalConfigurationList
  | LoadInvGlobalConfigurationListSuccess
  | LoadInvGlobalConfigurationListFailure
  | SaveInvGlobalConfiguration
  | SaveInvGlobalConfigurationSuccess
  | SaveInvGlobalConfigurationFailure
  | LoadReset;
