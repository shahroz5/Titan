import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TcsList,
  TcsRequestParam
} from '@poss-web/shared/models';

export enum ViewTcsActionTypes {
  LOAD_TCS_DETAILS = '[View-TCS] Load TCS Details',
  LOAD_TCS_DETAILS_SUCCESS = '[View-TCS] Load TCS Details Success',
  LOAD_TCS_DETAILS_FAILURE = '[View-TCS] Load TCS Details Failure'
}

export class LoadTcsDetails implements Action {
  readonly type = ViewTcsActionTypes.LOAD_TCS_DETAILS;
  constructor(public payload: TcsRequestParam) {}
}

export class LoadTcsDetailsSuccess implements Action {
  readonly type = ViewTcsActionTypes.LOAD_TCS_DETAILS_SUCCESS;
  constructor(public payload: TcsList[]) {}
}

export class LoadTcsDetailsFailure implements Action {
  readonly type = ViewTcsActionTypes.LOAD_TCS_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ViewTcsActions =
  | LoadTcsDetails
  | LoadTcsDetailsSuccess
  | LoadTcsDetailsFailure;
