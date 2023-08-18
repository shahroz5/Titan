import { createFeatureSelector } from '@ngrx/store';

import { ComplexityCodeState } from './complexity-code.state';
import {
  ComplexityCodeActions,
  ComplexityCodeActionTypes
} from './complexity-code.actions';

export const initialState: ComplexityCodeState = {
  compexityCodeList: [],
  complexityCode: null,
  isLoading: null,
  error: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null
};
export const complexityCodeFeatureKey = 'complexityCode';
export const selectComplexityCodeState = createFeatureSelector<
  ComplexityCodeState
>(complexityCodeFeatureKey);

export function complexityCodeReducer(
  state: ComplexityCodeState = initialState,
  action: ComplexityCodeActions
) {
  switch (action.type) {
    case ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING:
    case ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE:

    case ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE:
      return {
        ...state,
        isLoading: true
      };
    case ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };

    case ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_SUCCESS:
      return {
        ...state,
        compexityCodeList: action.payload.results,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_FAILURE:
    case ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_SUCCESS:
      return {
        ...state,
        complexityCode: action.payload,
        isLoading: false
      };

    case ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: true
      };
    case ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false
      };
    case ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null,
        hasUpdated: false
      };

    case ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false
      };
    case ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        compexityCodeList: action.payload.results,
        totalElements: action.payload.totalElements
      };
    case ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        compexityCodeList: [],
        isLoading: null
      };

    case ComplexityCodeActionTypes.LOAD_RESET:
      return {
        ...state,
        totalElements: null,
        error: null,
        hasSaved: null,
        hasUpdated: null,
        complexityCode: null,
        compexityCodeList: []
      };
    default:
      return {
        ...state
      };
  }
}
