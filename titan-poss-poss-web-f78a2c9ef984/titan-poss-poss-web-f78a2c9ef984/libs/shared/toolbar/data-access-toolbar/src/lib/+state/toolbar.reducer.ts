import { createFeatureSelector } from '@ngrx/store';

import { ToolbarState } from './toolbar.state';
import { ToolbarActions, ToolbarActionTypes } from './toolbar.actions';

export const TOOLBAR_FEATURE_KEY = 'Toolbar';

export const selectToolbarState = createFeatureSelector<ToolbarState>(
  TOOLBAR_FEATURE_KEY
);

export const initialState: ToolbarState = {
  hasError: null,
  isLoading: false,
  metalPriceDetails: [],
  previousMetalPriceDetails: [],
  openOrdersResponse: [],
  openOrdersCount: [],
  onHoldResponse: [],
  onHoldCount: [],
  toolbarConfig: null,
  confirmOrdersResponse: []
};

export function toolbarReducer(
  state: ToolbarState = initialState,
  action: ToolbarActions
): ToolbarState {
  switch (action.type) {
    case ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS:
    case ToolbarActionTypes.LOAD_OPENORDERS:
    case ToolbarActionTypes.LOAD_OPENORDERS_COUNT:
    case ToolbarActionTypes.LOAD_ONHOLD:
    case ToolbarActionTypes.LOAD_ONHOLD_COUNT:
    case ToolbarActionTypes.LOAD_CONFIRMORDERS:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE:
    case ToolbarActionTypes.LOAD_OPENORDERS_FAILURE:
    case ToolbarActionTypes.LOAD_OPENORDERS_COUNT_FAILURE:
    case ToolbarActionTypes.LOAD_ONHOLD_FAILURE:
    case ToolbarActionTypes.LOAD_ONHOLD_COUNT_FAILURE:
    case ToolbarActionTypes.LOAD_CONFIRMORDERS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS:
      if (
        JSON.stringify(action.payload) !==
        JSON.stringify(state.metalPriceDetails)
      ) 
        return {
          ...state,
          isLoading: false,
          previousMetalPriceDetails: state.metalPriceDetails,
          metalPriceDetails: action.payload
        };
      return  {
        ...state,
        isLoading: false
      };

    case ToolbarActionTypes.LOAD_OPENORDERS_SUCCESS:
      return {
        ...state,
        openOrdersResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.LOAD_OPENORDERS_COUNT_SUCCESS:
      return {
        ...state,
        openOrdersCount: action.payload,
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.LOAD_ONHOLD_SUCCESS:
      return {
        ...state,
        onHoldResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.LOAD_ONHOLD_COUNT_SUCCESS:
      return {
        ...state,
        onHoldCount: action.payload,
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.LOAD_CONFIRMORDERS_SUCCESS:
      return {
        ...state,
        confirmOrdersResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.RESET_OPENORDERS:
      return {
        ...state,
        openOrdersResponse: [],
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.RESET_ONHOLD:
      return {
        ...state,
        onHoldResponse: [],
        isLoading: false,
        hasError: null
      };

    case ToolbarActionTypes.RESET_VALUES:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        metalPriceDetails: [],
        previousMetalPriceDetails: [],
        openOrdersResponse: [],
        openOrdersCount: [],
        onHoldResponse: [],
        onHoldCount: [],
        toolbarConfig: null,
        confirmOrdersResponse: []
      };

    case ToolbarActionTypes.SET_TOOLBAR_CONFIG:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        toolbarConfig: action.payload
      };

    case ToolbarActionTypes.RESET_CONFIRMORDERS:
      return {
        ...state,
        confirmOrdersResponse: [],
        isLoading: false,
        hasError: null
      };

    default:
      return state;
  }
}
