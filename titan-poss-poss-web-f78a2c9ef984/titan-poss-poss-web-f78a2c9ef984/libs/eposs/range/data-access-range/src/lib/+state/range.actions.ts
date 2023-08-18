import { Action } from '@ngrx/store';
import {
  ConfigurationRanges,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';
export enum RangeActionTypes {
  LOAD_RANGES = '[rane]Load Ranges',
  LOAD_RANGES_SUCCESS = '[rane]Load Ranges Success',
  LOAD_RANGES_FAILURE = '[rane]Load Ranges Failure',

  SAVE_RANGES = '[range] Save Ranges',
  SAVE_RANGES_SUCCESS = '[range] Save Ranges Success',
  SAVE_RANGES_FAILURE = '[range] Save Ranges Failure',

  LOAD_RANGE_TYPES = '[airpay-configuration] Load Range Types',
  LOAD_RANGE_TYPES_SUCCESS = '[airpay-configuration] Load Range Types Success',
  LOAD_RANGE_TYPES_FAILURE = '[airpay-configuration] Load Range Types Failure',

  RESET_RANGES = '[range] Reset Ranges'
}
export class LoadRanges implements Action {
  readonly type = RangeActionTypes.LOAD_RANGES;
  constructor(public payload: string) {}
}
export class LoadRangesSuccess implements Action {
  readonly type = RangeActionTypes.LOAD_RANGES_SUCCESS;
  constructor(public payload: ConfigurationRanges[]) {}
}
export class LoadRangesFailure implements Action {
  readonly type = RangeActionTypes.LOAD_RANGES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveRanges implements Action {
  readonly type = RangeActionTypes.SAVE_RANGES;
  constructor(public payload: { rangeType: string; savePayload: any }) {}
}
export class SaveRangesSuccess implements Action {
  readonly type = RangeActionTypes.SAVE_RANGES_SUCCESS;
}
export class SaveRangesFailure implements Action {
  readonly type = RangeActionTypes.SAVE_RANGES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetRanges implements Action {
  readonly type = RangeActionTypes.RESET_RANGES;
}

export class LoadRangeTypes implements Action {
  readonly type = RangeActionTypes.LOAD_RANGE_TYPES;
  constructor(public payload: string) {}
}
export class LoadRangeTypesSuccess implements Action {
  readonly type = RangeActionTypes.LOAD_RANGE_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadRangeTypesFailure implements Action {
  readonly type = RangeActionTypes.LOAD_RANGE_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type RangeActions =
  | LoadRanges
  | LoadRangesSuccess
  | LoadRangesFailure
  | SaveRanges
  | SaveRangesSuccess
  | SaveRangesFailure
  | ResetRanges
  | LoadRangeTypes
  | LoadRangeTypesSuccess
  | LoadRangeTypesFailure;
