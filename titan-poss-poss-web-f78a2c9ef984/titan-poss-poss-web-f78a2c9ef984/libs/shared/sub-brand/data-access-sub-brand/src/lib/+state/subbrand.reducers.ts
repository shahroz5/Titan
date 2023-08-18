import { SubBrandState } from './subbrand.state';
import {
  SubBrandMasterActions,
  SubBrandMasterActionTypes
} from './subbrand.actions';
import { createFeatureSelector } from '@ngrx/store';
import { subBrandAdaptor } from './subbrand.entity';

export const initialState: SubBrandState = {
  subBrandList: subBrandAdaptor.getInitialState(),
  totalElements: null,
  error: null,
  isLoading: null,
  subBrandDetails: null,
  hasUpdated: null,
  hasSaved: null,
  parentBrands: null,
  isActiveUpdated: null
};

export const SUB_BRAND_FEATURE_NAME = 'subbrand';

export const selectSubBrandMaster = createFeatureSelector<SubBrandState>(
  SUB_BRAND_FEATURE_NAME
);
export function SubbrandReducer(
  state: any = initialState,
  action: SubBrandMasterActions
) {
  switch (action.type) {
    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING:
      return {
        ...state,
        error: null,
        isLoading: true,
        isActiveUpdated: false
      };

    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_SUCCESS:
      return {
        ...state,
        subBrandList: subBrandAdaptor.setAll(
          action.payload.results,
          state.subBrandList
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isBrandListLoading: false,
        isSearching: true,
        isActiveUpdated: false,
        isLoading: false
      };

    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_FAILURE:
      return {
        ...state,
        isSearching: true,
        error: action.payload,

        isLoading: false
      };
    case SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS:
      return {
        ...state,
        error: null,
        hasSaved: false,
        subBrandDetails: null,
        isLoading: true
      };

    case SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_SUCCESS:
      return {
        ...state,
        error: null,
        brandDetails: null,
        subBrandDetails: null,
        hasSaved: true,
        isLoading: false
      };
    case SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        hasSaved: false,
        subBrandDetails: null,
        isLoading: false
      };

    case SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS:
      return {
        ...state,
        error: null,
        brandDetails: null,
        hasUpdated: false,
        hasSaved: null,
        isLoading: true
      };

    case SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_SUCCESS:
      return {
        ...state,
        brandDetails: null,
        subBrandDetails: null,
        error: null,
        hasSaved: null,
        hasUpdated: true,
        isLoading: false
      };
    case SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        subBrandDetails: null,
        isLoading: false,
        hasUpdated: false
      };

    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE:
      return {
        ...state,
        brandDetails: null,
        error: null,
        isLoading: true,
        isActiveUpdated: false
      };

    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_SUCCESS:
      return {
        ...state,
        error: null,

        subBrandDetails: action.payload,
        isLoading: false
      };
    case SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case SubBrandMasterActionTypes.UPDATE_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        error: null,
        isActiveUpdated: false
      };
    case SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isActiveUpdated: true
      };
    case SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isActiveUpdated: false
      };

    case SubBrandMasterActionTypes.LOAD_PARENT_BRANDS:
      return {
        ...state
      };

    case SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_SUCCESS:
      return {
        ...state,
        error: null,
        parentBrands: action.payload
      };
    case SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case SubBrandMasterActionTypes.LOAD_RESET_BRAND_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: null,
        subBrandDetails: null,

        subBrandList: subBrandAdaptor.removeAll(state.subBrandList),
        hasSaved: null,
        hasUpdated: null,
        totalElements: null
      };

    case SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_SUCCESS:
      return {
        ...state,
        subBrandList: subBrandAdaptor.setAll(
          action.payload.results,
          state.subBrandList
        ),
        totalElements: action.payload.totalElements,
        error: null
      };
    case SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        subBrandList: subBrandAdaptor.removeAll(state.subBrandList)
      };

    case SubBrandMasterActionTypes.RESET_IS_ACTIVE:
      return {
        ...state,
        isActiveUpdated: false
      };
    default:
      return state;
  }
}
