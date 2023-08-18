import { selectAppVersionDashboardState } from './app-version-dashboard.reducer';

import { createSelector } from '@ngrx/store';
import { AppVersionDashboardState } from './app-version-dashboard.state';

export const selectAppVersionDashboard = createSelector(
  selectAppVersionDashboardState,
  (state: AppVersionDashboardState) => state
);
const isLoading = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.isLoading
);
const selectError = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.error
);
const appVersions = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.appVersions
);
const possUiVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.possUiVersionsList
);
const apiVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.apiVersionsList
);
const dbVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.dbVersionsList
);
const appVersionDataByStatus = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.appVersionDataByStatus
);
const appVersionListCount = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.totalElements
);
const isNewAppVersionAdded = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.newAppVersionAdded
);
const appVersionStatusList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.appVersionStatusList
);
const isAppVersionsPublished = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.appVersionsPublished
);
const isAppVersionDeleted = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.appVersionDeleted
);
const allPossUiVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.allPossUiVersionsList
);
const allEpossUiVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.allEpossUiVersionsList
);
const allApiVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.allApiVersionsList
);
const allDbVersionsList = createSelector(
  selectAppVersionDashboard,
  (state: AppVersionDashboardState) => state.allDbVersionsList
);

export const AppVersionDashboardSelectors = {
  isLoading,
  selectError,
  appVersions,
  possUiVersionsList,
  apiVersionsList,
  dbVersionsList,
  appVersionDataByStatus,
  appVersionListCount,
  isNewAppVersionAdded,
  appVersionStatusList,
  isAppVersionsPublished,
  isAppVersionDeleted,

  allPossUiVersionsList,
  allEpossUiVersionsList,
  allApiVersionsList,
  allDbVersionsList
};
