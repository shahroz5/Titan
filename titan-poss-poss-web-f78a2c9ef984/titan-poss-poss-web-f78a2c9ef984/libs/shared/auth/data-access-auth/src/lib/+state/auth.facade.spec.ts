import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthState } from '@poss-web/shared/models';
import {
  HideRefreshNotification,
  Login,
  LoginPayload,
  Logout,
  Refresh,
  Reload,
  ShowRefreshNotification
} from './auth.actions';
import { AuthFacade } from './auth.facade';

describe('Auth facade testing suite', () => {
  const initialState: AuthState = {
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
    isSsoLogin: false,
    ssoLogoutUrl: null
  };
  let authFacade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AuthFacade]
    });

    authFacade = TestBed.inject(AuthFacade);
  });

  describe('login', () => {
    it('should dispatch Login action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: LoginPayload = {
        userName: 'admin',
        authorizationCode: 'Welcome@123'
      };

      const expectedAction = new Login(payload);
      authFacade.login(payload);
      authFacade.isUserLoggedIn();
      authFacade.isLoading();
      authFacade.getUserName();
      authFacade.getACL();
      authFacade.getRefreshNotificationStatus();
      authFacade.getLoginError();
      authFacade.getAuthData();
      authFacade.getAccessToken();
      authFacade.getStoreType();
      authFacade.getSsoLogoutUrl();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('logout', () => {
    it('should dispatch Logout action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new Logout();
      authFacade.logOut();
      authFacade.isUserLoggedOut();
      authFacade.clearSsoLogoutUrl();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('reload', () => {
    it('should dispatch Reload action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = '/inventory/home';

      const expectedAction = new Reload(payload);
      authFacade.reload(payload);
      authFacade.getReloadState();
      authFacade.getExpTime();
      authFacade.getRefreshToken();
      authFacade.getRefreshTokenExp();
      authFacade.getLocationCode();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('refresh', () => {
    it('should dispatch Refresh action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'abcdefghijklmnopqrstuvwxyz';

      const expectedAction = new Refresh(payload);
      authFacade.refresh(payload);
      // authFacade.isUserLoggedIn();
      // authFacade.isLoading();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('showRefreshNotification', () => {
    it('should dispatch showRefreshNotification action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const expectedAction = new ShowRefreshNotification();
        authFacade.showRefreshNotification();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('hideRefreshNotificationStatus', () => {
    it('should dispatch hideRefreshNotificationStatus action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const expectedAction = new HideRefreshNotification();
        authFacade.hideRefreshNotificationStatus();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
