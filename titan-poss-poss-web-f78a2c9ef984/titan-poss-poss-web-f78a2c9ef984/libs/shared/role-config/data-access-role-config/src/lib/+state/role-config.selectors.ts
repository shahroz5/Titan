import { createSelector } from '@ngrx/store';

import { selectRoleConfigState } from './role-config.reducer';
import { RoleConfigState } from './role-config.state';

const selectRoleConfig = createSelector(
  selectRoleConfigState,
  (state: RoleConfigState) => state
);

const loadRoles = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.roles
);

const selectError = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.error
);

const roleCountChanged = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.roleCountChanged
);

const fetchRoleCountRequestList = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.roleCountRequestList
);

const fetchRoleCountRequestListLength = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.roleCountRequestListlength
);

const fetchRequestedRoles = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.requestedRoles
);

const fetchRoleCountRequest = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.requestdata
);

const fetchLocations = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.locations
);

const fetchLocationFormats = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.locationformats
);

const isLoading = createSelector(
  selectRoleConfig,
  (state: RoleConfigState) => state.isLoading
);

export const RoleConfigSelectors = {
  selectError,
  loadRoles,
  isLoading,
  roleCountChanged,
  fetchRoleCountRequestList,
  fetchRoleCountRequestListLength,
  fetchRoleCountRequest,
  fetchRequestedRoles,
  fetchLocations,
  fetchLocationFormats
};
