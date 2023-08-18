import {
  AddVersionRequestModel,
  AllAppVersionsList,
  AppVersionByStatusRequestPayloadWithQueryParams,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  CustomErrors,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './app-version-dashboard.actions';
import {
  AppVersionDashboardReducer,
  initialState
} from './app-version-dashboard.reducer';
import { AppVersionDashboardState } from './app-version-dashboard.state';

describe('App Version Dashboard Reducer Testing Suite', () => {
  describe('Testing GetAppVersions Functionality', () => {
    beforeEach(() => {});

    it('Testing GET_APPLICATION_VERSIONS', () => {
      const action = new actions.GetAppVersions();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing GET_APPLICATION_VERSIONS_SUCCESS', () => {
      const responsePayload: AppVersionsList = {
        appVersionData: [
          {
            databaseVersion: '1.0',

            possServiceVersion: '1.0',
            possUiVersion: '1.0'
          }
        ],
        possUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        apiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        dbVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ]
      };

      const action = new actions.GetAppVersionsSuccess(responsePayload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersions).toBe(action.payload.appVersionData);
      expect(result.possUiVersionsList).toBe(action.payload.possUiVersionsList);
      expect(result.apiVersionsList).toBe(action.payload.apiVersionsList);
      expect(result.dbVersionsList).toBe(action.payload.dbVersionsList);
    });

    it('Testing GET_APPLICATION_VERSIONS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetAppVersionsFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.appVersions).toBe(null);
      expect(result.possUiVersionsList).toBe(null);
      expect(result.apiVersionsList).toBe(null);
      expect(result.dbVersionsList).toBe(null);
    });
  });

  describe('Testing ListAllApplicationVersions Functionality', () => {
    beforeEach(() => {});

    it('Testing LIST_ALL_APPLICATION_VERSIONS', () => {
      const action = new actions.ListAllApplicationVersions();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.allPossUiVersionsList).toBe(null);
      expect(result.allEpossUiVersionsList).toBe(null);
      expect(result.allApiVersionsList).toBe(null);
      expect(result.allDbVersionsList).toBe(null);
    });

    it('Testing LIST_ALL_APPLICATION_VERSIONS_SUCCESS', () => {
      const responsePayload: AllAppVersionsList = {
        allPossUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allEpossUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allApiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allDbVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ]
      };

      const action = new actions.ListAllApplicationVersionsSuccess(
        responsePayload
      );
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.allPossUiVersionsList).toBe(
        action.payload.allPossUiVersionsList
      );
      expect(result.allEpossUiVersionsList).toBe(
        action.payload.allEpossUiVersionsList
      );
      expect(result.allApiVersionsList).toBe(action.payload.allApiVersionsList);
      expect(result.allDbVersionsList).toBe(action.payload.allDbVersionsList);
    });

    it('Testing LIST_ALL_APPLICATION_VERSIONS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ListAllApplicationVersionsFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.allPossUiVersionsList).toBe(null);
      expect(result.allEpossUiVersionsList).toBe(null);
      expect(result.allApiVersionsList).toBe(null);
      expect(result.allDbVersionsList).toBe(null);
    });
  });

  describe('Testing GetAppVersionsByStatus Functionality', () => {
    beforeEach(() => {});

    it('Testing GET_APPLICATION_VERSIONS_BY_STATUS', () => {
      const payload: AppVersionByStatusRequestPayloadWithQueryParams = {
        appVersionByStatusRequestPayload: {
          status: 'OPEN',
          location: 'CPD',
          databaseVersion: '1.0',
          epossUiVersion: '1.0',
          possServiceVersion: '1.0',
          possUiVersion: '1.0'
        },
        queryParams: null
      };

      const action = new actions.GetAppVersionsByStatus(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing GET_APPLICATION_VERSIONS_BY_STATUS_SUCCESS', () => {
      const responsePayload: AppVersionDataByStatusResponse = {
        appVersionDataByStatus: [
          {
            databaseVersion: '1.0',
            downloadUrl: null,
            id: '1',
            locationCode: 'CPD',
            possServiceVersion: '1.0',
            possUiVersion: '1.0',
            status: 'OPEN',
            published: true
          }
        ],
        count: 1
      };

      const action = new actions.GetAppVersionsByStatusSuccess(responsePayload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersionDataByStatus).toBe(
        action.payload.appVersionDataByStatus
      );
      expect(result.totalElements).toBe(action.payload.count);
    });

    it('Testing GET_APPLICATION_VERSIONS_BY_STATUS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetAppVersionsByStatusFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.appVersionDataByStatus).toBe(null);
      expect(result.totalElements).toBe(null);
    });
  });

  describe('Testing AddApplicationVersion Functionality', () => {
    beforeEach(() => {});

    it('Testing ADD_APP_VERSION', () => {
      const payload: AddVersionRequestModel = {
        databaseVersion: '1.0',
        downloadUrl: null,
        locationCode: ['CPD'],
        possServiceVersion: '1.0',
        possUiVersion: '1.0'
      };

      const action = new actions.AddApplicationVersion(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.newAppVersionAdded).toBe(null);
    });

    it('Testing ADD_APP_VERSION_SUCCESS', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];

      const action = new actions.AddApplicationVersionSuccess(responsePayload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.newAppVersionAdded).toBe(true);
    });

    it('Testing ADD_APP_VERSION_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.AddApplicationVersionFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.newAppVersionAdded).toBe(false);
    });
  });

  describe('Testing GetStatusList Functionality', () => {
    beforeEach(() => {});

    it('Testing GET_APPVERSION_STATUS_LIST', () => {
      const action = new actions.GetStatusList();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.appVersionStatusList).toBe(null);
    });

    it('Testing GET_APPVERSION_STATUS_LIST_SUCCESS', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];
      const action = new actions.GetStatusListSuccess(responsePayload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersionStatusList).toBe(action.payload);
    });

    it('Testing GET_APPVERSION_STATUS_LIST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetStatusListFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });

  describe('Testing PublishAllAppVersions Functionality', () => {
    beforeEach(() => {});

    it('Testing PUBLISH_APP_VERSIONS', () => {
      const action = new actions.PublishAllAppVersions();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.appVersionsPublished).toBe(null);
    });

    it('Testing PUBLISH_APP_VERSIONS_SUCCESS', () => {
      const action = new actions.PublishAllAppVersionsSuccess();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersionsPublished).toBe(true);
    });

    it('Testing PUBLISH_APP_VERSIONS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PublishAllAppVersionsFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.appVersionsPublished).toBe(false);
    });
  });

  describe('Testing DeleteAppVersionById Functionality', () => {
    beforeEach(() => {});

    it('Testing DELETE_APP_VERSION_BY_ID', () => {
      const action = new actions.DeleteAppVersionById(123456789);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.appVersionDeleted).toBe(null);
    });

    it('Testing DELETE_APP_VERSION_BY_ID_SUCCESS', () => {
      const action = new actions.DeleteAppVersionByIdSuccess();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersionDeleted).toBe(true);
    });

    it('Testing DELETE_APP_VERSION_BY_ID_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.DeleteAppVersionByIdFailure(payload);
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(action.payload);
      expect(result.appVersionDeleted).toBe(false);
    });
  });

  describe('Testing Reset Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.Reset();
      const result: AppVersionDashboardState = AppVersionDashboardReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.appVersions).toBe(null);
      expect(result.possUiVersionsList).toBe(null);
      expect(result.apiVersionsList).toBe(null);
      expect(result.dbVersionsList).toBe(null);
      expect(result.appVersionDataByStatus).toBe(null);
      expect(result.totalElements).toBe(null);
      expect(result.newAppVersionAdded).toBe(false);
      expect(result.appVersionStatusList).toBe(null);
      expect(result.appVersionsPublished).toBe(null);
      expect(result.appVersionDeleted).toBe(null);
      expect(result.allPossUiVersionsList).toBe(null);
      expect(result.allEpossUiVersionsList).toBe(null);
      expect(result.allApiVersionsList).toBe(null);
      expect(result.allDbVersionsList).toBe(null);
    });
  });
});
