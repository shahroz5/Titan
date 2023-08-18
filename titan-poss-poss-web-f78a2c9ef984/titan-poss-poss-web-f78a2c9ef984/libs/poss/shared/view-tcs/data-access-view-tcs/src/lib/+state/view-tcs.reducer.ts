
import { createFeatureSelector } from '@ngrx/store';
import { ViewTcsState } from './view-tcs.state';
import { ViewTcsActions, ViewTcsActionTypes } from './view-tcs.actions';

export const VIEW_TCS_FEATURE_KEY = 'viewTcs';

export const selectViewTcsState = createFeatureSelector<ViewTcsState>(
  VIEW_TCS_FEATURE_KEY
);

export const initialState: ViewTcsState = {
  error: null,
  isLoading: false,
  tcsDetails: []
};

export function ViewTcsReducer(
  state: ViewTcsState = initialState,
  action: ViewTcsActions
): ViewTcsState {
  switch (action.type) {
    case ViewTcsActionTypes.LOAD_TCS_DETAILS:
      return {
        ...state,
        isLoading: true,
        tcsDetails: []
      };

    case ViewTcsActionTypes.LOAD_TCS_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tcsDetails: action.payload
      };

    case ViewTcsActionTypes.LOAD_TCS_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
