import { createFeatureSelector } from '@ngrx/store';
import { PaymentMasterState } from './payment-master.state';
import {
  PaymentMasterActions,
  PaymentMasterActionTypes
} from './payment-master.actions';

export const initialState: PaymentMasterState = {
  paymentMasterList: null,
  paymentMaster: null,
  error: null,
  isLoading: null,
  totalElements: null,
  hasSaved: null,
  hasUpdated: null
};

export const PAYMENT_MASTER_FEATURE_NAME = 'paymentMaster';

export const selectPaymentMasterState = createFeatureSelector<
  PaymentMasterState
>(PAYMENT_MASTER_FEATURE_NAME);

export function paymentMasterReducers(
  state: PaymentMasterState = initialState,
  action: PaymentMasterActions
) {
  switch (action.type) {
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING:
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE:
    case PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER:
      return {
        ...state,
        isLoading: true
      };

    case PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case PaymentMasterActionTypes.SAVE_PAYMENT_MASTER:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_SUCCESS:
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentMasterList: action.payload.results,
        totalElements: action.payload.totalElements
      };
    case PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_FAILURE:
    case PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_FAILURE:
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_FAILURE:
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        hasSaved: false,
        error: action.payload,
        isLoading: null
      };
    case PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false
      };
    case PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false
      };
    case PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_FAILURE:
      return {
        ...state,
        paymentMasterList: [],
        error: action.payload,
        isLoading: null
      };
    case PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_SUCCESS:
      return {
        ...state,
        paymentMaster: action.payload,
        isLoading: false
      };
    case PaymentMasterActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        paymentMaster: null,
        totalElements: null,
        hasSaved: null,
        hasUpdated: null
      };

    default:
      return state;
  }
}
