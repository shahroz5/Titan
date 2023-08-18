import { AbRequestsState } from './ab-requests.state';

import { createFeatureSelector } from '@ngrx/store';
import { ABDetailsAdapter } from './ab-requests.entity';

import {
  ABRequestsActions,
  ABRequestsActionsTypes
} from './ab-requests.actions';

export const AB__REQUESTS_FEATURE_KEY = 'ab-activate-request';

export const selectABRequestsState = createFeatureSelector<AbRequestsState>(
  AB__REQUESTS_FEATURE_KEY
);

export const initialState: AbRequestsState = {
  abRequests: ABDetailsAdapter.getInitialState(),
  abRequestsDetail: null,
  abRequestsCount: 0,
  hasError: null,
  isLoading: false,
  locations: null,

};

export function ABRequestsReducer(
  state: AbRequestsState = initialState,
  action: ABRequestsActions
): AbRequestsState {
  switch (action.type) {
    case ABRequestsActionsTypes.RESET:
      return {
        ...state,
        abRequests: ABDetailsAdapter.getInitialState(),
        abRequestsDetail: null,
        abRequestsCount: 0,
        hasError: null,
        isLoading: false
      };

    case ABRequestsActionsTypes.APPROVE_AB__REQUESTS:
    case ABRequestsActionsTypes.LOAD_AB__REQUESTS:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case ABRequestsActionsTypes.LOAD_AB__REQUESTS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        abRequests: ABDetailsAdapter.setAll(
          action.payload.results,
          state.abRequests
        ),
        abRequestsCount: action.payload.count,
        hasError: null
      };

    case ABRequestsActionsTypes.APPROVE_AB__REQUESTS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        abRequestsDetail: action.payload,
        hasError: null
      };

    case ABRequestsActionsTypes.APPROVE_AB__REQUESTS_FAILURE:
    case ABRequestsActionsTypes.LOAD_AB__REQUESTS_FAILURE:
      return {
        ...state,
        isLoading: false,

        hasError: action.payload
      };

    case ABRequestsActionsTypes.LOAD_LOCATION:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case ABRequestsActionsTypes.LOAD_LOCATION_SUCCESS:
      return {
        ...state,
        locations: action.payload,
        isLoading: false,
        hasError: null
      };

    case ABRequestsActionsTypes.LOAD_LOCATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload
      };

    default:
      return state;
  }
}
