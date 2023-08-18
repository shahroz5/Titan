import { createFeatureSelector } from '@ngrx/store';
import { OrderConfirmationState } from './order-confirmation.state';
import {
  OrderConfirmationActionTypes,
  OrderConfirmationActions
} from './order-confirmation.actions';

export const orderConfirmationFeatureKey = 'orderConfirmation';

export const selectOrderConfirmationState = createFeatureSelector<
  OrderConfirmationState
>(orderConfirmationFeatureKey);

export const initialState: OrderConfirmationState = {
  hasError: null,
  isLoading: false,
  updateCashMemoResponse: null
};

export function orderConfirmationReducer(
  state: OrderConfirmationState = initialState,
  action: OrderConfirmationActions
): OrderConfirmationState {
  switch (action.type) {
    case OrderConfirmationActionTypes.CONFIRM_CASH_MEMO:
      return {
        ...state,
        isLoading: true,
        updateCashMemoResponse: null
      };

    case OrderConfirmationActionTypes.CONFIRM_CASH_MEMO_SUCCES:
      return {
        ...state,

        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case OrderConfirmationActionTypes.CONFIRM_CASH_MEMO_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.error
      };

    case OrderConfirmationActionTypes.RESET_VALUES:
      return {
        updateCashMemoResponse: null
      };

    default:
      return state;
  }
}
