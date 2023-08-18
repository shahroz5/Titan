import { createSelector } from '@ngrx/store';
import { selectPermissionState } from './permission.reducer';
import { PermissionState } from './permission.state';

const selectPermissions = createSelector(
  selectPermissionState,
  (state: PermissionState) => state
);

const fetchPermissionforURL = createSelector(
  selectPermissions,
  (state: PermissionState) => state.elements
);

const fetchURLPermission = createSelector(
  selectPermissions,
  (state: PermissionState) => state.urls
);

const fetchChildRoutes = createSelector(
  selectPermissions,
  data => data.allowedRoutes
);

const selectError = createSelector(
  selectPermissions,
  (state: PermissionState) => state.error
);
const selectIsLoading = createSelector(
  selectPermissions,
  state => state.isLoading
);

export const PermissionSelectors = {
  selectError,
  selectIsLoading,
  fetchURLPermission,
  fetchPermissionforURL,
  fetchChildRoutes
};
