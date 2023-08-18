import { PayerBankConfigState } from './payer-bank-config.state';
import { createFeatureSelector } from '@ngrx/store';
import {
  PayerBankConfigActions,
  PayerBankConfigActionTypes
} from './payer-bank-config.actions';

export const initialState: PayerBankConfigState = {
  payerBankConfigListing: null,
  error: null,
  isLoading: false,
  totalElements: 0,
  hasSaved: false,
  hasUpdated: false,
  payerBanks: [],
  configId: null,
  payerBanksConfigDetails: null,
  paymentModes: null,
  hasSearched: null,
  banksCount: 0
};
export const PAYER_BANK_CONFIGURATION_FEATURE_KEY = 'payerBankConfiguration';
export const selectPayerBankConfigurationState = createFeatureSelector<
  PayerBankConfigState
>(PAYER_BANK_CONFIGURATION_FEATURE_KEY);
export function PayerBankConfigurationReducer(
  state: PayerBankConfigState = initialState,
  action: PayerBankConfigActions
): PayerBankConfigState {
  switch (action.type) {
    case PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS:
    case PayerBankConfigActionTypes.LOAD_PAYER_BANKS:
    case PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME:
    case PayerBankConfigActionTypes.LOAD_PAYMENT_MODES:
    case PayerBankConfigActionTypes.SEARCH_PAYER_BANK:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case PayerBankConfigActionTypes.SEARCH_CONFIG_NAME:
      return {
        ...state,
        isLoading: true,
        hasSearched: false
      };
    case PayerBankConfigActionTypes.SEARCH_PAYER_BANK_SUCCESS:
      return {
        ...state,
        payerBanks: action.payload,
        isLoading: false
      };
    case PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payerBankConfigListing: action.payload.payerBankListing,
        totalElements: action.payload.totalElements
      };
    case PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        payerBankConfigListing: action.payload,
        totalElements: 0
      };
    case PayerBankConfigActionTypes.LOAD_PAYER_BANK_DETAILS_FAILURE:
    case PayerBankConfigActionTypes.LOAD_PAYER_BANKS_FAILURE:
    case PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_FAILURE:
    case PayerBankConfigActionTypes.SEARCH_PAYER_BANK_FAILURE:
    case PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSearched: false,
        error: action.payload
      };
    case PayerBankConfigActionTypes.LOAD_PAYER_BANKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payerBanks: action.payload.payerBanks,
        banksCount: action.payload.totalElements
      };
    case PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON:
    case PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS:
    case PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    case PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload
      };

    case PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    case PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payerBanksConfigDetails: action.payload
      };
    case PayerBankConfigActionTypes.RESET_PAYER_BANK_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: false,
        payerBanksConfigDetails: null,
        configId: null,
        hasSaved: false,
        hasUpdated: false,
        error: null
      };
    case PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentModes: action.payload
      };
  }
  return state;
}
