import { createFeatureSelector } from '@ngrx/store';
import { TepProductGroupConfigState } from './tep-product-group-config.state';
import {
  tepProductGroupConfigAdaptor,
  tepProductGroupMappingAdaptor
} from './tep-product-group-config.entity';
import {
  TepProductGroupConfigActions,
  TepProductGroupConfigActionTypes
} from './tep-product-group-config.actons';

export const initialState: TepProductGroupConfigState = {
  tepProductGroupConfiglist: tepProductGroupConfigAdaptor.getInitialState(),
  tepProductGroupConfigDetails: null,
  totalElements: null,
  tepProductGroupMappinglist: tepProductGroupMappingAdaptor.getInitialState(),
  tepProductGroupMappingDetails: null,
  totalMappingElements: null,
  error: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null
};

export const TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME = 'tep_product_group_config';

export const selectTepProductGroupConfig = createFeatureSelector<
  TepProductGroupConfigState
>(TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME);

export function tepProductGroupConfigReducer(
  state: TepProductGroupConfigState = initialState,
  action: TepProductGroupConfigActions
): TepProductGroupConfigState {
  switch (action.type) {
    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING:
    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS:
      return {
        ...state,
        tepProductGroupConfigDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_SUCCESS:
    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepProductGroupConfiglist: tepProductGroupConfigAdaptor.setAll(
          action.payload.results,
          state.tepProductGroupConfiglist
        ),
        tepProductGroupMappinglist: tepProductGroupMappingAdaptor.removeAll(
          state.tepProductGroupMappinglist
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_FAILURE:
    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        tepProductGroupConfiglist: tepProductGroupConfigAdaptor.removeAll(
          state.tepProductGroupConfiglist
        ),
        error: action.payload,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS:
      return {
        ...state,
        tepProductGroupConfigDetails: null,
        tepProductGroupConfiglist: tepProductGroupConfigAdaptor.removeAll(
          state.tepProductGroupConfiglist
        ),
        tepProductGroupMappinglist: tepProductGroupMappingAdaptor.removeAll(
          state.tepProductGroupMappinglist
        ),
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepProductGroupConfigDetails: action.payload,
        error: null,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS:
    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS:
      return {
        ...state,
        tepProductGroupMappinglist: tepProductGroupMappingAdaptor.setAll(
          action.payload.results,
          state.tepProductGroupMappinglist
        ),
        totalMappingElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE:
    case TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepProductGroupConfigDetails: action.payload,
        isLoading: false,
        hasSaved: true
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepProductGroupConfigDetails: action.payload,
        isLoading: false,
        hasUpdated: true
      };

    case TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        error: null,
        isLoading: false
      };

    case TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return { ...state };
  }
}
