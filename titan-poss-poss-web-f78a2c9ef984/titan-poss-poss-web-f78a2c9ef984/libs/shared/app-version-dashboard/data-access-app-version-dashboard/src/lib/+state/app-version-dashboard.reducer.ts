import { AppVersionDashboardState } from './app-version-dashboard.state';
import {
  AppVersionDashboardActions,
  AppVersionDashboardActionTypes
} from './app-version-dashboard.actions';

import { createFeatureSelector } from '@ngrx/store';

export const APPVERSION_DASHBOARD_FEATURE_KEY = 'appVersionDashboard';

export const selectAppVersionDashboardState = createFeatureSelector<
  AppVersionDashboardState
>(APPVERSION_DASHBOARD_FEATURE_KEY);

export const initialState: AppVersionDashboardState = {
  isLoading: false,
  error: null,
  appVersions: null,
  possUiVersionsList: null,
  apiVersionsList: null,
  dbVersionsList: null,
  appVersionDataByStatus: null,
  totalElements: null,
  newAppVersionAdded: false,
  appVersionStatusList: null,
  appVersionsPublished: null,
  appVersionDeleted: null,
  allPossUiVersionsList: null,
  allEpossUiVersionsList: null,
  allApiVersionsList: null,
  allDbVersionsList: null
};

export function AppVersionDashboardReducer(
  state: AppVersionDashboardState = initialState,
  action: AppVersionDashboardActions
): AppVersionDashboardState {
  switch (action.type) {
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersions: action.payload.appVersionData,
        possUiVersionsList: action.payload.possUiVersionsList,
        apiVersionsList: action.payload.apiVersionsList,
        dbVersionsList: action.payload.dbVersionsList
      };
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        appVersions: null,
        possUiVersionsList: null,
        apiVersionsList: null,
        dbVersionsList: null
      };
    case AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS:
      return {
        ...state,
        isLoading: true,
        error: null,
        allPossUiVersionsList: null,
        allEpossUiVersionsList: null,
        allApiVersionsList: null,
        allDbVersionsList: null
      };
    case AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        allPossUiVersionsList: action.payload.allPossUiVersionsList,
        allEpossUiVersionsList: action.payload.allEpossUiVersionsList,
        allApiVersionsList: action.payload.allApiVersionsList,
        allDbVersionsList: action.payload.allDbVersionsList
      };
    case AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        allPossUiVersionsList: null,
        allEpossUiVersionsList: null,
        allApiVersionsList: null,
        allDbVersionsList: null
      };
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersionDataByStatus: action.payload.appVersionDataByStatus,
        totalElements: action.payload.count
      };
    case AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        appVersionDataByStatus: null,
        totalElements: null
      };
    case AppVersionDashboardActionTypes.ADD_APP_VERSION:
      return {
        ...state,
        isLoading: true,
        error: null,
        newAppVersionAdded: null
      };
    case AppVersionDashboardActionTypes.ADD_APP_VERSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        newAppVersionAdded: true
      };
    case AppVersionDashboardActionTypes.ADD_APP_VERSION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        newAppVersionAdded: false
      };
    case AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        appVersionStatusList: null
      };
    case AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersionStatusList: action.payload
      };
    case AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS:
      return {
        ...state,
        isLoading: true,
        error: null,
        appVersionsPublished: null
      };
    case AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersionsPublished: true
      };
    case AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        appVersionsPublished: false
      };
    case AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID:
      return {
        ...state,
        isLoading: true,
        error: null,
        appVersionDeleted: null
      };
    case AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersionDeleted: true
      };
    case AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        appVersionDeleted: false
      };
    case AppVersionDashboardActionTypes.RESET:
      return {
        ...state,
        isLoading: false,
        error: null,
        appVersions: null,
        possUiVersionsList: null,
        apiVersionsList: null,
        dbVersionsList: null,
        appVersionDataByStatus: null,
        totalElements: null,
        newAppVersionAdded: false,
        appVersionStatusList: null,
        appVersionsPublished: null,
        appVersionDeleted: null,

        allPossUiVersionsList: null,
        allEpossUiVersionsList: null,
        allApiVersionsList: null,
        allDbVersionsList: null
      };
    default:
      return state;
  }
}
