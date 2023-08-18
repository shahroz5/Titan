import { BankDepositState } from './bank-deposit.state';
import {
  BankDepositActions,
  BankDepositActionTypes
} from './bank-deposit.actions';

export const initialState: BankDepositState = {
  isLoading: false,
  error: null,
  bankDepositData: null,
  transacionDetails: null
};

export function BankDepositReducer(
  state: BankDepositState = initialState,
  action: BankDepositActions
): BankDepositState {
  switch (action.type) {
    case BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST:
      return {
        ...state,
        isLoading: true
      };

    case BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_SUCCESS:
      return {
        ...state,
        bankDepositData: action.payload,
        isLoading: false
      };

    case BankDepositActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case BankDepositActionTypes.RESET_VALUES:
      return {
        ...state,
        bankDepositData: null,
        transacionDetails: null
      };

    case BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BankDepositActionTypes.GET_TRANSACTION_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null,
        transacionDetails: null
      };

    case BankDepositActionTypes.GET_TRANSACTION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        transacionDetails: action.payload
      };

    case BankDepositActionTypes.GET_TRANSACTION_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        transacionDetails: null,
        error: action.payload
      };

    default:
      return state;
  }
}
