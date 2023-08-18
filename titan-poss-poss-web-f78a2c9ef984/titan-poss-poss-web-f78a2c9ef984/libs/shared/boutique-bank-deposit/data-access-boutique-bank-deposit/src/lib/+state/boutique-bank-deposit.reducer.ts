import { createFeatureSelector } from '@ngrx/store';
import {
  BoutiqueBankDepositActions,
  BoutiqueBankDepositActionTypes
} from './boutique-bank-deposit.actions';
import { BoutiqueBankDepositState } from './boutique-bank-deposit.state';

export const initialState: BoutiqueBankDepositState = {
  isLoading: false,
  error: null,
  depositDetails: null,
  totalElements: 0,
  hasSaved: false,
  depositedAmount: 0,
  saveResponse: null,
  hasDenomitionSaved: false,
  pendingDates: null,
  pifNoResponse: null
};
export const BOUTIQUE_BANK_DEPOSIT_FEATURE_KEY = 'boutiqueBankDeposit';
export const selectBoutiqueBankDepositState = createFeatureSelector<
  BoutiqueBankDepositState
>(BOUTIQUE_BANK_DEPOSIT_FEATURE_KEY);
export function BoutiqueBankDepositReducer(
  state: BoutiqueBankDepositState,
  action: BoutiqueBankDepositActions
): BoutiqueBankDepositState {
  switch (action.type) {
    case BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS:
    case BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES:
    case BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        depositDetails: action.payload.results,
        totalElements: action.payload.totalElements,
        error: null
      };
    case BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        depositDetails: null,
      };
    case BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false,
        depositedAmount: 0
      };
    case BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        depositedAmount: action.payload.totalDepositAmount,
        saveResponse: action.payload.data
      };
    case BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION:
      return {
        ...state,
        isLoading: true,
        hasDenomitionSaved: false
      };
    case BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasDenomitionSaved: true
      };
    case BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasDenomitionSaved: false,
        error: action.payload
      };
    case BoutiqueBankDepositActionTypes.RESET_BOUTIQUE_BANK_DETAILS:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: null,
        depositDetails: null,
        depositedAmount: 0,
        saveResponse: [],
        hasDenomitionSaved: false,
        pendingDates: null,
        pifNoResponse: null
      };
    case BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingDates: action.payload
      };
    case BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pifNoResponse: action.payload
      };
  }
  return { ...state };
}
