import { createFeatureSelector } from '@ngrx/store';

import { GlBoutiqueLocationState } from './gl-boutique.state';
import {
  GlBoutiqueLocationActions,
  GlBoutiqueLocationActionTypes
} from './gl-botique.action';

export const GL_BTQ_LOCATION_FEATURE_KEY = 'GlBoutique';
export const selectglBtqLocationState = createFeatureSelector<
  GlBoutiqueLocationState
>(GL_BTQ_LOCATION_FEATURE_KEY);

export const initialState: GlBoutiqueLocationState = {
  error: null,
  glBoutiqueLocationList: null,
  glBoutiqueLocationDetails: null,
  totalGlBoutiqueLocation: 0,
  isLoading: false,
  hasSaved: false,
  hasUpdated: false,
  saveGlBoutiqueLocation: null,
  editGlBoutiqueLocation: null
};

export function GlBoutiqueLocationReducer(
  state: GlBoutiqueLocationState = initialState,
  action: GlBoutiqueLocationActions
): GlBoutiqueLocationState {
  switch (action.type) {
    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST:
    case GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS:
    case GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS:
    case GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE:
      return {
        ...state,
        isLoading: true,
        hasSaved: false,
        hasUpdated: false
      };

    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_SUCCESS:
      return {
        ...state,
        glBoutiqueLocationList: action.payload.glBoutiqueLocationListing,
        totalGlBoutiqueLocation: action.payload.totalElements,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false
      };
    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE:
      return {
        ...state,
        isLoading: true,
        glBoutiqueLocationDetails: null,
        hasSaved: false,
        hasUpdated: false
      };

    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_SUCCESS:
      console.log(action.payload);

      return {
        ...state,
        glBoutiqueLocationDetails: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false
      };
    case GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_SUCCESS:
      return {
        ...state,
        glBoutiqueLocationList: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        totalGlBoutiqueLocation: 0
      };
    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_FAILURE:
    case GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_FAILURE:
    case GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_FAILURE:
    case GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_FAILURE:
    case GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false
      };

    case GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        hasUpdated: false,
        saveGlBoutiqueLocation: action.payload,
        glBoutiqueLocationList: [
          ...state.glBoutiqueLocationList,
          action.payload
        ]
      };

    case GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        hasUpdated: true,
        editGlBoutiqueLocation: action.payload
      };
    case GlBoutiqueLocationActionTypes.RESET_GL_BOUTIQUE:
      return {
        ...state,
        glBoutiqueLocationDetails: null,
        isLoading: false,
        hasSaved: false,
        error: null
      };
    default:
      return state;
  }
}
