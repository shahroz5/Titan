import { AccessControlManagementState } from './access-control-mgmt.state';
import {
  AccessControlManagementActions,
  AccessControlManagementActionTypes
} from './access-control-mgmt.actions';

export const initialState: AccessControlManagementState = {
  error: null,
  modules: [],
  roles: [],
  isLoading: false,
  subModules: [],
  features: [],
  acl: [],
  isACLUpdateSuccess: false
};

export function AccessControlManagementReducer(
  state: AccessControlManagementState = initialState,
  action: AccessControlManagementActions
): AccessControlManagementState {
  switch (action.type) {
    case AccessControlManagementActionTypes.LOAD_ROLES:
      return {
        ...state,
        roles: [],
        isLoading: true
      };

    case AccessControlManagementActionTypes.LOAD_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.payload,
        isLoading: false
      };

    case AccessControlManagementActionTypes.LOAD_MODULES:
      return {
        ...state,
        isLoading: true,
        modules: []
      };

    case AccessControlManagementActionTypes.LOAD_MODULES_SUCCESS:
      return {
        ...state,
        modules: action.payload,
        isLoading: false
      };

    case AccessControlManagementActionTypes.LOAD_SUB_MODULES:
      return {
        ...state,
        subModules: [],
        isLoading: true
      };

    case AccessControlManagementActionTypes.LOAD_SUB_MODULES_SUCCESS:
      return {
        ...state,
        subModules: action.payload,
        isLoading: false
      };

    case AccessControlManagementActionTypes.LOAD_FEATURES:
      return {
        ...state,
        isLoading: true,
        features: []
      };

    case AccessControlManagementActionTypes.LOAD_FEATURES_SUCCESS:
      return {
        ...state,
        features: action.payload,
        isLoading: false
      };

    case AccessControlManagementActionTypes.LOAD_ACL:
      return {
        ...state,
        isLoading: true
      };

    case AccessControlManagementActionTypes.LOAD_ACL_SUCCESS:
      return {
        ...state,
        acl: action.payload,
        isLoading: false
      };

    case AccessControlManagementActionTypes.UPDATE_ACL:
      return {
        ...state,
        isLoading: true,
        isACLUpdateSuccess: false
      };

    case AccessControlManagementActionTypes.UPDATE_ACL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isACLUpdateSuccess: true
      };

    case AccessControlManagementActionTypes.CLEAR_ACL:
      return {
        ...state,
        acl: [],
        error: null,
        isACLUpdateSuccess: false
      };

    case AccessControlManagementActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case AccessControlManagementActionTypes.LOAD_ROLES_FAILURE:
    case AccessControlManagementActionTypes.LOAD_MODULES_FAILURE:
    case AccessControlManagementActionTypes.LOAD_SUB_MODULES_FAILURE:
    case AccessControlManagementActionTypes.LOAD_FEATURES_FAILURE:
    case AccessControlManagementActionTypes.LOAD_ACL_FAILURE:
    case AccessControlManagementActionTypes.UPDATE_ACL_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}
