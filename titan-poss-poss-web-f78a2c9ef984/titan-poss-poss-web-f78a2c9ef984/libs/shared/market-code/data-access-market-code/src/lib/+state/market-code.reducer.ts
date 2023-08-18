import { MarketCodeState } from './market-code.state';
import {
  MarketCodeActions,
  MarketCodeActionTypes
} from './market-code.actions';
import { createFeatureSelector } from '@ngrx/store';
export const initialState: MarketCodeState = {
  error: null,
  isLoading: false,
  marketCodeListing: null,
  totalMarketCodes: null,
  marketCodeDetails: null,
  hasSavedMarketDetails: null,
  hasSavedMarketCodeFactors: null,
  hasUpdatedMarketDetails: null,
  hasUpdatedMarketCodeFacators: null,
  hasToggleButton: false
};
export const MARKET_CODE_FEATURE_KEY = 'marketCOde';
export const selectMarketCodeState = createFeatureSelector<MarketCodeState>(
  MARKET_CODE_FEATURE_KEY
);
export function MarketCodeReducer(
  state: MarketCodeState = initialState,
  action: MarketCodeActions
): MarketCodeState {
  switch (action.type) {
    case MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS:
    case MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE:
    case MarketCodeActionTypes.SEARCH_MARKET_CODE:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_FAILURE:
    case MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_FAILURE:
    case MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_FAILURE:
    case MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_FAILURE:
    case MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case MarketCodeActionTypes.LOAD_MARKET_CODES_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        marketCodeListing: action.payload.marketCodeListing,
        totalMarketCodes: action.payload.totalElements
      };

    case MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        marketCodeDetails: action.payload
      };

    case MarketCodeActionTypes.RESET_MARKET_CODE_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: false,
        marketCodeDetails: null,
        hasSavedMarketDetails: null,
        hasUpdatedMarketDetails: null,
        hasSavedMarketCodeFactors: null,
        hasUpdatedMarketCodeFacators: null,
        hasToggleButton: null
      };

    case MarketCodeActionTypes.SEARCH_MARKET_CODE_SUCCESS:
      return {
        ...state,
        marketCodeListing: action.payload,
        isLoading: false,
        totalMarketCodes: 0
      };

    case MarketCodeActionTypes.SEARCH_MARKET_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        marketCodeListing: null,
        isLoading: false,
        totalMarketCodes: 0
      };
    case MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSavedMarketDetails: null
      };
    case MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSavedMarketDetails: true
      };

    case MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdatedMarketDetails: null
      };
    case MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdatedMarketDetails: true
      };
    case MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasUpdatedMarketDetails: false
      };
    case MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS:
      return {
        ...state,
        isLoading: true,
        hasSavedMarketCodeFactors: null
      };
    case MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSavedMarketCodeFactors: true
      };

    case MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS:
      return {
        ...state,
        hasUpdatedMarketCodeFacators: null,
        isLoading: true
      };
    case MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_SUCCESS:
      return {
        ...state,
        hasUpdatedMarketCodeFacators: true,
        isLoading: false
      };

    case MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON:
      return {
        ...state,
        hasToggleButton: false,
        isLoading: true
      };
    case MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS:
      return {
        ...state,
        hasToggleButton: true,
        isLoading: false
      };
    case MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS:
      return {
        ...state,
        hasToggleButton: false,
        isLoading: false
      };

    default: {
      return { ...state };
    }
  }
}
