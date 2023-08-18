import {
  RoleConfigActions,
  RoleConfigActionTypes
} from './role-config.actions';
import { RoleConfigState } from './role-config.state';

import { createFeatureSelector } from '@ngrx/store';

export const ROLECONFIG_FEATURE_KEY = 'roleConfig';

export const selectRoleConfigState = createFeatureSelector<RoleConfigState>(
  ROLECONFIG_FEATURE_KEY
);

export const initialState: RoleConfigState = {
  roles: [],
  error: null,
  isLoading: false,
  roleCountChanged: false,
  roleCountRequestList: [],
  roleCountRequestListlength: 0,
  requestedRoles: [],
  requestdata: null,
  locations: [],
  locationformats: [],
  isSearch: '',
  isFilter: ''
};

export function RoleConfigReducer(
  state: RoleConfigState = initialState,
  action: RoleConfigActions
): RoleConfigState {
  switch (action.type) {
    case RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_SUCCESS:
      return {
        ...state,
        roles: action.payload,
        isLoading: false
      };

    case RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        roles: [],
        error: action.payload
      };

    case RoleConfigActionTypes.CHANGE_ROLE_COUNT:
      return {
        ...state,
        isLoading: true,
        roleCountChanged: false,
        error: null
      };

    case RoleConfigActionTypes.CHANGE_ROLE_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        roleCountChanged: true
      };

    case RoleConfigActionTypes.CHANGE_ROLE_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        roleCountChanged: false,
        error: action.payload
      };

    case RoleConfigActionTypes.RESET_ROLE_COUNT_REQUEST_LIST:
      return {
        ...state,
        roleCountRequestList: [],
        roles: [],
        error: null,
        isSearch: ''
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST:
      return {
        ...state,
        isLoading: true,
        roleCountRequestListlength: 0,
        error: null
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        roleCountRequestList:
          action.payload.isSearch === state.isSearch &&
          action.payload.isFilter === state.isFilter
            ? state.roleCountRequestList.concat(action.payload.requests)
            : action.payload.requests,
        roleCountRequestListlength: action.payload.totalrequests,
        isSearch: action.payload.isSearch,
        isFilter: action.payload.isFilter
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        roleCountRequestList: [],
        roleCountRequestListlength: 0,
        error: action.payload
      };

    case RoleConfigActionTypes.CLEAR_ROLE_COUNT_REQUEST:
      return {
        ...state,
        isLoading: false,
        roleCountRequestList: [],
        roleCountRequestListlength: 0
      };

    case RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT:
      return {
        ...state,
        roleCountRequestListlength: 0,
        error: null
      };

    case RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_SUCCESS:
      return {
        ...state,
        roleCountRequestListlength: action.payload
      };

    case RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_FAILURE:
      return {
        ...state,
        roleCountRequestListlength: 0,
        error: action.payload
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST:
      return {
        ...state,
        isLoading: true,
        requestedRoles: [],
        requestdata: null,
        error: null
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestedRoles: action.payload.requestedRoles,
        requestdata: action.payload.requestdata
      };

    case RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        requestedRoles: [],
        requestdata: null,
        error: action.payload
      };

    case RoleConfigActionTypes.LOAD_LOCATION:
      return {
        ...state,
        locations: [],
        roles: [],
        error: null
      };

    case RoleConfigActionTypes.LOAD_LOCATION_SUCCESS:
      return {
        ...state,
        locations: action.payload
      };

    case RoleConfigActionTypes.LOAD_LOCATION_FAILURE:
      return {
        ...state,
        locations: [],
        error: action.payload
      };

    case RoleConfigActionTypes.LOAD_LOCATION_FORMAT:
      return {
        ...state,
        locationformats: [],
        isLoading: true,
        error: null
      };

    case RoleConfigActionTypes.LOAD_LOCATION_FORMAT_SUCCESS:
      return {
        ...state,
        locationformats: action.payload,
        isLoading: false
      };

    case RoleConfigActionTypes.LOAD_LOCATION_FORMAT_FAILURE:
      return {
        ...state,
        locationformats: [],
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}
