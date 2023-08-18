import { AuthState, User } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './auth.actions';
import { LoginPayload } from './auth.actions';
import { authReducer, initialAuthState } from './auth.reducer';

describe('Auth reducer Testing Suite', () => {
  describe('Testing login Functionality', () => {
    it('Should call LOGIN action', () => {
      const payload: LoginPayload = {
        userName: 'admin',
        authorizationCode: 'Welcome@123'
      };

      const action = new actions.Login(payload);

      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.isLoggedIn).toBe(false);
      expect(result.isLoggedOut).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LOGIN_SUCCESS should return auth token and acl', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const payload: User = {
        username: 'admin',
        password: 'Welcome@123',
        firstName: 'System',
        lastName: 'Admin',
        locationCode: 'TJ',
        storeType: 'ORG',
        exptime: null,
        accessToken: '',
        refreshToken: 'abcdefghijklmnopqrstuvwxyz',
        refreshTokenExp: null,
        acl: mapData,
        isSso: false
      };
      const action = new actions.LoginSuccess(payload);
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoggedOut).toBe(false);
      expect(result.error).toBe(null);
      expect(result.accessToken).toEqual(action.payload.accessToken);
      expect(result.userName).toEqual(action.payload.username);
      expect(result.firstName).toEqual(action.payload.firstName);
      expect(result.lastName).toEqual(action.payload.lastName);
      expect(result.storeType).toEqual(action.payload.storeType);
      expect(result.locationCode).toEqual(action.payload.locationCode);
      expect(result.exptime).toEqual(action.payload.exptime);
      expect(result.refreshToken).toEqual(action.payload.refreshToken);
      expect(result.refreshTokenExp).toEqual(action.payload.refreshTokenExp);
      expect(result.acl).toEqual(action.payload.acl);
    });
    it('LOGIN_FAILURE should return error', () => {
      const action = new actions.LoginFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.isLoggedIn).toBe(false);
      expect(result.isLoggedOut).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual(action.payload);
    });
  });

  describe('Testing Logout Functionality', () => {
    it('Should call LOGOUT action', () => {
      const action = new actions.Logout();
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LOGOUT_SUCCESS should logout user & clear Login state', () => {
      const action = new actions.LogoutSuccess();
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isLoggedIn).toBe(false);
      expect(result.isLoggedOut).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.accessToken).toEqual('');
      expect(result.error).toBe(null);
    });
    it('LOGOUT_FAILURE should return error', () => {
      const action = new actions.LogoutFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.isLoggedIn).toBe(true);
      expect(result.isLoggedOut).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual(action.payload);
    });
  });

  describe('Testing Reload Functionality', () => {
    it('Should call RELOAD action', () => {
      const payload = '';
      const action = new actions.Reload(payload);
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isReloaded).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('RELOAD_SUCCESS should get the token from the response', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const payload: User = {
        username: 'admin',
        password: 'Welcome@123',
        firstName: 'System',
        lastName: 'Admin',
        locationCode: 'TJ',
        storeType: 'ORG',
        exptime: null,
        accessToken: '',
        refreshToken: 'abcdefghijklmnopqrstuvwxyz',
        refreshTokenExp: null,
        acl: mapData,
        isSso: false
      };
      const action = new actions.ReloadSuccess(payload);
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isReloaded).toBe(true);
      expect(result.isLoggedIn).toBe(true);
      expect(result.isLoggedOut).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.accessToken).toEqual(action.payload.accessToken);
      expect(result.userName).toEqual(action.payload.username);
      expect(result.firstName).toEqual(action.payload.firstName);
      expect(result.lastName).toEqual(action.payload.lastName);
      expect(result.storeType).toEqual(action.payload.storeType);
      expect(result.locationCode).toEqual(action.payload.locationCode);
      expect(result.exptime).toEqual(action.payload.exptime);
      expect(result.refreshToken).toEqual(action.payload.refreshToken);
      expect(result.refreshTokenExp).toEqual(action.payload.refreshTokenExp);
      expect(result.acl).toEqual(action.payload.acl);
    });

    it('RELOAD_FAILURE should return error', () => {
      const action = new actions.ReloadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isLoggedIn).toBe(false);
      expect(result.isLoggedOut).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.isReloaded).toBe(true);
      expect(result.accessToken).toBe('');
    });
  });

  describe('Testing Refresh Functionality', () => {
    it('REFRESH_SUCCESS should update/refresh the access token in the cookies and in the store', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const payload: User = {
        username: 'admin',
        password: 'Welcome@123',
        firstName: 'System',
        lastName: 'Admin',
        locationCode: 'TJ',
        storeType: 'ORG',
        exptime: null,
        accessToken: '',
        refreshToken: 'abcdefghijklmnopqrstuvwxyz',
        refreshTokenExp: null,
        acl: mapData,
        isSso: false
      };
      const action = new actions.RefreshSuccess(payload);
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.error).toBe(null);
      expect(result.isLoggedIn).toBe(true);
      expect(result.isLoggedOut).toBe(false);
      expect(result.accessToken).toEqual(action.payload.accessToken);
      expect(result.userName).toEqual(action.payload.username);
      expect(result.firstName).toEqual(action.payload.firstName);
      expect(result.lastName).toEqual(action.payload.lastName);
      expect(result.storeType).toEqual(action.payload.storeType);
      expect(result.locationCode).toEqual(action.payload.locationCode);
      expect(result.exptime).toEqual(action.payload.exptime);
      expect(result.refreshToken).toEqual(action.payload.refreshToken);
      expect(result.refreshTokenExp).toEqual(action.payload.refreshTokenExp);
      expect(result.acl).toEqual(action.payload.acl);
    });

    it('REFRESH_FAILURE should return error', () => {
      const action = new actions.RefreshFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isLoggedIn).toBe(false);
      expect(result.isLoggedOut).toBe(true);
      expect(result.accessToken).toBe('');
      expect(result.error).toBe(action.payload);
    });
  });

  describe('Testing Show/Hide RefreshNotification Functionality', () => {
    it('SHOW_REFRESH_NOTIFICATION should show refresh notification alert message', () => {
      const action = new actions.ShowRefreshNotification();
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.showRefreshAlertMessage).toBe(true);
    });

    it('HIDE_REFRESH_NOTIFICATION should Hide refresh notification alert message', () => {
      const action = new actions.HideRefreshNotification();
      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.showRefreshAlertMessage).toBe(false);
    });
  });

  describe('Testing ChangeLoginStatus Functionality', () => {
    it('Should call CHANGE_LOGIN_STATUS action', () => {
      const payload = true;
      const action = new actions.ChangeLoginStatus(payload);
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.isLoggedIn).toBe(action.payload);
    });
  });

  describe('Testing GetSsoLogoutUrl Functionality', () => {
    it('Should call GET_SSO_LOGOUT_URL action', () => {
      const action = new actions.GetSsoLogoutUrl();
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.ssoLogoutUrl).toBe('');
    });

    it('GET_SSO_LOGOUT_URL_SUCCESS should get sso logout url from the response', () => {
      const payload = 'ssoLogoutUrl';
      const action = new actions.GetSsoLogoutUrlSuccess(payload);
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.ssoLogoutUrl).toEqual(action.payload);
    });

    it('GET_SSO_LOGOUT_URL_FAILURE should return error', () => {
      const action = new actions.GetSsoLogoutUrlFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.ssoLogoutUrl).toBe('');
    });

    it('CLEAR_SSO_LOGOUT_URL should clear sso logout url from the store', () => {
      const action = new actions.ClearSsoLogoutUrl();
      const result: AuthState = authReducer(initialAuthState, action);
      expect(result.ssoLogoutUrl).toBe('');
    });
  });
});
