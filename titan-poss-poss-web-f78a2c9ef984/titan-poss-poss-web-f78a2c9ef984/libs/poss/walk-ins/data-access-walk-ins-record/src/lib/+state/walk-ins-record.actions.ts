import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SaveWalkInDetailsRequestPayload,
  WalkInsDetails,
  WalkInsCustomerVisitDetails,
  WalkInsDetailsHistoryResponse,
  WalkInsCountRequestPayload
} from '@poss-web/shared/models';

export enum WalkInsRecordActionTypes {
  SET_WALK_INS_COUNT = '[Walk-ins] Set Walk In Count',
  LOAD_WALKIN_DETAILS = '[Walk-ins] Load Conversion Count',
  LOAD_WALKIN_DETAILS_SUCCESS = '[Walk-ins] Load Conversion Count Success',
  LOAD_WALKIN_DETAILS_FAILURE = '[Walk-ins] Load Conversion Count Failure',
  LOAD_WALK_INS_HISTORY_DATA = '[Walk-ins] Load Walk Ins History data',
  LOAD_WALK_INS_HISTORY_DATA_SUCCESS = '[Walk-ins] Load Walk Ins History data success',
  LOAD_WALK_INS_HISTORY_DATA_FAILURE = '[Walk-ins] Load Walk Ins History data failure',

  LOAD_SAVE_WALK_IN_DETAILS = '[Walk-ins] Load Save Walk In Details',
  LOAD_SAVE_WALK_IN_DETAILS_SUCCESS = '[Walk-ins] Load Save Walk In Details Success',
  LOAD_SAVE_WALK_IN_DETAILS_FAILURE = '[Walk-ins] Load Save Walk In Details Failure',

  CLEAR_VALUES = '[Walk-ins] Clear Values',
  RESET_VALUES = '[Walk-ins] Reset Values'
}

export class SetWalkInsCount implements Action {
  readonly type = WalkInsRecordActionTypes.SET_WALK_INS_COUNT;
  constructor(readonly payload: number) {}
}

export class LoadWalkInDetailsForBusinessDay implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS;
  constructor(readonly payload: WalkInsCountRequestPayload) {}
}

export class LoadWalkInDetailsForBusinessDaySuccess implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_SUCCESS;
  constructor(readonly payload: WalkInsCustomerVisitDetails) {}
}

export class LoadWalkInDetailsForBusinessDayFailure implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadWalkInsHistoryData implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA;
}
export class LoadWalkInsHistoryDataSuccess implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_SUCCESS;
  constructor(readonly payload: WalkInsDetailsHistoryResponse[]) {}
}
export class LoadWalkInsHistoryDataFailure implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadSaveWalkInDetails implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS;
  constructor(readonly payload: SaveWalkInDetailsRequestPayload) {}
}

export class LoadSaveWalkInDetailsSuccess implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_SUCCESS;
  constructor(readonly payload: WalkInsDetails) {}
}

export class LoadSaveWalkInDetailsFailure implements Action {
  readonly type = WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ClearValues implements Action {
  readonly type = WalkInsRecordActionTypes.CLEAR_VALUES;
}
export class ResetValues implements Action {
  readonly type = WalkInsRecordActionTypes.RESET_VALUES;
}

export type WalkInsRecordActions =
  | SetWalkInsCount
  | LoadWalkInDetailsForBusinessDay
  | LoadWalkInDetailsForBusinessDaySuccess
  | LoadWalkInDetailsForBusinessDayFailure
  | LoadWalkInsHistoryData
  | LoadWalkInsHistoryDataSuccess
  | LoadWalkInsHistoryDataFailure
  | LoadSaveWalkInDetails
  | LoadSaveWalkInDetailsSuccess
  | LoadSaveWalkInDetailsFailure
  | ClearValues
  | ResetValues;
