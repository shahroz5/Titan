import { Action } from '@ngrx/store';
import { CustomErrors, CutPieceTot } from '@poss-web/shared/models';

export enum CutPieceTotActionTypes {
  LOAD_CUT_PIECE_TOT = '[Cut Piece Tot] Load Cut Piece Tot',
  LOAD_CUT_PIECE_TOT_SUCCESS = '[Cut Piece Tot] Load Cut Piece Tot Success',
  LOAD_CUT_PIECE_TOT_FAILURE = '[Cut Piece Tot] Load Cut Piece Tot Failure',

  UPDATE_CUT_PIECE_TOT = '[Cut Piece Tot] Update Cut Piece Tot',
  UPDATE_CUT_PIECE_TOT_SUCCESS = '[Cut Piece Tot] Update Cut Piece Tot Success',
  UPDATE_CUT_PIECE_TOT_FAILURE = '[Cut Piece Tot] Update Cut Piece Tot Failure'
}

export class LoadCutPieceTot implements Action {
  readonly type = CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT;
}
export class LoadCutPieceTotSuccess implements Action {
  readonly type = CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_SUCCESS;
  constructor(public payload: CutPieceTot[]) {}
}
export class LoadCutPieceTotFailure implements Action {
  readonly type = CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCutPieceTot implements Action {
  readonly type = CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT;
  constructor(
    public payload: { configId: string; cutPieceTot: Partial<CutPieceTot> }
  ) {}
}
export class UpdateCutPieceTotSuccess implements Action {
  readonly type = CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_SUCCESS;
  constructor(public payload: CutPieceTot) {}
}
export class UpdateCutPieceTotFailure implements Action {
  readonly type = CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CutPieceTotActions =
  | LoadCutPieceTot
  | LoadCutPieceTotSuccess
  | LoadCutPieceTotFailure
  | UpdateCutPieceTot
  | UpdateCutPieceTotSuccess
  | UpdateCutPieceTotFailure;
