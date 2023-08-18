import { CatchmentActions, CatchmentActionTypes } from './catchment.actions';
import { createFeatureSelector } from '@ngrx/store';
import { CatchmentState } from './catchment.state';

export const initialState: CatchmentState = {
  catchmentListing: [],
  catchmentDetails: null,
  saveCatchmentResponses: null,
  editCatchmentResponses: null,
  totalCatchmentDetails: 0,
  error: null,
  isLoading: null
};

export const CATCHMENT_FEATURE_KEY = 'catchment';
export const selectCatchmentState = createFeatureSelector<CatchmentState>(
  CATCHMENT_FEATURE_KEY
);

export function CatchmentReducer(
  state: CatchmentState = initialState,
  action: CatchmentActions
): CatchmentState {
  switch (action.type) {
    case CatchmentActionTypes.LOAD_CATCHMENT_LISTING:
    case CatchmentActionTypes.LOAD_CATCHMENT_DETAILS:
    case CatchmentActionTypes.SAVE_CATCHMENT_DETAILS:
    case CatchmentActionTypes.EDIT_CATCHMENT_DETAILS:
    case CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS:
      return {
        ...state,
        catchmentDetails: null,
        saveCatchmentResponses: null,
        editCatchmentResponses: null,
        isLoading: true
      };

    case CatchmentActionTypes.LOAD_CATCHMENT_LISTING_FAILURE:
    case CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_FAILURE:
    case CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_FAILURE:
    case CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CatchmentActionTypes.LOAD_CATCHMENT_LISTING_SUCCESS:
      return {
        ...state,
        catchmentListing: action.payload.catchmentListing,
        totalCatchmentDetails: action.payload.totalElements,
        isLoading: false
      };

    case CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_SUCCESS:
      return {
        ...state,
        catchmentListing: action.payload.catchmentListing,
        isLoading: false,
        totalCatchmentDetails: 0
      };

    case CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        catchmentListing: null,
        isLoading: false,
        totalCatchmentDetails: 0
      };

    case CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_SUCCESS:
      return {
        ...state,
        catchmentDetails: action.payload,
        isLoading: false
      };

    case CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveCatchmentResponses: action.payload,
        catchmentListing: [...state.catchmentListing, action.payload]
      };

    case CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editCatchmentResponses: action.payload
      };

    default:
      return state;
  }
}
