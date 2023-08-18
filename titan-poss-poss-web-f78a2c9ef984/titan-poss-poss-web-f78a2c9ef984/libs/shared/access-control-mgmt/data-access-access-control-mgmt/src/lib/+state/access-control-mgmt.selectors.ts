import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  AccessControlManagementState,
  ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY
} from './access-control-mgmt.state';

export const selectAccessControlManagementState = createFeatureSelector<
  AccessControlManagementState
>(ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY);

export const selectIsLoading = createSelector(
  selectAccessControlManagementState,
  state => state.isLoading
);

export const selectIsACLUpdateSuccess = createSelector(
  selectAccessControlManagementState,
  state => state.isACLUpdateSuccess
);

export const selectError = createSelector(
  selectAccessControlManagementState,
  state => state.error
);

export const selectRoles = createSelector(
  selectAccessControlManagementState,
  state => state.roles
);

export const selectModules = createSelector(
  selectAccessControlManagementState,
  state => state.modules
);

export const selectSubModules = createSelector(
  selectAccessControlManagementState,
  state => state.subModules
);

export const selectFeatures = createSelector(
  selectAccessControlManagementState,
  state => state.features
);

export const selectACL = createSelector(
  selectAccessControlManagementState,
  state => state.acl
);

export const AccessControlManagementSelectors = {
  selectError,
  selectRoles,
  selectModules,
  selectIsLoading,
  selectSubModules,
  selectFeatures,
  selectACL,
  selectIsACLUpdateSuccess
};
