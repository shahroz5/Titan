import { createFeatureSelector } from '@ngrx/store';
import { OrderPaymentConfigState } from './order-config.state';
import {
  OrderPaymentsConfigActions,
  OrderPaymentConfigActionTypes
} from './order-config.actions';

export const OrderPaymentConfigFeatureKey = 'orderPaymentConfig';
export const selectOrderPaymentConfigState = createFeatureSelector<
  OrderPaymentConfigState
>(OrderPaymentConfigFeatureKey);
export const initialState: OrderPaymentConfigState = {
  orderConfigList: [],
  orderConfig: null,
  error: null,
  hasSaved: false,
  IsUpdated: false,
  isLoading: false,
  totalElements: null,
  productGroups: [],
  configId: null,
  isCleared: null,
  orderPaymentConfigDetails: [],
  allOrderPaymentConfigDetails: [],
  ruleDetailsCount: 0,
  uniqueNameCheckCount: null,
};

export function OrderPaymentReducer(
  state: OrderPaymentConfigState,
  action: OrderPaymentsConfigActions
) {
  switch (action.type) {
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        orderConfigList: action.payload.configList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };
    case OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orderConfigList: action.payload.configList,
        totalElements: action.payload.totalElements
      };
    case OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        orderConfig: action.payload,
        isLoading: false
      };
    case OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE:
      return {
        ...state,
        IsUpdated: false,
        isLoading: true
      };
    case OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        IsUpdated: true,
        isLoading: false
      };
    case OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        IsUpdated: null,
        error: action.payload,
        isLoading: null
      };
    case OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true
      };
    case OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case OrderPaymentConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        IsUpdated: null,
        hasSaved: null,
        orderConfigList: [],
        orderConfig: null,
        error: null,
        configId: null,
        productGroups: [],
        orderPaymentConfigDetails: [],
        allOrderPaymentConfigDetails: [],
        ruleDetailsCount: 0,
        uniqueNameCheckCount: null
      };
    case OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configId: action.payload
      };
    case OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG:
      return {
        ...state,
        IsUpdated: false,
        isLoading: true
      };
    case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_SUCCESS:
      return {
        ...state,
        IsUpdated: true,
        isLoading: false
      };
    case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_FAILURE:
      return {
        ...state,
        IsUpdated: null,
        error: action.payload,
        isLoading: null
      };
    case OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES:
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orderPaymentConfigDetails: action.payload.response,
        ruleDetailsCount: action.payload.totalElements
      };
    case OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        orderPaymentConfigDetails: []
      };
    case OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allOrderPaymentConfigDetails: action.payload.response
      };
    case OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        allOrderPaymentConfigDetails: []
      };

    // case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG:
    //   return {
    //     ...state,
    //     hasUpdated: false,
    //     isLoading: true
    //   };
    // case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_SUCCESS:
    //   return {
    //     ...state,
    //     hasUpdated: true,
    //     isLoading: false
    //   };
    // case OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_FAILURE:
    //   return {
    //     ...state,
    //     hasUpdated: null,
    //     error: action.payload,
    //     isLoading: null
    //   };
    case OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK:
      return {
        ...state,
        isLoading: true,
        error: null,
        uniqueNameCheckCount: null
      };
    case OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: action.payload
      };
    case OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: null,
        error: action.payload
      };
    default:
      return {
        ...state
      };
  }
}
