import { CurrencyState } from './currency.state';
import { CurrencyActionTypes, CurrencyActions } from './currency.action';

import { createFeatureSelector } from '@ngrx/store';
export const CURRENCY_FEATURE_KEY = 'Currency';

export const selectCurrencyState = createFeatureSelector<CurrencyState>(
  CURRENCY_FEATURE_KEY
);

export const initialState: CurrencyState = {
  error: null,
  currencyListing: null,
  currencyDetails: null,
  totalCurrencyDetails: 0,
  isLoading: false,
  saveCurrency: null,
  editCurrency: null
};

export function CurrencyReducer(
  state: CurrencyState = initialState,
  action: CurrencyActions
): CurrencyState {
  switch (action.type) {
    case CurrencyActionTypes.LOAD_CURRENCY_LISTING:
    case CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE:
    case CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS:
    case CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS:
    case CurrencyActionTypes.SEARCH_CURRENCY_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case CurrencyActionTypes.LOAD_CURRENCY_LISTING_SUCCESS:
      return {
        ...state,
        currencyListing: action.payload.currencyListing,
        totalCurrencyDetails: action.payload.totalElements,
        isLoading: false
      };

    case CurrencyActionTypes.LOAD_CURRENCY_LISTING_FAILURE:
    case CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_FAILURE:
    case CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_FAILURE:
    case CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_SUCCESS:
      return {
        ...state,
        currencyDetails: action.payload,
        isLoading: false
      };

    case CurrencyActionTypes.RESET_CURRENCY_DIALOG_DATA:
      return {
        ...state,
        error: null,
        currencyListing: null,
        currencyDetails: null,
        isLoading: false,
        saveCurrency: null,
        editCurrency: null
      };

    case CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveCurrency: action.payload
        // currencyListing: [...state.currencyListing, action.payload]
      };

    case CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editCurrency: action.payload
      };

    case CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_SUCCESS:
      return {
        ...state,
        currencyListing: action.payload,
        isLoading: false,
        totalCurrencyDetails: 0
      };

    case CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        currencyListing: null,
        isLoading: false,
        totalCurrencyDetails: 0
      };

    default:
      return state;
  }
}
