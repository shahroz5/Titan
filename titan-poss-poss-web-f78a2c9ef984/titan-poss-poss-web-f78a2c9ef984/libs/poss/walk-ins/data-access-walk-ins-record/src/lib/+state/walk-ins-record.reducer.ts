import { createFeatureSelector } from '@ngrx/store';
import {
  WalkInsRecordActionTypes,
  WalkInsRecordActions
} from './walk-ins-record.actions';
import {
  walkInRecordFeatureKey,
  WalkInsRecordState
} from './walk-ins-record.state';

export const selectWalkInsRecordState = createFeatureSelector<
  WalkInsRecordState
>(walkInRecordFeatureKey);

export const initialState: WalkInsRecordState = {
  errors: null,
  isLoading: false,
  purchasersCount: 0,
  walkInsCount: null,
  saveWalkInDetailsResponse: null,
  numberOfInvoices: 0,
  walkInsDate: null,
  walkInsHistoryData: null
};

export function WalkInsRecordReducer(
  state: WalkInsRecordState = initialState,
  action: WalkInsRecordActions
): WalkInsRecordState {
  switch (action.type) {
    case WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS:
    case WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS:
      return { ...state, isLoading: true, errors: null };
    case WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_SUCCESS:
      return {
        ...state,
        walkInsDate: action.payload.date,
        purchasersCount: action.payload.purchasers,
        numberOfInvoices: action.payload.invoices,
        errors: null,
        isLoading: false
      };
    case WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_FAILURE:
      return {
        ...state,
        walkInsDate: null,
        purchasersCount: 0,
        numberOfInvoices: 0,
        errors: action.payload,
        isLoading: false
      };
    case WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA:
      return {
        ...state,
        walkInsHistoryData: null,
        isLoading: true,
        errors: null
      };
    case WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_SUCCESS:
      return {
        ...state,
        walkInsHistoryData: action.payload,
        isLoading: false,
        errors: null
      };
    case WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_FAILURE:
      return {
        ...state,
        walkInsHistoryData: null,
        isLoading: false,
        errors: action.payload
      };
    case WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_SUCCESS:
      return {
        ...state,
        saveWalkInDetailsResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_FAILURE:
      return {
        ...state,
        saveWalkInDetailsResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case WalkInsRecordActionTypes.SET_WALK_INS_COUNT:
      return {
        ...state,
        walkInsCount: action.payload,
        errors: null,
        isLoading: false
      };
    case WalkInsRecordActionTypes.CLEAR_VALUES:
      return {
        ...state,
        errors: null,
        isLoading: false,
        purchasersCount: 0,
        walkInsCount: null,
        numberOfInvoices: 0,
        walkInsDate: null
      };
    case WalkInsRecordActionTypes.RESET_VALUES:
      return {
        ...state,
        errors: null,
        isLoading: false,
        purchasersCount: 0,
        walkInsCount: null,
        saveWalkInDetailsResponse: null,
        numberOfInvoices: 0,
        walkInsDate: null,
        walkInsHistoryData: null
      };
    default:
      return state;
  }
}
