import { Action } from '@ngrx/store';
import { CustomErrors, User } from '@poss-web/shared/models';

/**
 * Action Payload Type Declarations
 */
export interface LoginPayload {
  userName: string;
  authorizationCode: string;
}

export interface RefreshCheckPayload {
  exptime: Date;
  refreshToken: string;
}

/**
 * Action Type declariation
 */
export enum AuthActionTypes {
  LOGIN = '[Auth] Login User',
  LOGIN_SUCCESS = '[Auth] User Login Successfull',
  LOGIN_FAILURE = '[Auth] User Login Failed',

  LOGOUT = '[Auth] Logout User',
  LOGOUT_SUCCESS = '[Auth] Logout User Successfull',
  LOGOUT_FAILURE = '[Auth] Logout User Failure',

  RELOAD = '[Auth] Reload Logged In User',
  RELOAD_SUCCESS = '[Auth] Reload Logged In User Successfull',
  RELOAD_FAILURE = '[Auth] Reload Logged In User Failure',

  REFRESH = '[Auth] Refresh Access Token',
  REFRESH_SUCCESS = '[Auth] Refresh Access Token Successfull',
  REFRESH_FAILURE = '[Auth] Refresh Access Token Failure',

  REFRESH_CHECK = '[Auth] Refresh Check',

  SHOW_REFRESH_NOTIFICATION = '[Auth] Show Refresh Notification',
  HIDE_REFRESH_NOTIFICATION = '[Auth] Hide Refresh Notification',

  CHANGE_LOGIN_STATUS = '[Auth] Change Login Status',

  GET_SSO_LOGOUT_URL = '[Auth] Get Sso Logout Url',
  GET_SSO_LOGOUT_URL_SUCCESS = '[Auth] Get Sso Logout Url Success',
  GET_SSO_LOGOUT_URL_FAILURE = '[Auth] Get Sso Logout Url Failure',

  CLEAR_SSO_LOGOUT_URL = '[Auth] Clear Sso Logout Url'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: LoginPayload) {}
}
export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: User) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}
export class LogoutFailure implements Action {
  readonly type = AuthActionTypes.LOGOUT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
}

export class Reload implements Action {
  readonly type = AuthActionTypes.RELOAD;
  constructor(public readonly payload: string) {}
}

export class ReloadSuccess implements Action {
  readonly type = AuthActionTypes.RELOAD_SUCCESS;
  constructor(public readonly payload: User) {}
}

export class ReloadFailure implements Action {
  readonly type = AuthActionTypes.RELOAD_FAILURE;
  constructor(public readonly payload: CustomErrors) {}
}

export class Refresh implements Action {
  readonly type = AuthActionTypes.REFRESH;
  constructor(public readonly payload: string) {}
}

export class RefreshSuccess implements Action {
  readonly type = AuthActionTypes.REFRESH_SUCCESS;
  constructor(public readonly payload: User) {}
}

export class RefreshFailure implements Action {
  readonly type = AuthActionTypes.REFRESH_FAILURE;
  constructor(public readonly payload: CustomErrors) {}
}

export class RefreshCheck implements Action {
  readonly type = AuthActionTypes.REFRESH_CHECK;
  constructor(public readonly payload: RefreshCheckPayload) {}
}

export class ShowRefreshNotification implements Action {
  readonly type = AuthActionTypes.SHOW_REFRESH_NOTIFICATION;
}
export class HideRefreshNotification implements Action {
  readonly type = AuthActionTypes.HIDE_REFRESH_NOTIFICATION;
}

export class ChangeLoginStatus implements Action {
  readonly type = AuthActionTypes.CHANGE_LOGIN_STATUS;
  constructor(public readonly payload: boolean) {}
}

export class GetSsoLogoutUrl implements Action {
  readonly type = AuthActionTypes.GET_SSO_LOGOUT_URL;
}
export class GetSsoLogoutUrlSuccess implements Action {
  readonly type = AuthActionTypes.GET_SSO_LOGOUT_URL_SUCCESS;
  constructor(public readonly payload: string) {}
}
export class GetSsoLogoutUrlFailure implements Action {
  readonly type = AuthActionTypes.GET_SSO_LOGOUT_URL_FAILURE;
  constructor(public readonly payload: CustomErrors) {}
}

export class ClearSsoLogoutUrl implements Action {
  readonly type = AuthActionTypes.CLEAR_SSO_LOGOUT_URL;
}

export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | Logout
  | LogoutSuccess
  | LogoutFailure
  | Reload
  | ReloadSuccess
  | ReloadFailure
  | Refresh
  | RefreshSuccess
  | RefreshFailure
  | RefreshCheck
  | ShowRefreshNotification
  | HideRefreshNotification
  | ChangeLoginStatus
  | GetSsoLogoutUrl
  | GetSsoLogoutUrlSuccess
  | GetSsoLogoutUrlFailure
  | ClearSsoLogoutUrl;
