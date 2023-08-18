import { createFeatureSelector } from '@ngrx/store';
import { PermissionActions, PermissionActionTypes } from './permission.actions';
import { PermissionState, PERMISSION_FEATURE_KEY } from './permission.state';

export const selectPermissionState = createFeatureSelector<PermissionState>(
  PERMISSION_FEATURE_KEY
);

export const initialState: PermissionState = {
  urls: null,
  elements: [],
  allowedRoutes: null,
  error: null,
  isLoading: null
};

export function PermissionReducer(
  state: PermissionState = initialState,
  action: PermissionActions
): PermissionState {
  switch (action.type) {
    case PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL:
      return {
        ...state,
        elements: [],
        error: null,
        isLoading: true
      };

    case PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_SUCCESS:
      return {
        ...state,
        elements: action.payload,
        isLoading: false
      };

    case PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_FAILURE:
      return {
        ...state,
        elements: [],
        error: action.payload,
        isLoading: false
      };

    case PermissionActionTypes.LOAD_URL_PERMISSIONS:
      return {
        ...state,
        urls: null,
        error: null,
        isLoading: true
      };

    case PermissionActionTypes.LOAD_URL_PERMISSIONS_SUCCESS:
      return {
        ...state,
        urls: action.payload,
        isLoading: false
      };

    case PermissionActionTypes.LOAD_URL_PERMISSIONS_FAILURE:
      return {
        ...state,
        urls: [],
        error: action.payload,
        isLoading: false
      };

    case PermissionActionTypes.LOAD_URL_SUGGESTION:
      return {
        ...state,
        allowedRoutes: null,
        error: null
      };

    case PermissionActionTypes.LOAD_URL_SUGGESTION_SUCCESS:
      return {
        ...state,
        allowedRoutes: action.payload
      };

    case PermissionActionTypes.LOAD_URL_SUGGESTION_FAILURE:
      return {
        ...state,
        allowedRoutes: null,
        error: action.payload
      };

    default:
      return state;
  }
}
