import {
  CustomerOrderActions,
  CustomerOrderActionTypes
} from './customer-order.actions';
import { CustomerOrderState } from './customer-order.state';

export const customerOrderFeatureKey = 'customerOrder';

export const initialState: CustomerOrderState = {
  hasError: null,
  isLoading: false,
  fetchedCOItems: [],
  createCORes: null,
  viewCORes: null,
  updateCORes: null,
  partialUpdateCORes: null,
  deleteCoRes: false,
  minCOvalue: 0,
  relationshipTypes: [],
  frozenCOOrderAmount: 0,
  frozenCOOrder: false,
  bestRateCOOrder: false
};

export function customerOrderReducer(
  state: CustomerOrderState = initialState,
  action: CustomerOrderActions
): CustomerOrderState {
  switch (action.type) {
    case CustomerOrderActionTypes.CREATE_CO:
    case CustomerOrderActionTypes.VIEW_CO:
    case CustomerOrderActionTypes.UPDATE_CO:
    case CustomerOrderActionTypes.PARTIAL_UPDATE_CO:
    case CustomerOrderActionTypes.DELETE_CO:
    case CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES:
    case CustomerOrderActionTypes.UPDATE_PRICE_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };
    case CustomerOrderActionTypes.FETCH_CO:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        fetchedCOItems: []
      };

    case CustomerOrderActionTypes.FETCH_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fetchedCOItems: action.payload
      };
    case CustomerOrderActionTypes.CREATE_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        createCORes: action.payload
      };
    case CustomerOrderActionTypes.VIEW_CO_SUCCESS:
    case CustomerOrderActionTypes.UPDATE_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewCORes: action.payload,
        minCOvalue: action.payload.minValue,
        frozenCOOrder: action.payload.isFrozenRate,
        frozenCOOrderAmount: action.payload.isFrozenAmount,
        bestRateCOOrder: action.payload.isBestRate
      };
    case CustomerOrderActionTypes.UPDATE_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCORes: action.payload,
        minCOvalue: action.payload.minValue,
        frozenCOOrderAmount: action.payload.isFrozenAmount,
        frozenCOOrder: action.payload.isFrozenRate,
        bestRateCOOrder: action.payload.isBestRate
      };
    case CustomerOrderActionTypes.PARTIAL_UPDATE_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        partialUpdateCORes: action.payload,
        minCOvalue: action.payload.minValue,
        frozenCOOrderAmount: action.payload.isFrozenAmount,
        frozenCOOrder: action.payload.isFrozenRate,
        bestRateCOOrder: action.payload.isBestRate
      };
    case CustomerOrderActionTypes.DELETE_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deleteCoRes: action.payload,
        minCOvalue: 0,
        frozenCOOrder: false,
        frozenCOOrderAmount: 0,
        bestRateCOOrder: false
      };
    case CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        relationshipTypes: action.payload
      };
    case CustomerOrderActionTypes.FETCH_CO_FAILURE:
    case CustomerOrderActionTypes.CREATE_CO_FAILURE:
    case CustomerOrderActionTypes.VIEW_CO_FAILURE:
    case CustomerOrderActionTypes.UPDATE_CO_FAILURE:
    case CustomerOrderActionTypes.PARTIAL_UPDATE_CO_FAILURE:
    case CustomerOrderActionTypes.DELETE_CO_FAILURE:
    case CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES_FAILURE:
    case CustomerOrderActionTypes.UPDATE_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload
      };

    case CustomerOrderActionTypes.RESET_FETCHED_CO:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        fetchedCOItems: []
      };

    case CustomerOrderActionTypes.RESET_CO_RES:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        createCORes: null,
        viewCORes: null,
        updateCORes: null,
        partialUpdateCORes: null,
        deleteCoRes: false,
        minCOvalue: 0,
        frozenCOOrder: false,
        frozenCOOrderAmount: 0,
        bestRateCOOrder: false
      };
    default:
      return state;
  }
}
