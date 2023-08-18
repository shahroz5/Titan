import { createFeatureSelector } from '@ngrx/store';

import { UcpMarketCodeFactorState } from './ucp-market-code-factor.state';
import {
  UCPMarketCodeFactorCodeActions,
  UcpMarketCodeFactorActionTypes
} from './ucp-market-code-factor.action';

export const initialState: UcpMarketCodeFactorState = {
  ucpMarketCodeList: [],
  ucpMarketCode: null,
  isLoading: null,
  error: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  marketCode: [],
  ucpProductGroup: []
};
export const ucpMarketCodeFactorFeatureKey = 'ucpMarketCodeFactor';
export const selectUcpMarketCodeFactorState = createFeatureSelector<
  UcpMarketCodeFactorState
>(ucpMarketCodeFactorFeatureKey);

export function ucpMarketCodeFactorReducer(
  state: UcpMarketCodeFactorState = initialState,
  action: UCPMarketCodeFactorCodeActions
) {
  switch (action.type) {
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING:
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE:
    case UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE:
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE:
      return {
        ...state,
        isLoading: true
      };
    case UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ucpProductGroup: action.payload
      };
    case UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        marketCode: action.payload
      };
    case UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_SUCCESS:
      return {
        ...state,
        ucpMarketCodeList: action.payload.results,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_FAILURE:
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_FAILURE:
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_FAILURE:
    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS:
      return {
        ...state,
        ucpMarketCode: action.payload,
        isLoading: false
      };

    case UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false
      };
    case UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null,
        hasUpdated: false
      };

    case UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false
      };
    case UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case UcpMarketCodeFactorActionTypes.LOAD_RESET:
      return {
        ...state,
        totalElements: null,
        error: null,
        hasSaved: null,
        hasUpdated: null,
        ucpMarketCodeList: [],
        ucpMarketCode: null,
        marketCode: [],
        ucpProductGroup: []
      };
    default:
      return {
        ...state
      };
  }
}
