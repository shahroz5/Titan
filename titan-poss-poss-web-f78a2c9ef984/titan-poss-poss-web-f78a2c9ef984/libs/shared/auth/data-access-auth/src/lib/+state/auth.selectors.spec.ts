import { AuthState } from '@poss-web/shared/models';
import { initialAuthState } from './auth.reducer';
import * as selectors from './auth.selectors';

describe('Auth Selector Testing Suite', () => {
  it('Testing selectAuthData selector', () => {
    const state: AuthState = {
      ...initialAuthState
    };
    expect(selectors.authDataQuery.selectAuthData.projector(state)).toEqual(
      state
    );
  });

  it('Testing selectStoreType selector', () => {
    const storeTypePayload = 'L1';
    const state: AuthState = {
      ...initialAuthState,
      storeType: storeTypePayload
    };
    expect(selectors.authDataQuery.selectStoreType.projector(state)).toEqual(
      storeTypePayload
    );
  });

  it('Testing selectIsLoading selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      isLoading: false
    };
    expect(selectors.authDataQuery.selectIsLoading.projector(state)).toBe(
      false
    );
  });

  it('Testing selectIsLoggedOutStatus selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      isLoggedOut: false
    };
    expect(
      selectors.authDataQuery.selectIsLoggedOutStatus.projector(state)
    ).toBe(false);
  });

  it('Testing selectIsLoggedInStatus selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      isLoggedIn: true
    };
    expect(
      selectors.authDataQuery.selectIsLoggedInStatus.projector(state)
    ).toBe(true);
  });

  it('Testing selectAccessToken selector', () => {
    const accessTokenPayload = '';
    const state: AuthState = {
      ...initialAuthState,
      accessToken: accessTokenPayload
    };
    expect(selectors.authDataQuery.selectAccessToken.projector(state)).toEqual(
      accessTokenPayload
    );
  });

  it('Testing selectAuthError selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      error: null
    };
    expect(selectors.authDataQuery.selectAuthError.projector(state)).toBe(null);
  });

  it('Testing selectLocationCode selector', () => {
    const locationCodePayload = 'TJ';
    const state: AuthState = {
      ...initialAuthState,
      locationCode: locationCodePayload
    };
    expect(selectors.authDataQuery.selectLocationCode.projector(state)).toEqual(
      locationCodePayload
    );
  });

  it('Testing selectLastName selector', () => {
    const lastNamePayload = 'Admin';
    const state: AuthState = {
      ...initialAuthState,
      lastName: lastNamePayload
    };
    expect(selectors.authDataQuery.selectLastName.projector(state)).toEqual(
      lastNamePayload
    );
  });

  it('Testing selectFirstName selector', () => {
    const firstNamePayload = 'System';
    const state: AuthState = {
      ...initialAuthState,
      firstName: firstNamePayload
    };
    expect(selectors.authDataQuery.selectFirstName.projector(state)).toEqual(
      firstNamePayload
    );
  });

  it('Testing selectUserName selector', () => {
    const userNamePayload = 'System Admin';
    const state: AuthState = {
      ...initialAuthState,
      userName: userNamePayload
    };
    expect(selectors.authDataQuery.selectUserName.projector(state)).toEqual(
      userNamePayload
    );
  });

  it('Testing selectReloadState selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      isReloaded: true
    };
    expect(selectors.authDataQuery.selectReloadState.projector(state)).toEqual(
      true
    );
  });

  it('Testing selectExpTime selector', () => {
    const exptimePayload = new Date();
    const state: AuthState = {
      ...initialAuthState,
      exptime: exptimePayload
    };
    expect(selectors.authDataQuery.selectExpTime.projector(state)).toEqual(
      exptimePayload
    );
  });

  it('Testing selectRefreshToken selector', () => {
    const refreshTokenpayload = 'abcdefghijklmnopqrstuvwxyz';
    const state: AuthState = {
      ...initialAuthState,
      refreshToken: refreshTokenpayload
    };
    expect(selectors.authDataQuery.selectRefreshToken.projector(state)).toEqual(
      refreshTokenpayload
    );
  });

  it('Testing selectRefreshTokenExp selector', () => {
    const refreshTokenExpPayload = new Date();
    const state: AuthState = {
      ...initialAuthState,
      refreshTokenExp: refreshTokenExpPayload
    };
    expect(
      selectors.authDataQuery.selectRefreshTokenExp.projector(state)
    ).toEqual(refreshTokenExpPayload);
  });
  it('Testing selectACL selector', () => {
    const aclData = new Map();
    aclData.set('key', ['']);

    const state: AuthState = {
      ...initialAuthState,
      acl: aclData
    };
    expect(selectors.authDataQuery.selectACL.projector(state)).toEqual(aclData);
  });
  it('Testing selectRefreshNotificationStatus selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      showRefreshAlertMessage: true
    };
    expect(
      selectors.authDataQuery.selectRefreshNotificationStatus.projector(state)
    ).toEqual(true);
  });

  it('Testing selectSsoLogoutUrl selector', () => {
    const state: AuthState = {
      ...initialAuthState,
      ssoLogoutUrl: 'ssoLogoutUrl'
    };
    expect(selectors.authDataQuery.selectSsoLogoutUrl.projector(state)).toEqual(
      'ssoLogoutUrl'
    );
  });
});
