import { createFeatureSelector } from '@ngrx/store';
import { CnDirectState } from './cn-direct.state';
import { CnDirectActions, CNDirectActionTypes } from './cn-direct.action';

export const initialState: CnDirectState = {
  cnList: [],
  error: null,
  isLoading: null,
  hasUpdated: null,
  totalElements: null
};

export const CN_DIRECT_FEATURE_KEY = 'cnDirect';
export const selectCnDirectState = createFeatureSelector<CnDirectState>(
  CN_DIRECT_FEATURE_KEY
);

export function cnDirectReducer(
  state = initialState,
  action: CnDirectActions
): CnDirectState {
  switch (action.type) {
    case CNDirectActionTypes.SEARCH_CN_DIRECT_LIST:
      return {
        ...state,
        isLoading: true
      };
    case CNDirectActionTypes.SAVE_CN_DIRECT_ACTION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    }
    case CNDirectActionTypes.UPLOAD_CN_SUCCESS:
    case CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnList: action.payload.cnList,
        totalElements: action.payload.totalElements
      };
    case CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_FAILURE:
    case CNDirectActionTypes.UPLOAD_CN_FAILURE:
    case CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CNDirectActionTypes.UPLOAD_CN:
      return {
        ...state,
        isLoading: true,
        cnList: []
      };

    case CNDirectActionTypes.LOAD_RESET:
      return {
        ...state,
        cnList: [],
        error: null,
        isLoading: null,
        hasUpdated: null
      };

    default:
      return state;
  }
}
