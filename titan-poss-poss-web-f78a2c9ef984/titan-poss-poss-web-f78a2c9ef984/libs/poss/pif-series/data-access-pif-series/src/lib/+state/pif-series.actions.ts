import { Action } from '@ngrx/store';
import {
  CustomErrors,
  PIFSeriesPayload,
  PIFSeriesResponse,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';

export enum PIFSeriesActionTypes {
  LOAD_PIF_SERIES = '[pif-series]Load PIF Series',
  LOAD_PIF_SERIES_SUCCESS = '[pif-series]Load PIF Series Success',
  LOAD_PIF_SERIES_FAILURE = '[pif-series]Load PIF Series Failure',

  RESET_PIF_SERIES = '[pif-series]Reset PIF Series',

  SAVE_PIF_SERIES = '[pif-series]Save PIF Series',
  SAVE_PIF_SERIES_SUCCESS = '[pif-series]Save PIF Series Success',
  SAVE_PIF_SERIES_FAILURE = '[pif-series]Save PIF Series Failure'
}
export class LoadPIFSeries implements Action {
  readonly type = PIFSeriesActionTypes.LOAD_PIF_SERIES;
  constructor(public payload: PIFSeriesPayload) {}
}
export class LoadPIFSeriesSucceess implements Action {
  readonly type = PIFSeriesActionTypes.LOAD_PIF_SERIES_SUCCESS;
  constructor(public payload: PIFSeriesResponse) {}
}
export class LoadPIFSeriesFailure implements Action {
  readonly type = PIFSeriesActionTypes.LOAD_PIF_SERIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetPIFSeries implements Action {
  readonly type = PIFSeriesActionTypes.RESET_PIF_SERIES;
}
export class SavePIFSeries implements Action {
  readonly type = PIFSeriesActionTypes.SAVE_PIF_SERIES;
  constructor(public payload: SavePIFSeriesPayload[]) {}
}
export class SavePIFSeriesSuccess implements Action {
  readonly type = PIFSeriesActionTypes.SAVE_PIF_SERIES_SUCCESS;
}
export class SavePIFSeriesFailure implements Action {
  readonly type = PIFSeriesActionTypes.SAVE_PIF_SERIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type PIFSeriesActions =
  | LoadPIFSeries
  | LoadPIFSeriesSucceess
  | LoadPIFSeriesFailure
  | ResetPIFSeries
  | SavePIFSeries
  | SavePIFSeriesSuccess
  | SavePIFSeriesFailure;
