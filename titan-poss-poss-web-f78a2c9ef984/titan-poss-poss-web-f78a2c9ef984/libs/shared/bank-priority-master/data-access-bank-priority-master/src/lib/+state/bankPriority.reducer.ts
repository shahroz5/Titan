import { BankPriorityState } from './bankPriority.state';
import {
  BankPriorityActionTypes,
  BankPriorityActions
} from './bankPriority.action';
import { createFeatureSelector } from '@ngrx/store';

export const BANK_PRIORITY_FEATURE_KEY = 'bank-priority';

export const selectBankPriorityState = createFeatureSelector<BankPriorityState>(
  BANK_PRIORITY_FEATURE_KEY
);

export const initialState: BankPriorityState = {
  error: null,
  bankPriorityListing: [],
  isLoading: false,
  hasUpdated: null
};

export function bankPriorityReducer(
  state: BankPriorityState = initialState,
  action: BankPriorityActions
): BankPriorityState {
  switch (action.type) {
    case BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING:
      return {
        ...state,
        isLoading: true
      };

    case BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_SUCCESS:
      return {
        ...state,
        bankPriorityListing: action.payload.bankPriorityListing,
        isLoading: false
      };

    case BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BankPriorityActionTypes.SAVE_BANK_PRIORITY:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case BankPriorityActionTypes.SAVE_BANK_PRIORITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case BankPriorityActionTypes.SAVE_BANK_PRIORITY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null,
        hasUpdated: null
      };
    case BankPriorityActionTypes.RESET_BANK_PRIORITY_DIALOG_DATA:
      return {
        ...state,
        error: null,
        bankPriorityListing: [],
        hasUpdated: null,
        isLoading: false
      };

    default:
      return state;
  }
}
