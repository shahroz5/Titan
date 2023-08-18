import { createFeatureSelector } from '@ngrx/store';
import { CoOrderPaymentConfigState } from './co-order-config.state';
import {
  CoOrderPaymentsConfigActions,
  CoOrderPaymentConfigActionTypes
} from './co-order-config.actions';

export const CoOrderPaymentConfigFeatureKey = 'orderPaymentConfig';
export const selectCoOrderPaymentConfigState = createFeatureSelector<
  CoOrderPaymentConfigState
>(CoOrderPaymentConfigFeatureKey);
export const initialState: CoOrderPaymentConfigState = {
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
  allCoOrderPaymentConfigDetails: [],
  ruleDetailsCount: 0,
  uniqueNameCheckCount: null
};

export function CoOrderPaymentReducer(
  state: CoOrderPaymentConfigState,
  action: CoOrderPaymentsConfigActions
) {
  switch (action.type) {
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        orderConfigList: action.payload.configList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };
    case CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orderConfigList: action.payload.configList,
        totalElements: action.payload.totalElements
      };
    case CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        orderConfig: action.payload,
        isLoading: false
      };
    case CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE:
      return {
        ...state,
        IsUpdated: false,
        isLoading: true
      };
    case CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        IsUpdated: true,
        isLoading: false
      };
    case CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        IsUpdated: null,
        error: action.payload,
        isLoading: null
      };
    case CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true
      };
    case CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoOrderPaymentConfigActionTypes.LOAD_RESET:
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
        allCoOrderPaymentConfigDetails: [],
        ruleDetailsCount: 0,
        uniqueNameCheckCount: null
      };
    case CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configId: action.payload
      };
    case CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG:
      return {
        ...state,
        IsUpdated: false,
        isLoading: true
      };
    case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_SUCCESS:
      return {
        ...state,
        IsUpdated: true,
        isLoading: false
      };
    case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_FAILURE:
      return {
        ...state,
        IsUpdated: null,
        error: action.payload,
        isLoading: null
      };
    case CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES:
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orderPaymentConfigDetails: action.payload.response,
        ruleDetailsCount: action.payload.totalElements
      };
    case CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        orderPaymentConfigDetails: []
      };
    case CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allCoOrderPaymentConfigDetails: action.payload.response
      };
    case CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        allCoOrderPaymentConfigDetails: []
      };

    // case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG:
    //   return {
    //     ...state,
    //     hasUpdated: false,
    //     isLoading: true
    //   };
    // case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_SUCCESS:
    //   return {
    //     ...state,
    //     hasUpdated: true,
    //     isLoading: false
    //   };
    // case CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_FAILURE:
    //   return {
    //     ...state,
    //     hasUpdated: null,
    //     error: action.payload,
    //     isLoading: null
    //   };
    case CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK:
      return {
        ...state,
        isLoading: true,
        error: null,
        uniqueNameCheckCount: null
      };
    case CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: action.payload
      };
    case CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE:
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
