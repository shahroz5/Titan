import { Injectable } from '@angular/core';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LoginModel } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authFacade: AuthFacade) {}

  getUserName(): Observable<string> {
    return this.authFacade.selectUserName$;
  }

  getAuthData() {
    return this.authFacade.selectAuthData$;
  }

  getLoginError() {
    return this.authFacade.selectLoginError$;
  }

  getAccessToken() {
    return this.authFacade.getAccessToken$;
  }

  getStoreType() {
    return this.authFacade.getStoreType$;
  }

  getLocationCode() {
    return this.authFacade.getLocationCode$;
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.authFacade.selectLoggedInStatus$;
  }

  isLoading() {
    return this.authFacade.isLoading$;
  }

  isUserLoggedOut() {
    return this.authFacade.selectLoggedOutStatus$;
  }

  getReloadState() {
    return this.authFacade.getReloadStatus$;
  }

  getExpTime() {
    return this.authFacade.getExpTime$;
  }

  getRefreshToken() {
    return this.authFacade.getRefreshToken$;
  }

  getRefreshTokenExp() {
    return this.authFacade.getRefreshTokenExp$;
  }

  getACL() {
    return this.authFacade.getACL$;
  }

  login(loginInputs: LoginModel) {
    this.authFacade.login(loginInputs);
  }

  logOut() {
    this.authFacade.logOut();
  }

  reload(returnUrl: string) {
    this.authFacade.reload(returnUrl);
  }

  refresh(refreshToken: string) {
    this.authFacade.refresh(refreshToken);
  }
}
