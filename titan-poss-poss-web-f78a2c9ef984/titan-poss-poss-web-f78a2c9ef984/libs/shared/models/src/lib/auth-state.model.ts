import { CustomErrors } from './error.model';

export interface LoginModel {
  userName: string;
  authorizationCode: string;
}

export interface AuthState {
  userName: string;
  firstName: string;
  lastName: string;
  locationCode: string;
  storeType: string;
  accessToken?: string;
  isLoading: boolean;
  isLoggedIn: boolean;
  isLoggedOut: boolean;
  isReloaded: boolean;
  exptime: Date;
  refreshToken: string;
  refreshTokenExp: Date;
  acl: Map<string, string[]>;
  error: CustomErrors;
  showRefreshAlertMessage?: boolean;
  isSsoLogin: boolean;
  ssoLogoutUrl: string;
}
