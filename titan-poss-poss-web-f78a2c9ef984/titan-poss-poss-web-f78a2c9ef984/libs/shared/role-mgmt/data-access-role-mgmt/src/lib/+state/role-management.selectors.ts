import { createSelector } from '@ngrx/store';

import { selectRoleManagementState } from './role-management.reducer';
import { RoleManagementState } from './role-management.state';

const selectRoleManagement = createSelector(
  selectRoleManagementState,
  (state: RoleManagementState) => state
);

const loadRoles = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.roles
);

const loadRoleTypes = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.roleTypes
);

const totalRoles = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.totalRoles
);

const fetchRole = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.fetchRole
);

const selectError = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.error
);

const addUpdateRole = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.updatedRole
);

const isLoading = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.isLoading
);

const fetchLocationFormats = createSelector(
  selectRoleManagement,
  (state: RoleManagementState) => state.locationformats
);

export const RoleManagementSelectors = {
  selectError,
  loadRoles,
  addUpdateRole,
  fetchRole,
  totalRoles,
  isLoading,
  fetchLocationFormats,
  loadRoleTypes
};
