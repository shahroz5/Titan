import { CustomErrors, User } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AuthActionTypes,
  ChangeLoginStatus,
  ClearSsoLogoutUrl,
  GetSsoLogoutUrl,
  GetSsoLogoutUrlFailure,
  GetSsoLogoutUrlSuccess,
  HideRefreshNotification,
  Login,
  LoginFailure,
  LoginPayload,
  LoginSuccess,
  Logout,
  LogoutFailure,
  LogoutSuccess,
  Refresh,
  RefreshCheck,
  RefreshCheckPayload,
  RefreshFailure,
  RefreshSuccess,
  Reload,
  ReloadFailure,
  ReloadSuccess,
  ShowRefreshNotification
} from './auth.actions';

describe('Auth Action Testing Suite', () => {
  describe('Login Action Test Cases', () => {
    it('should check correct type is used for Login action ', () => {
      const payload: LoginPayload = {
        userName: 'admin',
        authorizationCode: 'Welcome@123'
      };

      const action = new Login(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGIN,
        payload
      });
    });

    it('should check correct type is used for LoginSuccess action ', () => {
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
      const action = new LoginSuccess(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoginFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoginFailure(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload
      });
    });
  });

  describe('Logout Action Test Cases', () => {
    it('should check correct type is used for Logout action ', () => {
      const action = new Logout();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGOUT
      });
    });

    it('should check correct type is used for LogoutSuccess action ', () => {
      const action = new LogoutSuccess();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGOUT_SUCCESS
      });
    });
    it('should check correct type is used for LogoutFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LogoutFailure(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.LOGOUT_FAILURE,
        payload
      });
    });
  });

  describe('Reload Action Test Cases', () => {
    it('should check correct type is used for Reload action ', () => {
      const payload = '';

      const action = new Reload(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.RELOAD,
        payload
      });
    });

    it('should check correct type is used for ReloadSuccess action ', () => {
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
      const action = new ReloadSuccess(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.RELOAD_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ReloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ReloadFailure(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.RELOAD_FAILURE,
        payload
      });
    });
  });

  describe('Refresh Action Test Cases', () => {
    it('should check correct type is used for Refresh action ', () => {
      const payload = '';

      const action = new Refresh(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.REFRESH,
        payload
      });
    });

    it('should check correct type is used for RefreshSuccess action ', () => {
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
      const action = new RefreshSuccess(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.REFRESH_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RefreshFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RefreshFailure(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.REFRESH_FAILURE,
        payload
      });
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for RefreshCheck action ', () => {
      const payload: RefreshCheckPayload = {
        exptime: new Date(),
        refreshToken: 'abcdefghijklmnopqrstuvwxyz'
      };

      const action = new RefreshCheck(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.REFRESH_CHECK,
        payload
      });
    });

    it('should check correct type is used for ChangeLoginStatus action ', () => {
      const payload = true;
      const action = new ChangeLoginStatus(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.CHANGE_LOGIN_STATUS,
        payload
      });
    });
  });

  describe('ShowRefreshNotification Action Test Cases', () => {
    it('should check correct type is used for ShowRefreshNotification  action ', () => {
      const action = new ShowRefreshNotification();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.SHOW_REFRESH_NOTIFICATION
      });
    });

    it('should check correct type is used for HideRefreshNotification action ', () => {
      const action = new HideRefreshNotification();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.HIDE_REFRESH_NOTIFICATION
      });
    });
  });

  describe('SsoLogoutUrl Action Test Cases', () => {
    it('should check correct type is used for GetSsoLogoutUrl action ', () => {
      const action = new GetSsoLogoutUrl();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.GET_SSO_LOGOUT_URL
      });
    });

    it('should check correct type is used for GetSsoLogoutUrlSuccess action ', () => {
      const payload = 'ssoLogoutUrl';
      const action = new GetSsoLogoutUrlSuccess(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.GET_SSO_LOGOUT_URL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetSsoLogoutUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetSsoLogoutUrlFailure(payload);
      expect({ ...action }).toEqual({
        type: AuthActionTypes.GET_SSO_LOGOUT_URL_FAILURE,
        payload
      });
    });

    it('should check correct type is used for ClearSsoLogoutUrl action ', () => {
      const action = new ClearSsoLogoutUrl();
      expect({ ...action }).toEqual({
        type: AuthActionTypes.CLEAR_SSO_LOGOUT_URL
      });
    });
  });
});
