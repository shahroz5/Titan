import { createFeatureSelector } from '@ngrx/store';
import { CutPieceTotState } from './cut-piece-tot.state';
import {
  CutPieceTotActions,
  CutPieceTotActionTypes
} from './cut-piece-tot.actions';

export const initialState: CutPieceTotState = {
  cutPieceTotDetails: null,
  updateCutPieceTot: null,
  error: null,
  isLoading: null
};

export const CUTPIECETOT_FEATURE_KEY = 'cutPieceTot';
export const selectCutPieceTotState = createFeatureSelector<CutPieceTotState>(
  CUTPIECETOT_FEATURE_KEY
);

export function CutPieceTotReducer(
  state: CutPieceTotState = initialState,
  action: CutPieceTotActions
): CutPieceTotState {
  switch (action.type) {
    case CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT:
      return {
        ...state,
        cutPieceTotDetails: null,
        updateCutPieceTot: null,
        error: null,
        isLoading: true
      };

    case CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_SUCCESS:
      return {
        ...state,
        cutPieceTotDetails: action.payload,
        isLoading: false
      };

    case CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT:
      return {
        ...state,
        updateCutPieceTot: null,
        error: null,
        isLoading: true
      };

    case CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_SUCCESS:
      return {
        ...state,
        updateCutPieceTot: action.payload,
        isLoading: false
      };

    case CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
