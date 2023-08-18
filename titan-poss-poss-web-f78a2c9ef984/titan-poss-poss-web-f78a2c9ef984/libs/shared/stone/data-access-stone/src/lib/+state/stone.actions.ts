import {
  StoneDetails,
  LoadStoneListingSuccessPayload,
  StoneFilter
} from '@poss-web/shared/models';
import { CustomErrors } from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum StoneActionTypes {
  // LOAD_STONE_DETAILS = '[Load-Stone-Details] Load Stone Details',
  // LOAD_STONE_DETAILS_SUCCESS = '[Load-Stone-Details] Load Stone Details Success',
  // LOAD_STONE_DETAILS_FAILURE = '[Load-Stone-Details] Load Stone Details Failure',

  SEARCH_STONE_DETAILS = '[Load-Stone-Details] Search Stone-Details',
  SEARCH_STONE_DETAILS_SUCCESS = '[Load-Stone-Details] Search Stone-Details Success',
  SEARCH_STONE_DETAILS_FAILURE = '[Load-Stone-Details] Search Stone-Details Failure',

  FILTER_STONE_DETAILS = '[Stone] Filter Stone-Details',
  FILTER_STONE_DETAILS_SUCCESS = '[Load-Stone-Details] Filter Stone-Details Success',
  FILTER_STONE_DETAILS_FAILURE = '[Load-Stone-Details] Filter Stone-Details Failure',

  RESET_FILTER_DATA = '[ Stone ] Reset Filter Data'
}

// export class LoadStoneDetails implements Action {
//   readonly type = StoneActionTypes.LOAD_STONE_DETAILS;
//   constructor(public payload: LoadStoneListingPayload) {}
// }

// export class LoadStoneDetailsSuccess implements Action {
//   readonly type = StoneActionTypes.LOAD_STONE_DETAILS_SUCCESS;
//   constructor(public payload: LoadStoneListingSuccessPayload) {}
// }

// export class LoadStoneDetailsFailure implements Action {
//   readonly type = StoneActionTypes.LOAD_STONE_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

export class SearchStoneCode implements Action {
  readonly type = StoneActionTypes.SEARCH_STONE_DETAILS;
  constructor(public payload: string) {}
}
export class SearchStoneCodeSuccess implements Action {
  readonly type = StoneActionTypes.SEARCH_STONE_DETAILS_SUCCESS;
  constructor(public payload: StoneDetails[]) {}
}
export class SearchStoneCodeFailure implements Action {
  readonly type = StoneActionTypes.SEARCH_STONE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class FilterStone implements Action {
  readonly type = StoneActionTypes.FILTER_STONE_DETAILS;
  constructor(public payload: StoneFilter) {}
}
export class ResetFilter implements Action {
  readonly type = StoneActionTypes.RESET_FILTER_DATA;
}
export class FilterStoneSuccess implements Action {
  readonly type = StoneActionTypes.FILTER_STONE_DETAILS_SUCCESS;
  constructor(public payload: LoadStoneListingSuccessPayload) {}
}
export class FilterStoneFailure implements Action {
  readonly type = StoneActionTypes.FILTER_STONE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type StoneActions =
  // | LoadStoneDetails
  // | LoadStoneDetailsSuccess
  // | LoadStoneDetailsFailure
  | SearchStoneCode
  | SearchStoneCodeSuccess
  | SearchStoneCodeFailure
  | FilterStone
  | ResetFilter
  | FilterStoneSuccess
  | FilterStoneFailure;
