import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TransactionDetails,
  TransactionCount,
  MetalPrice,
  TransactionListCountPayload,
  TransactionListPayload,
  ToolbarConfig
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum ToolbarActionTypes {
  LOAD_METAL_PRICE_DETAILS = '[Toolbar]Load Material Price Details',
  LOAD_METAL_PRICE_DETAILS_SUCCESS = '[Toolbar]Load Material Price Details Success',
  LOAD_METAL_PRICE_DETAILS_FAILURE = '[Toolbar]Load Material Price Details Failure',

  LOAD_OPENORDERS = '[Toolbar] Load Open Orders',
  LOAD_OPENORDERS_SUCCESS = '[Toolbar] Load Open Orders Success',
  LOAD_OPENORDERS_FAILURE = '[Toolbar] Load Open Orders Failure',

  LOAD_OPENORDERS_COUNT = '[Toolbar]Load Open Orders count',
  LOAD_OPENORDERS_COUNT_SUCCESS = '[Toolbar] Load Open Orders count Success',
  LOAD_OPENORDERS_COUNT_FAILURE = '[Toolbar] Load Open Orders count Failure',

  LOAD_ONHOLD = '[Toolbar] Load On Hold',
  LOAD_ONHOLD_SUCCESS = '[Toolbar] Load On Hold Success',
  LOAD_ONHOLD_FAILURE = '[Toolbar] Load On Hold Failure',

  LOAD_ONHOLD_COUNT = '[Toolbar]Load On Hold count',
  LOAD_ONHOLD_COUNT_SUCCESS = '[Toolbar] Load On Hold count Success',
  LOAD_ONHOLD_COUNT_FAILURE = '[Toolbar] Load On Hold count Failure',

  LOAD_CONFIRMORDERS = '[Toolbar] Load Confirm Orders',
  LOAD_CONFIRMORDERS_SUCCESS = '[Toolbar] Load Confirm Orders Success',
  LOAD_CONFIRMORDERS_FAILURE = '[Toolbar] Load Confirm Orders Failure',

  RESET_OPENORDERS = '[Toolbar] Reset Open Orders',
  RESET_ONHOLD = '[Toolbar] Reset On Hold',
  RESET_VALUES = '[Toolbar] Reset Values',
  RESET_CONFIRMORDERS = '[Toolbar] Reset Confirm Orders',

  SET_TOOLBAR_CONFIG = '[Toolbar] Set Toolbar Config',
  GET_TOOLBAR_CONFIG = '[Toolbar] Get Toolbar Config'
}

export class LoadMetalPriceDetails implements Action {
  readonly type = ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS;
}
export class LoadMetalPriceDetailsSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: MetalPrice[]) {}
}
export class LoadMetalPriceDetailsFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOpenOrders implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS;
  constructor(public payload: TransactionListPayload) {}
}
export class LoadOpenOrdersSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS_SUCCESS;
  constructor(public payload: TransactionDetails[]) {}
}
export class LoadOpenOrdersFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOpenOrdersCount implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS_COUNT;
  constructor(public payload: TransactionListCountPayload) {}
}
export class LoadOpenOrdersCountSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS_COUNT_SUCCESS;
  constructor(public payload: TransactionCount[]) {}
}
export class LoadOpenOrdersCountFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_OPENORDERS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOnHold implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD;
  constructor(public payload: TransactionListPayload) {}
}
export class LoadOnHoldSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD_SUCCESS;
  constructor(public payload: TransactionDetails[]) {}
}
export class LoadOnHoldFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOnHoldCount implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD_COUNT;
  constructor(public payload: TransactionListCountPayload) {}
}
export class LoadOnHoldCountSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD_COUNT_SUCCESS;
  constructor(public payload: TransactionCount[]) {}
}
export class LoadOnHoldCountFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_ONHOLD_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadConfirmOrders implements Action {
  readonly type = ToolbarActionTypes.LOAD_CONFIRMORDERS;
  constructor(public payload: TransactionListPayload) {}
}
export class LoadConfirmOrdersSuccess implements Action {
  readonly type = ToolbarActionTypes.LOAD_CONFIRMORDERS_SUCCESS;
  constructor(public payload: TransactionDetails[]) {}
}
export class LoadConfirmOrdersFailure implements Action {
  readonly type = ToolbarActionTypes.LOAD_CONFIRMORDERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetOpenOrders implements Action {
  readonly type = ToolbarActionTypes.RESET_OPENORDERS;
}
export class ResetOnHold implements Action {
  readonly type = ToolbarActionTypes.RESET_ONHOLD;
}
export class ResetValues implements Action {
  readonly type = ToolbarActionTypes.RESET_VALUES;
}
export class ResetConfirmOrders implements Action {
  readonly type = ToolbarActionTypes.RESET_CONFIRMORDERS;
}

export class SetToolbarConfig implements Action {
  readonly type = ToolbarActionTypes.SET_TOOLBAR_CONFIG;
  constructor(public payload: ToolbarConfig) {}
}

export class GetToolbarConfig implements Action {
  readonly type = ToolbarActionTypes.GET_TOOLBAR_CONFIG;
  constructor(public payload: ToolbarConfig) {}
}

export type ToolbarActions =
  | LoadMetalPriceDetails
  | LoadMetalPriceDetailsSuccess
  | LoadMetalPriceDetailsFailure
  | LoadOpenOrders
  | LoadOpenOrdersSuccess
  | LoadOpenOrdersFailure
  | LoadOpenOrdersCount
  | LoadOpenOrdersCountSuccess
  | LoadOpenOrdersCountFailure
  | LoadOnHold
  | LoadOnHoldSuccess
  | LoadOnHoldFailure
  | LoadOnHoldCount
  | LoadOnHoldCountSuccess
  | LoadOnHoldCountFailure
  | LoadConfirmOrders
  | LoadConfirmOrdersSuccess
  | LoadConfirmOrdersFailure
  | ResetOpenOrders
  | ResetOnHold
  | ResetValues
  | ResetConfirmOrders
  | SetToolbarConfig
  | GetToolbarConfig;
