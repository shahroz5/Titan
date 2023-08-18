import { createFeatureSelector } from '@ngrx/store';
import { PIFSeriesActions, PIFSeriesActionTypes } from './pif-series.actions';
import { PIFSeriesState } from './pif-series.state';

export const initialState: PIFSeriesState = {
  pifSeries: null,
  error: null,
  hasSaved: false,
  isLoading: false,
  totalElements: 0
};
export const PIF_SERIES_FEATURE_KEY = 'pifSeries';
export const selectPIFSeriesState = createFeatureSelector<PIFSeriesState>(
  PIF_SERIES_FEATURE_KEY
);
export function PIFSeriesReducer(
  state: PIFSeriesState,
  action: PIFSeriesActions
): PIFSeriesState {
  switch (action.type) {
    case PIFSeriesActionTypes.LOAD_PIF_SERIES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case PIFSeriesActionTypes.LOAD_PIF_SERIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pifSeries: action.payload.pifSeries,
        totalElements: action.payload.totalElements,
        error: null
      };
    case PIFSeriesActionTypes.LOAD_PIF_SERIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case PIFSeriesActionTypes.SAVE_PIF_SERIES:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case PIFSeriesActionTypes.SAVE_PIF_SERIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true
      };
    case PIFSeriesActionTypes.SAVE_PIF_SERIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case PIFSeriesActionTypes.RESET_PIF_SERIES:
      return {
        ...state,
        isLoading: false,
        error: null,
        hasSaved: false,
        pifSeries: null,
        totalElements: 0
      };
    default:
      return { ...state };
  }
}
