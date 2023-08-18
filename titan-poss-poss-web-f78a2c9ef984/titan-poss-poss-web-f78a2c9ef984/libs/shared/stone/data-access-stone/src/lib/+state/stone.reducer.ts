import { StoneState } from './stone.state';
import { StoneActions, StoneActionTypes } from './stone.actions';

import { createFeatureSelector } from '@ngrx/store';

export const STONE_FEATURE_KEY = 'stone';

export const selectStoneState = createFeatureSelector<StoneState>(
  STONE_FEATURE_KEY
);

export const initialState: StoneState = {
  stoneListing: null,
  totalStoneDetails: 0,
  isLoading: false,
  error: null,
  stonefilter: null
};
export function StoneReducer(
  state: StoneState = initialState,
  action: StoneActions
): StoneState {
  switch (action.type) {
    case StoneActionTypes.FILTER_STONE_DETAILS:
      return {
        ...state,
        isLoading: true,
        stonefilter: action.payload
      };
    case StoneActionTypes.FILTER_STONE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stoneListing: action.payload.stoneListing,
        totalStoneDetails: action.payload.totalElements
      };
    case StoneActionTypes.FILTER_STONE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        stoneListing: null,
        isLoading: false,
        totalStoneDetails: 0
      };

    case StoneActionTypes.RESET_FILTER_DATA:
      return {
        ...state,
        isLoading: false,
        stonefilter: null,
        totalStoneDetails: 0,
        stoneListing: null
      };
    default:
      return state;
  }
}
