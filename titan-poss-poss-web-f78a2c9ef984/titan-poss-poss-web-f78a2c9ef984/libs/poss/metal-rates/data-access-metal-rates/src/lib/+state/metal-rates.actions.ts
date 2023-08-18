import { Action } from '@ngrx/store';
import {
  CustomErrors,
  MetalRateUpdateRequestPayload
} from '@poss-web/shared/models';

export enum MetalRatesActionTypes {
  LOAD_BOD_BUSINESS_DATE = '[Metal Rates] Load Business date',
  LOAD_BOD_BUSINESS_DATE_SUCCESS = '[Metal Rates] Load Business date Success',
  LOAD_BOD_BUSINESS_DATE_FAILURE = '[Metal Rates] Load Business date failure',
  LOAD_EOD_BUSINESS_DATE = '[Metal Rates] Load EOD Business date',
  LOAD_EOD_BUSINESS_DATE_SUCCESS = '[Metal Rates] Load EOD Business date Success',
  LOAD_EOD_BUSINESS_DATE_FAILURE = '[Metal Rates] Load EOD Business date Failure',

  LOAD_AVAILABLE_METAL_RATES = '[Metal Rates] Load Available Metal Rates',
  LOAD_AVAILABLE_METAL_RATES_SUCCESS = '[Metal Rates] Load Available Metal Rates Success',
  LOAD_AVAILABLE_METAL_RATES_FAILURE = '[Metal Rates] Load Available Metal Rates Failure',
  SAVE_METAL_RATES = '[Metal Rates] Save Metal Rates',
  SAVE_METAL_RATES_SUCCESS = '[Metal Rates] Save Metal Rates Success',
  SAVE_METAL_RATES_FAILURE = '[Metal Rates] Save Metal Rates Failure',
  RESET = '[Metal Rates] Reset State'
}

export class LoadBodBusinessDate implements Action {
  readonly type = MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE;
}
export class LoadBodBusinessDateSuccess implements Action {
  readonly type = MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_SUCCESS;
  constructor(readonly payload: number) {}
}
export class LoadBodBusinessDateFailure implements Action {
  readonly type = MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadEodBusinessDate implements Action {
  readonly type = MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE;
}
export class LoadEodBusinessDateSuccess implements Action {
  readonly type = MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS;
  constructor(readonly payload: number) {}
}
export class LoadEodBusinessDateFailure implements Action {
  readonly type = MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadAvailableMetalRates implements Action {
  readonly type = MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES;
  constructor(readonly payload: number) {}
}
export class LoadAvailableMetalRatesSuccess implements Action {
  readonly type = MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class LoadAvailableMetalRatesFailure implements Action {
  readonly type = MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class SaveMetalRates implements Action {
  readonly type = MetalRatesActionTypes.SAVE_METAL_RATES;
  constructor(readonly payload: MetalRateUpdateRequestPayload) {}
}
export class SaveMetalRatesSuccess implements Action {
  readonly type = MetalRatesActionTypes.SAVE_METAL_RATES_SUCCESS;
  constructor(readonly payload: any) {}
}
export class SaveMetalRatesFailure implements Action {
  readonly type = MetalRatesActionTypes.SAVE_METAL_RATES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ResetState implements Action {
  readonly type = MetalRatesActionTypes.RESET;
}

export type MetalRatesActions =
  | LoadBodBusinessDate
  | LoadBodBusinessDateSuccess
  | LoadBodBusinessDateFailure
  | LoadEodBusinessDate
  | LoadEodBusinessDateSuccess
  | LoadEodBusinessDateFailure
  | LoadAvailableMetalRates
  | LoadAvailableMetalRatesSuccess
  | LoadAvailableMetalRatesFailure
  | SaveMetalRates
  | SaveMetalRatesSuccess
  | SaveMetalRatesFailure
  | ResetState;
