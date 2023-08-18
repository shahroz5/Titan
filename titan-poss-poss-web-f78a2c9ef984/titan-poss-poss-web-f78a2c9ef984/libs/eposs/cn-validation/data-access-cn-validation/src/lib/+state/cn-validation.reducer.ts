import { createFeatureSelector } from '@ngrx/store';
import { CnValidationState } from './cn-validation.state';
import {
  CnValidationActions,
  CnValidationActionTypes
} from './cn-validation.actions';

export const cnValidationKey = 'cnValidation';
export const selectCnValidationState = createFeatureSelector<CnValidationState>(
  cnValidationKey
);
export const initialState: CnValidationState = {
  cnValidationList: null,
  isLoading: null,
  error: null,
  cnValidation: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  cnTypeList: null
};

export function cnValidationReducer(
  state: CnValidationState,
  action: CnValidationActions
) {
  switch (action.type) {
    case CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE:

    case CnValidationActionTypes.LOAD_CN_VALIDATION_LIST:

    case CnValidationActionTypes.SAVE_CN_VALIDATION:
    case CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID:
    case CnValidationActionTypes.LOAD_CN_TYPE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_SUCCESS:
    case CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_SUCCESS:
      return {
        ...state,
        cnValidationList: action.payload.cnValidationList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };

    case CnValidationActionTypes.LOAD_CN_TYPE_LIST_SUCCESS:
      return {
        ...state,
        cnTypeList: action.payload
      };

    case CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_FAILURE:
    case CnValidationActionTypes.SAVE_CN_VALIDATION_FAILURE:

    case CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_FAILURE:
    case CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_FAILURE:
    case CnValidationActionTypes.LOAD_CN_TYPE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_SUCCESS:
      return {
        ...state,
        cnValidation: action.payload,
        isLoading: false
      };

    case CnValidationActionTypes.SAVE_CN_VALIDATION_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        cnValidation: action.payload,
        isLoading: false
      };
    case CnValidationActionTypes.UPDATE_CN_VALIDATION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case CnValidationActionTypes.UPDATE_CN_VALIDATION_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        cnValidation: action.payload
      };
    case CnValidationActionTypes.UPDATE_CN_VALIDATION_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case CnValidationActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        hasSaved: null,
        cnValidation: null,
        error: null,
        cnTypeList: null
      };
    default:
      return {
        ...state
      };
  }
}
