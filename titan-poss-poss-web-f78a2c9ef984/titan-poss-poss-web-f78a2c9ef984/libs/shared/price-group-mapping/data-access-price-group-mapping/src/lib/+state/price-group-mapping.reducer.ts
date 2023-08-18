import { createFeatureSelector } from '@ngrx/store';

import {
  PriceGroupMappingActions,
  PriceGroupMappingActionTypes
} from './price-group-mapping.actons';
import { PriceGroupMappingState } from './price-group-mapping.state';
import { PriceGroupMasterAdaptor } from './price-group-mapping.entity';

export const initialState: PriceGroupMappingState = {
  priceGrouplist: PriceGroupMasterAdaptor.getInitialState(),
  priceGroupTotalElements: null,
  locationList: [],
  priceGroupTypelist: [],
  locationPriceGroupMappingList: [],
  error: null,
  isLoading: null,
  hasSaved: null
};

export const PRICE_GROUP_MAPPING_FEATURE_NAME = 'price_group_mapping';

export const selectPriceGroupMapping = createFeatureSelector<
  PriceGroupMappingState
>(PRICE_GROUP_MAPPING_FEATURE_NAME);

export function priceGroupMappingReducer(
  state: PriceGroupMappingState = initialState,
  action: PriceGroupMappingActions
): PriceGroupMappingState {
  switch (action.type) {
    case PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST:
      return {
        ...state,
        isLoading: true,
        hasSaved: null,
        error: null
      };
    case PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_SUCCESS:
      return {
        ...state,
        locationPriceGroupMappingList: action.payload,
        isLoading: false,
        error: null
      };
    case PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.LOAD_LOCATION_LIST:
      return {
        ...state,
        priceGroupTypelist: [],
        isLoading: true,
        error: null
      };

    case PriceGroupMappingActionTypes.LOAD_LOCATION_LIST_SUCCESS:
      return {
        ...state,
        locationList: action.payload,
        isLoading: false,
        error: null
      };

    case PriceGroupMappingActionTypes.LOAD_LOCATION_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST_SUCCESS:
      return {
        ...state,
        priceGroupTypelist: action.payload,
        isLoading: false,
        error: null
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING:
      return {
        ...state,
        isLoading: true,
        hasSaved: null,
        error: null
      };

    case PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false,
        error: null
      };

    case PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING_FAILURE:
      return {
        ...state,
        error: action.payload,
        hasSaved: false,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST_SUCCESS:
      return {
        ...state,
        priceGrouplist: PriceGroupMasterAdaptor.setAll(
          action.payload.results,
          state.priceGrouplist
        ),
        priceGroupTotalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST_FAILURE:
      return {
        ...state,
        priceGrouplist: PriceGroupMasterAdaptor.removeAll(state.priceGrouplist),
        error: action.payload,
        isLoading: false
      };

    case PriceGroupMappingActionTypes.RESET_PRICE_GROUP_MAPPING:
      return {
        ...state,
        locationPriceGroupMappingList: [],
        isLoading: false,
        error: null,
        locationList: [],
        hasSaved: null
      };

    default:
      return { ...state };
  }
}
