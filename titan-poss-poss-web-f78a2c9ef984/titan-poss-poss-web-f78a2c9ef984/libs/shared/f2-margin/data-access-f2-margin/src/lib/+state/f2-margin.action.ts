import {
  CustomErrors,
  F2MarginListPayload,
  F2MarginListResponse
} from '@poss-web/shared/models';

import { Action } from '@ngrx/store';

export enum F2MarginActionTypes {
  LOAD_F2_MARGIN_LIST = '[f2-margin] Load F2 Margin List ',
  LOAD_F2_MARGIN_LIST_SUCCESS = '[f2-margin] Load F2 Margin List Success',
  LOAD_F2_MARGIN_LIST_FAILURE = '[f2-margin] Load F2 Margin  List Failure',

  LOAD_RESET = '[f2-margin] Load Reset'
}

export class LoadF2MarginList implements Action {
  readonly type = F2MarginActionTypes.LOAD_F2_MARGIN_LIST;
  constructor(public payload: F2MarginListPayload) {}
}
export class LoadF2MarginListSuccess implements Action {
  readonly type = F2MarginActionTypes.LOAD_F2_MARGIN_LIST_SUCCESS;
  constructor(public payload: F2MarginListResponse) {}
}
export class LoadF2MarginListFailure implements Action {
  readonly type = F2MarginActionTypes.LOAD_F2_MARGIN_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = F2MarginActionTypes.LOAD_RESET;
}

export type F2MarginActions =
  | LoadF2MarginList
  | LoadF2MarginListSuccess
  | LoadF2MarginListFailure
  | LoadReset;
