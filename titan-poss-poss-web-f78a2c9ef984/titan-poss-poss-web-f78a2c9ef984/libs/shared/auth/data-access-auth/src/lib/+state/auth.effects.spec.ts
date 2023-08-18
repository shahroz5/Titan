import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { User } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP,
  POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING,
  POSS_WEB_REFRESH_CHECK_SETTING
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth.service';
import {
  Login,
  LoginFailure,
  LoginPayload,
  LoginSuccess,
  Logout,
  LogoutFailure,
  LogoutSuccess,
  Refresh,
  RefreshFailure,
  RefreshSuccess,
  Reload,
  ReloadFailure,
  ReloadSuccess
} from './auth.actions';
import { AuthEffect } from './auth.effects';

describe('Auth Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AuthEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const authServiceSpy = jasmine.createSpyObj<AuthenticationService>(
    'AuthenticationService',
    [
      'login',
      'setCircuitBreakerCount',
      'logout',
      'reload',
      'refresh',
      'getCircuitBreakerCount',
      'getUrlPathWithQueryParams',
      'getSsoLogoutUrl'
    ]
  );

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: AuthenticationService,
          useValue: authServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: POSS_WEB_REFRESH_CHECK_SETTING,
          useValue: 2
        },
        {
          provide: POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING,
          useValue: 7
        },
        {
          provide: POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP,
          useValue: 3
        }
      ]
    });
    effect = TestBed.inject(AuthEffect);
  });

  describe('Login', () => {
    const payload: LoginPayload = {
      userName: 'admin',
      authorizationCode: 'Welcome@123'
    };
    it('should Login User and load the token and acl details', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const loginSuccessPayload: User = {
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

      const action = new Login(payload);
      const outcome1 = new LoginSuccess(loginSuccessPayload);
      // const outcome2 = new RefreshCheck({
      //   exptime: loginSuccessPayload.exptime,
      //   refreshToken: loginSuccessPayload.refreshToken
      // });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: loginSuccessPayload });
      authServiceSpy.login.and.returnValue(response$);
      authServiceSpy.setCircuitBreakerCount();
      // const expected$ = cold('--(ab)', {
      //   a: outcome1,
      //   b: outcome2
      // });
      const expected$ = cold('--a', {
        a: outcome1
      });

      expect(effect.login).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new Login(payload);
      const error = new Error('some error');
      const outCome = new LoginFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      authServiceSpy.login.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.login).toBeObservable(expected$);
    });
  });

  describe('Logout', () => {
    it('should Logout User and clear the token and acl details', () => {
      const action = new Logout();
      const outCome = new LogoutSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {});
      authServiceSpy.logout.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.logout$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new Logout();
      const error = new Error('some error');
      const outCome = new LogoutFailure(CustomErrorAdaptor.fromJson(error));

      spyOn(effect, 'reloadPage').and.returnValue({});

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      authServiceSpy.logout.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.logout$).toBeObservable(expected$);
    });
  });

  describe('Reload', () => {
    const payload = '';
    it('should load the token and acl details on Window reload', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const reloadSuccessPayload: User = {
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
      authServiceSpy.getUrlPathWithQueryParams.and.returnValue({
        url: '/home',
        returnParams: 'menu=Advance Booking'
      });

      const action = new Reload(payload);
      const outcome1 = new ReloadSuccess(reloadSuccessPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: reloadSuccessPayload });
      authServiceSpy.reload.and.returnValue(response$);

      const expected$ = cold('--a', {
        a: outcome1
      });
      expect(effect.reload$).toBeObservable(expected$);
    });

    it('should load the token and acl details on Window reload', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const reloadSuccessPayload: User = {
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
      authServiceSpy.getUrlPathWithQueryParams.and.returnValue(payload);

      const action = new Reload(payload);
      const outcome1 = new ReloadSuccess(reloadSuccessPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: reloadSuccessPayload });
      authServiceSpy.reload.and.returnValue(response$);

      const expected$ = cold('--a', {
        a: outcome1
      });
      expect(effect.reload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new Reload(payload);
      const error = new Error('some error');
      const outCome = new ReloadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      authServiceSpy.reload.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.reload$).toBeObservable(expected$);
    });
  });

  describe('Refresh', () => {
    const payload = '';
    it('should Refresh the token before Refresh token expiry time', () => {
      const mapData = new Map();
      mapData.set('key', ['']);
      const refreshSuccessPayload: User = {
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

      const action = new Refresh(payload);
      const outcome1 = new RefreshSuccess(refreshSuccessPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: refreshSuccessPayload });
      authServiceSpy.refresh.and.returnValue(response$);

      spyOn(effect, 'reloadPage').and.returnValue({});

      const expected$ = cold('--a', {
        a: outcome1
      });
      expect(effect.refresh$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new Refresh(payload);
      const error = new Error('some error');
      const outCome = new Logout();

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      authServiceSpy.refresh.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.refresh$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new Refresh(payload);
      const error = new Error('some error');
      authServiceSpy.getCircuitBreakerCount.and.returnValue(1);

      spyOn(effect, 'reloadPage').and.returnValue({});

      const outCome = new RefreshFailure(CustomErrorAdaptor.fromJson(error));

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      authServiceSpy.refresh.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.refresh$).toBeObservable(expected$);
    });
  });

  // describe('GetSsoLogoutUrl', () => {
  //   const ssoLogoutUrl = 'ssoLogoutUrl';

  //   it('should GetSsoLogoutUrl', () => {
  //     const action = new GetSsoLogoutUrl();
  //     const outCome = window.open(ssoLogoutUrl, '_blank');

  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-a|', { a: ssoLogoutUrl });
  //     authServiceSpy.getSsoLogoutUrl.and.returnValue(response$);

  //     spyOn(window, 'open').and.callThrough();

  //     const expected$ = cold('--b', { b: outCome });
  //     expect(effect.ssoLogoutUrl$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new GetSsoLogoutUrl();
  //     const error = new Error('some error');
  //     const outCome = new GetSsoLogoutUrlFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     authServiceSpy.getSsoLogoutUrl.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outCome });
  //     expect(effect.ssoLogoutUrl$).toBeObservable(expected$);
  //   });
  // });
});
