import { CustomerTransactionConfigState } from './customer-transaction-config.state';
import { createFeatureSelector } from '@ngrx/store';
import {
  CustomerTransactionConfigActions,
  CustomerTransactionConfigActionTypes
} from './customer-transaction-config.actions';
export const CUSTOMER_TRANSACTION_CONFIG_KEY = 'CustomerTransactionConfig';
export const selectCustomerTransactionState = createFeatureSelector<
  CustomerTransactionConfigState
>(CUSTOMER_TRANSACTION_CONFIG_KEY);
export const initialState: CustomerTransactionConfigState = {
  error: null,
  configList: null,
  totalElements: 0,
  isLoading: false,
  hasSearched: null,
  hasStatusUpdated: false,
  transactionTypes: null,
  customers: null,
  hasSaved: false,
  hasUpdated: false,
  configId: null,
  customerTranConfigDetails: null
};
export function CustomerTransactionConfigReducer(
  state: CustomerTransactionConfigState = initialState,
  action: CustomerTransactionConfigActions
) {
  switch (action.type) {
    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST:
    case CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES:
    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS:
    case CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configList: action.payload.configList,
        totalElements: action.payload.totalElements
      };
    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_FAILURE:
    case CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_FAILURE:
    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_FAILURE:
    case CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME:
      return {
        ...state,
        isLoading: true,
        hasSearched: false
      };
    case CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        configList: action.payload,
        totalElements: 0
      };
    case CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSearched: false,
        error: action.payload
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS:
      return {
        ...state,
        isLoading: true,
        hasStatusUpdated: false
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasStatusUpdated: true
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasStatusUpdated: false,
        error: action.payload
      };
    case CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactionTypes: action.payload
      };
    case CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customers: action.payload
      };
    case CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload
      };
    case CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    case CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customerTranConfigDetails: action.payload
      };

    case CustomerTransactionConfigActionTypes.RESET_CUSTOMER_CONFIGS:
      return {
        ...state,
        configId: null,
        hasSaved: false,
        hasUpdated: false,
        error: null,
        hasStatusUpdated: false,
        customerTranConfigDetails: null,
        configType: null
      };
    default:
      return { ...state };
  }
}
