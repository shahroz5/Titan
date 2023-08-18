import { BrandMasterState } from './brand-master.state';
import {
  BrandMasterActions,
  BrandMasterActionTypes
} from './brand-master.actons';
import { brandAdaptor } from './brand-master.entity';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: BrandMasterState = {
  brandlist: brandAdaptor.getInitialState(),
  totalElements: null,
  error: null,
  brandDetails: null,
  isLoading: null,
  hasSaved: null
};

export const BRAND_FEATURE_NAME = 'brandmaster';

export const selectBrandMaster = createFeatureSelector<BrandMasterState>(
  BRAND_FEATURE_NAME
);

export function brandMasterReducer(
  state: BrandMasterState = initialState,
  action: BrandMasterActions
) {
  switch (action.type) {
    case BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING:
    case BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS:
      return {
        ...state,
        brandDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null
      };


    case BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_SUCCESS:
      return {
        ...state,
        brandlist: brandAdaptor.setAll(action.payload.results, state.brandlist),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_FAILURE:
    case BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_SUCCESS:
      return {
        ...state,
        brandlist: brandAdaptor.setAll(action.payload.results, state.brandlist),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        brandlist: brandAdaptor.removeAll(state.brandlist),
        error: action.payload,
        isLoading: false
      };

    case BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS_SUCCESS:

      return {
        ...state,
        brandDetails: action.payload,
        isLoading: false
      };


    case BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS:
      return {
        ...state,
        error: null,
        hasSaved: false,
        isLoading: true
      };

    case BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_SUCCESS:
      return {
        ...state,
        error: null,
        brandDetails: action.payload,
        hasSaved: true,
        isLoading: false
      };

    case BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        hasSaved: false,
        isLoading: false
      };


    case BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS:
      return {
        ...state,
        error: null,
        hasSaved: false,
        isLoading: true
      };
    case BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_SUCCESS:
      return {
        ...state,
        brandDetails: action.payload,
        error: null,
        hasSaved: true,
        isLoading: false
      };
    case BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasSaved: false
      };

    default:
      return { ...state };
  }
}
