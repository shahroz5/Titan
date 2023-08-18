import { MarketMaterialPriceState } from './market-material-price.state';
import {
  MarketMaterialPriceActionTypes,
  MarketMaterialPriceActions
} from './market-material-price.actions';
import {
  marketAdaptor,
  locationDetailAdaptor,
  selectedStockAdaptor
} from './market-material-price.entity';

import { Update } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: MarketMaterialPriceState = {
  error: null,
  materialPriceType: null,
  materialTypes: null,
  metalPriceDetails: null,
  isLoading: null,
  marketDetailsBasedOnMaterial: marketAdaptor.getInitialState(),
  totalElements: null,
  locationDetails: locationDetailAdaptor.getInitialState(),
  hasSaved: null,
  hasNewViewLocationPriceSuccess: false,
  locationDetailsCount: null,
  computedPriceSearchResult: locationDetailAdaptor.getInitialState(),
  computedPriceSearchResultCount: null,
  date: null,
  selectedStock: selectedStockAdaptor.getInitialState(),
  hasMarketDetailsBasedOnMaterialLoaded: false,
  allSelected: null,
  isValueResetToZero: false,
  totalMetalTypePriceCount: null
};
export const MARKET_MATERIAL_PRICE_FEATURE_KEY = 'marketMaterialPrice';
export const selectMarketMaterialPriceState = createFeatureSelector<
  MarketMaterialPriceState
>(MARKET_MATERIAL_PRICE_FEATURE_KEY);
export function marketMaterialPriceReducer(
  state: MarketMaterialPriceState = initialState,
  action: MarketMaterialPriceActions
): MarketMaterialPriceState {
  switch (action.type) {
    case MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS:
    case MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE:
    case MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE:
    case MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE:
    case MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE:
    case MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE:
    case MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL:
    case MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO:
      return {
        ...state,
        isLoading: true
      };

    case MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE:
    case MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE:
      return {
        ...state,
        isLoading: true,
        locationDetails: null,
        hasNewViewLocationPriceSuccess: false,
        locationDetailsCount: null
      };

    case MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isValueResetToZero: true
      };

    case MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalPriceDetails: action.payload.materialPriceList,
        totalMetalTypePriceCount: action.payload.totalCount
      };

    case MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          action.payload.marketDetails,
          state.marketDetailsBasedOnMaterial
        ),
        totalElements: action.payload.totalCount
      };
    case MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_FAILURE:
    case MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE:
    case MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case MarketMaterialPriceActionTypes.SAVE_PRICE:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case MarketMaterialPriceActionTypes.SAVE_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        allSelected: false
      };
    case MarketMaterialPriceActionTypes.SAVE_PRICE_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        hasSaved: false
      };

    case MarketMaterialPriceActionTypes.COMPUTE_BASE_PRICE:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              computedPrice: action.payload.computedPrice,
              isChecked: action.payload.isChecked
            }
          },

          state.marketDetailsBasedOnMaterial
        ),
        selectedStock: selectedStockAdaptor.addOne(
          action.payload,
          state.selectedStock
        )
      };

    case MarketMaterialPriceActionTypes.UPDATE_CHECKBOX:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.updateMany(
          action.payload.ids.map(
            (id): Update<any> => ({
              id: id,
              changes: {
                isChecked: action.payload.isChecked,
                computedPrice: ''
              }
            })
          ),
          state.marketDetailsBasedOnMaterial
        ),

        selectedStock: selectedStockAdaptor.removeAll(state.selectedStock),
        allSelected: false
      };

    case MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_SUCCESS:
    case MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        locationDetails: locationDetailAdaptor.setAll(
          action.payload.locationDetails,
          state.locationDetails
        ),
        hasNewViewLocationPriceSuccess: true,
        locationDetailsCount: action.payload.totalCount
      };
    case MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_FAILURE:
    case MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        hasNewViewLocationPriceSuccess: false
      };

    case MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_SUCCESS:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          action.payload.marketDetails,
          state.marketDetailsBasedOnMaterial
        ),
        isLoading: false,
        totalElements: 0
      };

    case MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        marketDetailsBasedOnMaterial: marketAdaptor.removeAll(
          state.marketDetailsBasedOnMaterial
        ),
        isLoading: false,
        totalElements: 0
      };

    case MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_SUCCESS:
      return {
        ...state,
        computedPriceSearchResult: locationDetailAdaptor.setAll(
          action.payload.locationDetails,
          state.locationDetails
        ),
        isLoading: false,
        computedPriceSearchResultCount: 1
      };

    case MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_FAILURE:
    case MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        locationDetailsCount: 0
      };

    case MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_SUCCESS:
      return {
        ...state,
        locationDetails: locationDetailAdaptor.setAll(
          action.payload.locationDetails,
          state.locationDetails
        ),
        isLoading: false,
        locationDetailsCount: action.payload.totalCount
      };

    case MarketMaterialPriceActionTypes.LOAD_RESET:
      return {
        ...state,
        locationDetails: locationDetailAdaptor.removeAll(state.locationDetails),
        marketDetailsBasedOnMaterial: marketAdaptor.removeAll(
          state.marketDetailsBasedOnMaterial
        ),

        locationDetailsCount: null,
        totalElements: null,
        error: null,
        hasNewViewLocationPriceSuccess: null,
        hasSaved: null,
        metalPriceDetails: [],
        totalMetalTypePriceCount: null,
        isValueResetToZero: false,
        isLoading: false
      };
    case MarketMaterialPriceActionTypes.LOAD_RESET_SELECTED_STOCK:
      return {
        ...state,
        selectedStock: selectedStockAdaptor.removeAll(state.selectedStock)
      };
    case MarketMaterialPriceActionTypes.LOAD_RESET_LOCATION_DATA:
      return {
        ...state,
        locationDetails: locationDetailAdaptor.removeAll(state.locationDetails),
        locationDetailsCount: null,
        hasNewViewLocationPriceSuccess: null,
        computedPriceSearchResult: locationDetailAdaptor.removeAll(
          state.computedPriceSearchResult
        ),
        computedPriceSearchResultCount: null
      };
    case MarketMaterialPriceActionTypes.UPDATE_SELECTED_DATE:
      return {
        ...state,
        date: action.payload
      };

    case MarketMaterialPriceActionTypes.UPDATE_SELECTED_STOCK:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              computedPrice: action.payload.computedPrice,
              isChecked: action.payload.isChecked
            }
          },

          state.marketDetailsBasedOnMaterial
        ),
        selectedStock: selectedStockAdaptor.removeOne(
          action.payload.id,
          state.selectedStock
        )
      };
    case MarketMaterialPriceActionTypes.COMPUTE_PRICE_FOR_ALL:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          action.payload,
          state.marketDetailsBasedOnMaterial
        ),
        allSelected: true
      };
    case MarketMaterialPriceActionTypes.REMOVE_PRICE_FOR_ALL:
      return {
        ...state,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          action.payload,
          state.marketDetailsBasedOnMaterial
        ),
        allSelected: false
      };
    case MarketMaterialPriceActionTypes.UPDATE_ALL_SELECTED:
      return {
        ...state,
        allSelected: action.payload
      };
    case MarketMaterialPriceActionTypes.UPDATE_HAS_NEW_VIEW_LOCATION_PRICE:
      return {
        ...state,
        hasNewViewLocationPriceSuccess: action.payload
      };
    default: {
      return {
        ...state
      };
    }
  }
}
