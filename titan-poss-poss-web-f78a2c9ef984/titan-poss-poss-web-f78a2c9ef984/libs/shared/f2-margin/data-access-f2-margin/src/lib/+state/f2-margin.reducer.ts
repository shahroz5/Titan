import { createFeatureSelector } from '@ngrx/store';
import { F2MarginState } from './f2-margin.state';

import { F2MarginActionTypes, F2MarginActions } from './f2-margin.action';

export const f2MarginFeatureKey = 'f2MarginFeatureKey';
export const selectF2MarginState = createFeatureSelector<F2MarginState>(
  f2MarginFeatureKey
);

export const initialState: F2MarginState = {
  f2MarginList: [],
  isLoading: null,
  error: null,
  totalElements: 0
};
export function f2MarginReducer(
  state: F2MarginState = initialState,
  action: F2MarginActions
) {
  switch (action.type) {
    case F2MarginActionTypes.LOAD_F2_MARGIN_LIST:
      return {
        ...state,
        isLoading: true
      };

    case F2MarginActionTypes.LOAD_F2_MARGIN_LIST_SUCCESS:
      return {
        ...state,
        f2MarginList: action.payload.f2MarginList,
        isLoading: false,
        totalElements: action.payload.totalElements
      };

    case F2MarginActionTypes.LOAD_F2_MARGIN_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case F2MarginActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        f2MarginList: [],
        totalElements: 0,
        isLoading: null
      };
    default:
      return { ...state };
  }
}
