import { Action } from '@ngrx/store';
import {
  ClosedBodResponse,
  CustomErrors,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';

export enum BodEodActionTypes {
  OPEN_BUSINESS_DATE = '[Shared Bod Eod] Open Business date',
  OPEN_BUSINESS_DATE_SUCCESS = '[Shared Bod Eod] Open Business date Success',
  OPEN_BUSINESS_DATE_FAILURE = '[Shared Bod Eod] Open Business date Failure',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY = '[Shared Bod Eod] Load Metal Rates for business day',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS = '[Shared Bod Eod] Load Metal Rates for business day Success',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE = '[Shared Bod Eod] Load Metal Rates for business day Failure',
  LOAD_EOD_BUSINESS_DATE = '[Shared Bod Eod] Load EOD Business date',
  LOAD_EOD_BUSINESS_DATE_SUCCESS = '[Shared Bod Eod] Load EOD Business date Success',
  LOAD_EOD_BUSINESS_DATE_FAILURE = '[Shared Bod Eod] Load EOD Business date Failure',

  LATEST_BUSINESS_DAY = '[Shared Bod Eod] Latest Business Day',
  LATEST_BUSINESS_DAY_SUCCESS = '[Shared Bod Eod] Latest Business Day Success',
  LATEST_BUSINESS_DAY_FAILURE = '[Shared Bod Eod] Latest Business Day Failure',

  RESET = '[Shared Bod Eod] Reset BOD EOD State'
}

/*Eod Related Actions*/
export class LoadOpenBusinessDate implements Action {
  readonly type = BodEodActionTypes.OPEN_BUSINESS_DATE;
}
export class LoadOpenBusinessDateSuccess implements Action {
  readonly type = BodEodActionTypes.OPEN_BUSINESS_DATE_SUCCESS;
  constructor(readonly payload: number) {}
}
export class LoadOpenBusinessDateFailure implements Action {
  readonly type = BodEodActionTypes.OPEN_BUSINESS_DATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadMetalRatesForBusinessDay implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY;
  constructor(readonly payload: number) {}
}
export class LoadMetalRatesForBusinessDaySuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS;
  constructor(readonly payload: MetalRatesAndGoldAvailabilityResponse) {}
}
export class LoadMetalRatesForBusinessDayFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadEodBusinessDate implements Action {
  readonly type = BodEodActionTypes.LOAD_EOD_BUSINESS_DATE;
}
export class LoadEodBusinessDateSuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_SUCCESS;
  constructor(readonly payload: number) {}
}
export class LoadEodBusinessDateFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_EOD_BUSINESS_DATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LatestBusinessDay implements Action {
  readonly type = BodEodActionTypes.LATEST_BUSINESS_DAY;
}
export class LatestBusinessDaySuccess implements Action {
  readonly type = BodEodActionTypes.LATEST_BUSINESS_DAY_SUCCESS;
  constructor(readonly payload: ClosedBodResponse) {}
}
export class LatestBusinessDayFailure implements Action {
  readonly type = BodEodActionTypes.LATEST_BUSINESS_DAY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class Reset implements Action {
  readonly type = BodEodActionTypes.RESET;
}

export type BodEodActions =
  | LoadOpenBusinessDate
  | LoadOpenBusinessDateSuccess
  | LoadOpenBusinessDateFailure
  | LoadMetalRatesForBusinessDay
  | LoadMetalRatesForBusinessDaySuccess
  | LoadMetalRatesForBusinessDayFailure
  | LoadEodBusinessDate
  | LoadEodBusinessDateSuccess
  | LoadEodBusinessDateFailure
  | LatestBusinessDay
  | LatestBusinessDaySuccess
  | LatestBusinessDayFailure
  | Reset;
