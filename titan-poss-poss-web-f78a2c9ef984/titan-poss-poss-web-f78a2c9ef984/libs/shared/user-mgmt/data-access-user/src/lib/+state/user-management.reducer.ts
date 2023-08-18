import { createFeatureSelector } from '@ngrx/store';
import {
  UserManagementActions,
  UserManagementActionTypes
} from './user-management.actions';
import { countryAdapter } from './user-management.entity';
import { UserManagementState } from './user-management.state';

export const userManagement_Feature_Key = 'userManagement';

export const selectUserManagementState = createFeatureSelector<
  UserManagementState
>(userManagement_Feature_Key);

export const initialState: UserManagementState = {
  users: [],
  totalUsers: 0,
  selectedUser: null,
  states: [],
  countries: countryAdapter.getInitialState(),
  location: null,
  emailLocation: null,
  roles: null,
  regions: null,
  roleTypes: [],
  updateUser: false,
  checkMobileEmail: true,
  error: null,
  isLoading: false,
  userProfile: null,
  changePassword: false,
  verifyMobileOTP: false,
  OTPsent: false,
  mappedLocations: [],
  isLocationsMapped: false
};

export function UserManagementReducer(
  state: UserManagementState = initialState,
  action: UserManagementActions
): UserManagementState {
  switch (action.type) {
    case UserManagementActionTypes.LOAD_USERS:
    case UserManagementActionTypes.UPDATE_USER:
    case UserManagementActionTypes.ADD_USER:
      return {
        ...state,
        isLoading: true,
        updateUser: false,
        error: null
      };

    case UserManagementActionTypes.LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
        totalUsers: action.payload.totalUsers,
        isLoading: false
      };

    case UserManagementActionTypes.LOAD_USERS_FAILURE:
      return {
        ...state,
        users: [],
        isLoading: false,
        error: action.payload
      };

    case UserManagementActionTypes.FETCH_USER:
      return {
        ...state,
        isLoading: true,
        selectedUser: null,
        error: null
      };

    case UserManagementActionTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        selectedUser: action.payload,
        isLoading: false
      };

    case UserManagementActionTypes.FETCH_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        selectedUser: null,
        error: action.payload
      };

    case UserManagementActionTypes.LOAD_COUNTRY_SUCCESS:
      return {
        ...state,
        countries: countryAdapter.setAll(action.payload, state.countries),
        error: null
      };

    case UserManagementActionTypes.LOAD_COUNTRY_FAILURE:
      return {
        ...state,
        countries: countryAdapter.setAll([], state.countries)
      };

    case UserManagementActionTypes.LOAD_STATE_SUCCESS:
      return {
        ...state,
        states: action.payload,

        error: null
      };

    case UserManagementActionTypes.LOAD_STATE_FAILURE:
      return {
        ...state,
        states: []
      };

    case UserManagementActionTypes.FETCH_LOCATION_SUCCESS:
      return {
        ...state,
        location: action.payload,
        error: null
      };

    case UserManagementActionTypes.FETCH_LOCATION_FAILURE:
      return {
        ...state,
        location: { countryCode: '', locationCode: '', ownerTypeCode: '' }
      };

    case UserManagementActionTypes.FETCH_EMAIL_LOCATION_SUCCESS:
      return {
        ...state,
        emailLocation: action.payload.locationCode,
        error: null
      };

    case UserManagementActionTypes.FETCH_EMAIL_LOCATION_FAILURE:
      return {
        ...state,
        emailLocation: ''
      };

    case UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_SUCCESS:
      return {
        ...state,
        checkMobileEmail: action.payload,
        error: null
      };

    case UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_FAILURE:
      return {
        ...state,
        checkMobileEmail: false
      };

    case UserManagementActionTypes.LOAD_FILTER_ROLES:
      return {
        ...state,
        roles: null,
        error: null
      };

    case UserManagementActionTypes.LOAD_ROLES_SUCCESS:
    case UserManagementActionTypes.LOAD_FILTER_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.payload,
        error: null
      };

    case UserManagementActionTypes.LOAD_ROLES_FAILURE:
      return {
        ...state,
        roles: null
      };
    case UserManagementActionTypes.LOAD_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload,
        error: null
      };

    case UserManagementActionTypes.LOAD_REGIONS_FAILURE:
      return {
        ...state,
        regions: null,
        error: action.payload

      };

    case UserManagementActionTypes.CLEAR_SEARCHED_USERS:
      return {
        ...state,
        users: [],
        totalUsers: 0,
        isLoading: false
      };

    case UserManagementActionTypes.LOAD_ROLE_TYPES:
      return {
        ...state,
        roleTypes: [],
        error: null
      };

    case UserManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS:
      return {
        ...state,
        roleTypes: action.payload
      };

    case UserManagementActionTypes.LOAD_ROLE_TYPES_FAILURE:
      return {
        ...state,
        roleTypes: []
      };

    case UserManagementActionTypes.UPDATE_USER_SUCCESS:
    case UserManagementActionTypes.ADD_USER_SUCCESS:
      return {
        ...state,
        updateUser: true,
        isLoading: false
      };

    case UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_FAILURE:
    case UserManagementActionTypes.UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case UserManagementActionTypes.ADD_USER_FAILURE:
      return {
        ...state,
        updateUser: false,
        isLoading: false,
        error: action.payload
      };

    case UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP:
      return {
        ...state,
        OTPsent: false,
        error: null,
        isLoading: true
      };

    case UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        OTPsent: true
      };
  }

  switch (action.type) {
    case UserManagementActionTypes.LOAD_USER_PROFILE:
      return {
        ...state,
        isLoading: true,
        userProfile: null,
        verifyMobileOTP: false,
        error: null
      };

    case UserManagementActionTypes.LOAD_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
        isLoading: false
      };

    case UserManagementActionTypes.LOAD_USER_PROFILE_FAILURE:
      return {
        ...state,
        userProfile: null,
        isLoading: false,
        error: action.payload
      };

    case UserManagementActionTypes.CHANGE_PASSWORD_FAILURE:
    case UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case UserManagementActionTypes.CHANGE_PASSWORD:
      return {
        ...state,
        changePassword: false,
        error: null,
        isLoading: true
      };

    case UserManagementActionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        changePassword: true
      };

    case UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE:
      return {
        ...state,
        verifyMobileOTP: false,
        error: null,
        isLoading: true
      };

    case UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verifyMobileOTP: true,
        userProfile: { ...state.userProfile, validateMobile: false }
      };

    case UserManagementActionTypes.LOAD_MAPPED_LOCATIONS:
      return {
        ...state,
        isLoading: true,
        error: null,
        mappedLocations: []
      };
    case UserManagementActionTypes.LOAD_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        mappedLocations: action.payload
      };
    case UserManagementActionTypes.LOAD_MAPPED_LOCATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        mappedLocations: [],
        error: action.payload
      };
    case UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS:
      return {
        ...state,
        isLoading: true,
        isLocationsMapped: false,
        error: null,
      };
    case UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLocationsMapped: true,
        error: null,
      };
    case UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS_FAILURE:
        return {
          ...state,
          isLoading: false,
          isLocationsMapped: false,
          error: action.payload
        };
  }
  return state;
}
