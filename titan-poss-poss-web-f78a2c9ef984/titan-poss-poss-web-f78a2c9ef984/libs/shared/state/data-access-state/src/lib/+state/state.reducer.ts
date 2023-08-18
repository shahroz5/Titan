import { stateAdapter, countryAdapter, stateTaxAdapter } from './state.entity';
import { StatesState } from './state.state';
import { StateActions, StateActionTypes } from './state.actions';
import { createFeatureSelector } from '@ngrx/store';

export const STATE_FEATURE_KEY = 'states';

export const selectStatesState = createFeatureSelector<StatesState>(
  STATE_FEATURE_KEY
);

export const initialState: StatesState = {
  stateDetailsListing: stateAdapter.getInitialState(),
  countryDetailsListing: countryAdapter.getInitialState(),
  totalStateDetails: 0,
  error: null,
  isLoading: false,
  stateTaxDetails: stateTaxAdapter.getInitialState(),
  stateDetailsByStateCode: null,
  saveStateDetailsResponse: null,
  editStateDetailsResponse: null,
  isSearchElements: false,
  isActiveUpdated: null
};

export function stateReducer(
  state: StatesState = initialState,
  action: StateActions
): StatesState {
  switch (action.type) {
    case StateActionTypes.LOAD_STATE_DETAILS:
    case StateActionTypes.LOAD_STATE_DETAILS_BY_CODE:
    case StateActionTypes.SAVE_STATE_DETAILS:
    case StateActionTypes.EDIT_STATE_DETAILS:
    case StateActionTypes.LOAD_COUNTRY_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case StateActionTypes.LOAD_STATE_DETAILS_SUCCESS:
      return {
        ...state,
        totalStateDetails: action.payload.totalElements,
        isLoading: false,
        stateDetailsListing: stateAdapter.setAll(
          action.payload.stateDetailsListing,
          state.stateDetailsListing
        ),
        isSearchElements: true
      };

    case StateActionTypes.LOAD_COUNTRY_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        countryDetailsListing: countryAdapter.setAll(
          action.payload.countryDetailsListing,
          state.countryDetailsListing
        ),
        isSearchElements: true
      };
    case StateActionTypes.LOAD_COUNTRY_DETAILS_FAILURE:
    case StateActionTypes.LOAD_STATE_DETAILS_FAILURE:
    case StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_FAILURE:
    case StateActionTypes.SAVE_STATE_DETAILS_FAILURE:
    case StateActionTypes.EDIT_STATE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_SUCCESS:
      return {
        ...state,
        stateDetailsByStateCode: action.payload,
        isLoading: false
      };

    case StateActionTypes.SAVE_STATE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveStateDetailsResponse: action.payload
      };

    case StateActionTypes.RESET_STATE_DIALOG_DATA:
      return {
        ...state,
        totalStateDetails: 0,
        stateDetailsListing: stateAdapter.getInitialState(),
        stateTaxDetails: stateAdapter.getInitialState(),
        stateDetailsByStateCode: null,
        saveStateDetailsResponse: null,
        editStateDetailsResponse: null,
        error: null,
        isActiveUpdated: null
      };

    case StateActionTypes.EDIT_STATE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editStateDetailsResponse: action.payload
      };

    case StateActionTypes.SEARCH_STATE_BY_CODE:
      return {
        ...state,
        error: null
      };
    case StateActionTypes.SEARCH_STATE_BY_CODE_SUCCESS:
      return {
        ...state,

        totalStateDetails: action.payload.totalElements,
        isSearchElements: true,
        stateDetailsListing: stateAdapter.setAll(
          action.payload.stateDetailsListing,
          state.stateDetailsListing
        )
      };

    case StateActionTypes.SEARCH_STATE_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchElements: false,
        stateDetailsListing: stateAdapter.removeAll(state.stateDetailsListing)
      };

    case StateActionTypes.UPDATE_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        error: null,
        isActiveUpdated: false
      };
    case StateActionTypes.UPDATE_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isActiveUpdated: true
      };
    case StateActionTypes.UPDATE_IS_ACTIVE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isActiveUpdated: false
      };

    default:
      return state;
  }
}
