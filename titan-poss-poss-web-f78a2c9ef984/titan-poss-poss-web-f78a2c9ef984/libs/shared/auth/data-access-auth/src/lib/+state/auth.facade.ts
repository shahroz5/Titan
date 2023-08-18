import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '@poss-web/shared/models';
import * as AuthActions from './auth.actions';
import { LoginPayload } from './auth.actions';
import { authDataQuery } from './auth.selectors';

@Injectable()
export class AuthFacade {
  selectUserName$ = this.store.select(authDataQuery.selectUserName);
  selectLoggedInStatus$ = this.store.select(
    authDataQuery.selectIsLoggedInStatus
  );
  selectLoggedOutStatus$ = this.store.select(
    authDataQuery.selectIsLoggedOutStatus
  );

  selectAuthData$ = this.store.select(authDataQuery.selectAuthData);

  selectLoginError$ = this.store.select(authDataQuery.selectAuthError);

  getAccessToken$ = this.store.select(authDataQuery.selectAccessToken);

  getReloadStatus$ = this.store.select(authDataQuery.selectReloadState);

  getExpTime$ = this.store.select(authDataQuery.selectExpTime);

  getRefreshToken$ = this.store.select(authDataQuery.selectRefreshToken);

  getRefreshTokenExp$ = this.store.select(authDataQuery.selectRefreshTokenExp);

  getStoreType$ = this.store.select(authDataQuery.selectStoreType);

  getLocationCode$ = this.store.select(authDataQuery.selectLocationCode);

  getACL$ = this.store.select(authDataQuery.selectACL);

  refreshNotificationStatus$ = this.store.select(
    authDataQuery.selectRefreshNotificationStatus
  );

  selectSsoLogoutUrl$ = this.store.select(authDataQuery.selectSsoLogoutUrl);

  // isSsoLogin$ = this.store.select(authDataQuery.selectIsSsoLogin);

  isLoading$ = this.store.select(authDataQuery.selectIsLoading);

  constructor(private store: Store<AuthState>) {}

  getUserName() {
    return this.selectUserName$;
  }

  getAuthData() {
    return this.selectAuthData$;
  }

  getLoginError() {
    return this.selectLoginError$;
  }

  getAccessToken() {
    return this.getAccessToken$;
  }

  getStoreType() {
    return this.getStoreType$;
  }

  getLocationCode() {
    return this.getLocationCode$;
  }

  isUserLoggedIn() {
    return this.selectLoggedInStatus$;
  }

  isLoading() {
    return this.isLoading$;
  }

  isUserLoggedOut() {
    return this.selectLoggedOutStatus$;
  }

  getReloadState() {
    return this.getReloadStatus$;
  }

  getExpTime() {
    return this.getExpTime$;
  }

  getRefreshToken() {
    return this.getRefreshToken$;
  }

  getRefreshTokenExp() {
    return this.getRefreshTokenExp$;
  }

  getACL() {
    return this.getACL$;
  }

  getRefreshNotificationStatus() {
    return this.refreshNotificationStatus$;
  }

  getSsoLogoutUrl() {
    return this.selectSsoLogoutUrl$;
  }
  // getIsSsoLogin() {
  //   return this.isSsoLogin$;
  // }

  hideRefreshNotificationStatus() {
    this.store.dispatch(new AuthActions.HideRefreshNotification());
  }

  login(loginInputs: LoginPayload) {
    this.store.dispatch(new AuthActions.Login(loginInputs));
  }

  logOut() {
    // this.isSsoLogin$
    //   .pipe(
    //     filter(isSsoLogin => !!isSsoLogin),
    //     take(1)
    //   )
    //   .subscribe(isSsoLogin => {
    //     if (isSsoLogin) {
    //       this.store.dispatch(new AuthActions.GetSsoLogoutUrl());
    //     }
    //   });

    this.store.dispatch(new AuthActions.Logout());
  }

  reload(returnUrl: string) {
    this.store.dispatch(new AuthActions.Reload(returnUrl));
  }

  refresh(refreshToken: string) {
    this.store.dispatch(new AuthActions.Refresh(refreshToken));
  }

  showRefreshNotification() {
    this.store.dispatch(new AuthActions.ShowRefreshNotification());
  }
  // logoutFromSso(ssoLogoutUrl: string) {
  //   this.store.dispatch(new AuthActions.LogoutFromSso(ssoLogoutUrl));
  // }
  clearSsoLogoutUrl() {
    this.store.dispatch(new AuthActions.ClearSsoLogoutUrl());
  }
}
