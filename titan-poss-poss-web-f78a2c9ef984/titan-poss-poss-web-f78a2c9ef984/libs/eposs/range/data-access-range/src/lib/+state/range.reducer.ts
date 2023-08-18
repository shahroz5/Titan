import { createFeatureSelector } from '@ngrx/store';
import { RangeActions, RangeActionTypes } from './range.actions';
import { RangeState } from './range.state';

export const initialState: RangeState = {
  error: null,
  isLoading: false,
  hasSaved: false,
  ranges: [],
  rangeTypes: null
};
export const RANGE_FEATURE_KEY = 'ranges';
export const selectRangeState = createFeatureSelector<RangeState>(
  RANGE_FEATURE_KEY
);
export function RangeReducer(
  state: RangeState = initialState,
  action: RangeActions
): RangeState {
  switch (action.type) {
    case RangeActionTypes.LOAD_RANGES:
    case RangeActionTypes.LOAD_RANGE_TYPES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case RangeActionTypes.LOAD_RANGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ranges: action.payload
      };
    case RangeActionTypes.LOAD_RANGES_FAILURE:
    case RangeActionTypes.LOAD_RANGE_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case RangeActionTypes.SAVE_RANGES:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case RangeActionTypes.SAVE_RANGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true
      };
    case RangeActionTypes.SAVE_RANGES_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case RangeActionTypes.RESET_RANGES:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: null,
        ranges: null
      };
    case RangeActionTypes.LOAD_RANGE_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeTypes: action.payload
      };
    default: {
      return {
        ...state
      };
    }
  }
}
