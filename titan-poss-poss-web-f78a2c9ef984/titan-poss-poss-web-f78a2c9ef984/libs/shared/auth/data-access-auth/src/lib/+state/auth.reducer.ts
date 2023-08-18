import { createFeatureSelector } from '@ngrx/store';
import { AuthState } from '@poss-web/shared/models';
import { AuthActions, AuthActionTypes } from './auth.actions';

export const Auth_FEATURE_KEY = 'auth';

export const selectAuthState = createFeatureSelector<AuthState>(
  Auth_FEATURE_KEY
);

export const initialAuthState: AuthState = {
  userName: '',
  firstName: '',
  lastName: '',
  storeType: '',
  locationCode: '',
  accessToken: '',
  error: null,
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: false,
  isReloaded: false,
  exptime: null,
  refreshToken: '',
  refreshTokenExp: null,
  acl: new Map<string, string[]>(),
  showRefreshAlertMessage: null,
  isSsoLogin: null,
  ssoLogoutUrl: ''
};

export function authReducer(
  state: AuthState = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN: {
      // console.log('AuthActionTypes.LOGIN');
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: false,
        isLoading: true,
        error: null
      };
    }

    case AuthActionTypes.LOGIN_SUCCESS: {
      // console.log('AuthActionTypes.LOGIN_SUCCESS');
      return {
        ...state,
        isLoading: false,
        isLoggedOut: false,
        error: null,
        accessToken: action.payload.accessToken,
        userName: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        storeType: action.payload.storeType,
        locationCode: action.payload.locationCode,
        exptime: action.payload.exptime,
        refreshToken: action.payload.refreshToken,
        refreshTokenExp: action.payload.refreshTokenExp,
        acl: action.payload.acl,
        isSsoLogin: action.payload.isSso
      };
    }

    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        isLoading: false,
        error: action.payload
      };
    }

    case AuthActionTypes.CHANGE_LOGIN_STATUS: {
      return {
        ...state,
        isLoggedIn: action.payload
      };
    }

    case AuthActionTypes.LOGOUT: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case AuthActionTypes.LOGOUT_SUCCESS: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        isLoading: false,
        accessToken: '',
        error: null
      };
    }

    case AuthActionTypes.LOGOUT_FAILURE: {
      return {
        ...state,
        isLoggedIn: true,
        isLoggedOut: false,
        isLoading: false,
        error: action.payload
      };
    }

    case AuthActionTypes.RELOAD: {
      return {
        ...state,
        isReloaded: false,
        isLoading: true,
        error: null
      };
    }

    case AuthActionTypes.RELOAD_SUCCESS: {
      return {
        ...state,
        isReloaded: true,
        isLoggedIn: true,
        isLoggedOut: false,
        isLoading: false,
        error: null,
        accessToken: action.payload.accessToken,
        userName: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        storeType: action.payload.storeType,
        locationCode: action.payload.locationCode,
        exptime: action.payload.exptime,
        refreshToken: action.payload.refreshToken,
        refreshTokenExp: action.payload.refreshTokenExp,
        acl: action.payload.acl,
        isSsoLogin: action.payload.isSso
      };
    }

    case AuthActionTypes.RELOAD_FAILURE: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        isLoading: false,
        isReloaded: true, //to check if reload is not getting called twice in login-resolver
        accessToken: ''
        // error: action.payload
        // Note: when user tries to load the application by entering Login Page URL, the reload API failure
        // error was getting displayed, however during a network failure would also get logged out on
        // reloading the browser, hence remove error object for Reload API failure
      };
    }

    case AuthActionTypes.REFRESH_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoggedIn: true,
        isLoggedOut: false,
        accessToken: action.payload.accessToken,
        userName: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        storeType: action.payload.storeType,
        locationCode: action.payload.locationCode,
        exptime: action.payload.exptime,
        refreshToken: action.payload.refreshToken,
        refreshTokenExp: action.payload.refreshTokenExp,
        acl: action.payload.acl,
        isSsoLogin: action.payload.isSso
      };
    }

    case AuthActionTypes.REFRESH_FAILURE: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        accessToken: '',
        error: action.payload
      };
    }
    case AuthActionTypes.SHOW_REFRESH_NOTIFICATION: {
      return {
        ...state,
        showRefreshAlertMessage: true
      };
    }

    case AuthActionTypes.HIDE_REFRESH_NOTIFICATION: {
      return {
        ...state,
        showRefreshAlertMessage: false
      };
    }

    case AuthActionTypes.GET_SSO_LOGOUT_URL: {
      return {
        ...state,
        ssoLogoutUrl: ''
      };
    }
    case AuthActionTypes.GET_SSO_LOGOUT_URL_SUCCESS: {
      return {
        ...state,
        ssoLogoutUrl: action.payload
      };
    }
    case AuthActionTypes.CLEAR_SSO_LOGOUT_URL: {
      return {
        ...state,
        ssoLogoutUrl: ''
      };
    }

    default: {
      return state;
    }
  }
}
