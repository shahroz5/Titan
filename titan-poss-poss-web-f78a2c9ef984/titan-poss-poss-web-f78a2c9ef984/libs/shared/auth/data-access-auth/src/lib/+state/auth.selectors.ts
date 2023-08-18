import { createSelector } from '@ngrx/store';
import { AuthState } from '@poss-web/shared/models';
import { selectAuthState } from './auth.reducer';

const selectAuthData = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

const selectStoreType = createSelector(
  selectAuthData,
  (state: AuthState) => state.storeType
);

const selectIsLoggedOutStatus = createSelector(
  selectAuthData,
  (state: AuthState) => state.isLoggedOut
);

const selectIsLoggedInStatus = createSelector(
  selectAuthData,
  (state: AuthState) => state.isLoggedIn
);

const selectAccessToken = createSelector(
  selectAuthData,
  (state: AuthState) => state.accessToken
);

const selectAuthError = createSelector(
  selectAuthData,
  (state: AuthState) => state.error
);

const selectLocationCode = createSelector(
  selectAuthData,
  (state: AuthState) => state.locationCode
);

const selectLastName = createSelector(
  selectAuthData,
  (state: AuthState) => state.lastName
);

const selectFirstName = createSelector(
  selectAuthData,
  (state: AuthState) => state.firstName
);

const selectUserName = createSelector(
  selectAuthData,
  (state: AuthState) => state.userName
);

const selectReloadState = createSelector(
  selectAuthData,
  (state: AuthState) => state.isReloaded
);

const selectIsLoading = createSelector(
  selectAuthData,
  (state: AuthState) => state.isLoading
);

const selectRefreshToken = createSelector(
  selectAuthData,
  (state: AuthState) => state.refreshToken
);

const selectExpTime = createSelector(
  selectAuthData,
  (state: AuthState) => state.exptime
);

const selectRefreshTokenExp = createSelector(
  selectAuthData,
  (state: AuthState) => state.refreshTokenExp
);

const selectACL = createSelector(
  selectAuthData,
  (state: AuthState) => state.acl
);
const selectRefreshNotificationStatus = createSelector(
  selectAuthData,
  (state: AuthState) => state.showRefreshAlertMessage
);
const selectSsoLogoutUrl = createSelector(
  selectAuthData,
  (state: AuthState) => state.ssoLogoutUrl
);
// const selectIsSsoLogin = createSelector(
//   selectAuthData,
//   (state: AuthState) => state.isSsoLogin
// );

export const authDataQuery = {
  selectAuthData,
  selectStoreType,
  selectIsLoading,
  selectIsLoggedOutStatus,
  selectIsLoggedInStatus,
  selectAccessToken,
  selectAuthError,
  selectLocationCode,
  selectLastName,
  selectFirstName,
  selectUserName,
  selectReloadState,
  selectExpTime,
  selectRefreshToken,
  selectRefreshTokenExp,
  selectACL,
  selectRefreshNotificationStatus,
  selectSsoLogoutUrl
  // selectIsSsoLogin
};
