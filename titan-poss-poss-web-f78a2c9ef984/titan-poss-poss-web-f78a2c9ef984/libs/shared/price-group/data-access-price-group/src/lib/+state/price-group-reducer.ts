import { PriceGroupState } from './price-group-state';
import {
  PriceGroupMasterActions,
  PriceGroupMasterActionsTypes
} from './price-group-actions';
import { priceGroupAdaptor } from './price-group-entity';

import { createFeatureSelector } from '@ngrx/store';

export const initialState: PriceGroupState = {
  priceGroupList: priceGroupAdaptor.getInitialState(),
  priceGroup: null,
  error: null,
  isloading: null,
  totalElements: null,
  hasSaved: null,
  hasUpdated: null
};

export const PRICE_GROUP_FEATURE_NAME = 'pricegroup';

export const selectPriceGroupMasterState = createFeatureSelector<
  PriceGroupState
>(PRICE_GROUP_FEATURE_NAME);

export function priceGroupReducer(
  state: PriceGroupState = initialState,
  action: PriceGroupMasterActions
) {
  switch (action.type) {
    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING:
    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE:
    case PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP:
    case PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST:
      return {
        ...state,
        isloading: true
      };
    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_SUCCESS:
      return {
        ...state,
        priceGroupList: priceGroupAdaptor.setAll(
          action.payload.results,
          state.priceGroupList
        ),
        totalElements: action.payload.totalElements,
        isloading: false
      };
    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_FAILURE:
    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE:
    case PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isloading: null
      };

    case PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS:
      return {
        ...state,
        priceGroup: action.payload,
        isloading: false
      };

    case PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE:
      return {
        ...state,
        hasUpdated: false,
        isloading: true
      };
    case PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isloading: false
      };

    case PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isloading: false
      };
    case PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_FAILURE:
      return {
        ...state,
        error: action.payload,
        isloading: false
      };

    case PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_SUCCESS:
      return {
        ...state,
        isloading: false,
        priceGroupList: priceGroupAdaptor.setAll(
          action.payload.results,
          state.priceGroupList
        ),
        totalElements: action.payload.totalElements
      };
    case PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isloading: false,
        priceGroupList: priceGroupAdaptor.removeAll(state.priceGroupList)
      };
    case PriceGroupMasterActionsTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        totalElements: null,
        hasSaved: null,
        hasUpdated: null,
        priceGroup: null,

        priceGroupList: priceGroupAdaptor.removeAll(state.priceGroupList)
      };
    default:
      return {
        ...state
      };
  }
}
