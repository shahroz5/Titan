import {
  RoleManagementActions,
  RoleManagementActionTypes
} from '../+state/role-management.actions';
import { RoleManagementState } from '../+state/role-management.state';

import { createFeatureSelector } from '@ngrx/store';

export const ROLEMANAGEMENT_FEATURE_KEY = 'roleManagement';

export const selectRoleManagementState = createFeatureSelector<
  RoleManagementState
>(ROLEMANAGEMENT_FEATURE_KEY);

export const initialState: RoleManagementState = {
  roles: [],
  roleTypes: [],
  updatedRole: null,
  fetchRole: null,
  totalRoles: 0,
  error: null,
  isLoading: false,
  locationformats: new Map<string, string>()
};

export function RoleManagementReducer(
  state: RoleManagementState = initialState,
  action: RoleManagementActions
): RoleManagementState {
  switch (action.type) {
    case RoleManagementActionTypes.LOAD_ROLES:
    case RoleManagementActionTypes.FETCH_ROLE:
    case RoleManagementActionTypes.UPDATE_ROLE:
    case RoleManagementActionTypes.ADD_ROLE:
      return {
        ...state,
        isLoading: true,
        updatedRole: '',
        error: null
      };

    case RoleManagementActionTypes.LOAD_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.payload.roles,
        totalRoles: action.payload.totalRoles,
        isLoading: false
      };

    case RoleManagementActionTypes.LOAD_ROLES_FAILURE:
      return {
        ...state,
        isLoading: false,
        roles: [],
        totalRoles: 0,
        error: action.payload
      };

    case RoleManagementActionTypes.CLEAR_SEARCHED_ROLES:
      return {
        ...state,
        isLoading: false,
        roles: [],
        totalRoles: 0
      };

    case RoleManagementActionTypes.FETCH_ROLE_SUCCESS:
      return {
        ...state,
        fetchRole: action.payload,
        isLoading: false
      };

    case RoleManagementActionTypes.FETCH_ROLE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case RoleManagementActionTypes.UPDATE_ROLE_SUCCESS:
    case RoleManagementActionTypes.ADD_ROLE_SUCCESS:
      return {
        ...state,
        updatedRole: action.payload,
        isLoading: false
      };

    case RoleManagementActionTypes.UPDATE_ROLE_FAILURE:
    case RoleManagementActionTypes.ADD_ROLE_FAILURE:
      return {
        ...state,
        updatedRole: '',
        isLoading: false,
        error: action.payload
      };

    case RoleManagementActionTypes.LOAD_LOCATION_FORMAT:
      return {
        ...state,
        locationformats: new Map<string, string>(),
        isLoading: true,
        error: null
      };

    case RoleManagementActionTypes.LOAD_LOCATION_FORMAT_SUCCESS:
      return {
        ...state,
        locationformats: action.payload,
        isLoading: false
      };

    case RoleManagementActionTypes.LOAD_LOCATION_FORMAT_FAILURE:
      return {
        ...state,
        locationformats: new Map<string, string>(),
        isLoading: false,
        error: action.payload
      };

    case RoleManagementActionTypes.LOAD_ROLE_TYPES:
      return {
        ...state,
        roleTypes: [],
        isLoading: true,
        error: null
      };

    case RoleManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS:
      return {
        ...state,
        roleTypes: action.payload,
        isLoading: false
      };

    case RoleManagementActionTypes.LOAD_ROLE_TYPES_FAILURE:
      return {
        ...state,
        roleTypes: [],
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}
