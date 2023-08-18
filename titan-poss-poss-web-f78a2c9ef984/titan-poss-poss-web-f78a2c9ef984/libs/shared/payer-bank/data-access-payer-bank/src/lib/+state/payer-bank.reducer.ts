import { PayerBankState } from './payer-bank.state';
import { createFeatureSelector } from '@ngrx/store';
import { PayerBankActions, PayerBankActionTypes } from './payer-bank.actions';

export const initialState: PayerBankState = {
  error: null,
  bankDetails: [],
  isLoading: false,
  totalElements: 0,
  fileResponse: null,
  errorLog: null
};
export const PAYER_BANK_FEATURE_KEY = 'payerBank';
export const selectPayerBankState = createFeatureSelector<PayerBankState>(
  PAYER_BANK_FEATURE_KEY
);
export function PayerBankReducer(
  state: PayerBankState = initialState,
  action: PayerBankActions
): PayerBankState {
  switch (action.type) {
    case PayerBankActionTypes.FILE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case PayerBankActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileResponse: action.payload,
        error: null
      };
    case PayerBankActionTypes.FILE_UPLOAD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case PayerBankActionTypes.LOAD_PAYER_BANKS:
    case PayerBankActionTypes.SEARCH_PAYER_BANK:
    case PayerBankActionTypes.ERROR_LOG_DOWNLOAD:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case PayerBankActionTypes.LOAD_PAYER_BANKS_SUCCESS:
      return {
        ...state,
        bankDetails: action.payload.payerBanks,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case PayerBankActionTypes.LOAD_PAYER_BANKS_FAILURE:
    case PayerBankActionTypes.SEARCH_PAYER_BANK_FAILURE:
    case PayerBankActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case PayerBankActionTypes.SEARCH_PAYER_BANK_SUCCESS:
      return {
        ...state,
        bankDetails: action.payload,
        isLoading: false
      };

    case PayerBankActionTypes.RESET_FILE_DATA:
      return {
        ...state,
        bankDetails: [],
        fileResponse: null,
        error: null
      };

    case PayerBankActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        error: null
      };
  }
  return state;
}
