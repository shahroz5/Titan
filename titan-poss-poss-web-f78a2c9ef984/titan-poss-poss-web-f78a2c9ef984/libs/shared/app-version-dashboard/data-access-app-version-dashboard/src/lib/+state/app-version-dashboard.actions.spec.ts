import {
  AddVersionRequestModel,
  AllAppVersionsList,
  AppVersionByStatusRequestPayloadWithQueryParams,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  CustomErrors,
  SelectDropDownOption
} from '@poss-web/shared/models';
import {
  AddApplicationVersion,
  AddApplicationVersionFailure,
  AddApplicationVersionSuccess,
  AppVersionDashboardActionTypes,
  DeleteAppVersionById,
  DeleteAppVersionByIdFailure,
  DeleteAppVersionByIdSuccess,
  GetAppVersions,
  GetAppVersionsByStatus,
  GetAppVersionsByStatusFailure,
  GetAppVersionsByStatusSuccess,
  GetAppVersionsFailure,
  GetAppVersionsSuccess,
  GetStatusList,
  GetStatusListFailure,
  GetStatusListSuccess,
  ListAllApplicationVersions,
  ListAllApplicationVersionsFailure,
  ListAllApplicationVersionsSuccess,
  PublishAllAppVersions,
  PublishAllAppVersionsFailure,
  PublishAllAppVersionsSuccess,
  Reset
} from './app-version-dashboard.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('App Version Dashboard Actions Testing Suite', () => {
  describe('GetAppVersions Test Cases', () => {
    it('should GetAppVersions action ', () => {
      const action = new GetAppVersions();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS
      });
    });

    it('should check correct type is used for GetAppVersionsSuccess action ', () => {
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

      const action = new GetAppVersionsSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  GetAppVersionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetAppVersionsFailure(payload);
      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_FAILURE,
        payload: payload
      });
    });
  });

  describe('ListAllApplicationVersions Test Cases', () => {
    it('should ListAllApplicationVersions action ', () => {
      const action = new ListAllApplicationVersions();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS
      });
    });

    it('should check correct type is used for ListAllApplicationVersionsSuccess action ', () => {
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

      const action = new ListAllApplicationVersionsSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  ListAllApplicationVersionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ListAllApplicationVersionsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS_FAILURE,
        payload: payload
      });
    });
  });

  describe('GetAppVersionsByStatus Test Cases', () => {
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
    it('should GetAppVersionsByStatus action ', () => {
      const action = new GetAppVersionsByStatus(payload);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS,
        payload: payload
      });
    });

    it('should check correct type is used for GetAppVersionsByStatusSuccess action ', () => {
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

      const action = new GetAppVersionsByStatusSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  GetAppVersionsByStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetAppVersionsByStatusFailure(payload);
      expect({ ...action }).toEqual({
        type:
          AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS_FAILURE,
        payload: payload
      });
    });
  });

  describe('GetStatusList Test Cases', () => {
    it('should GetStatusList action ', () => {
      const action = new GetStatusList();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST
      });
    });

    it('should check correct type is used for GetStatusListSuccess action ', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];

      const action = new GetStatusListSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  GetStatusListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetStatusListFailure(payload);
      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST_FAILURE,
        payload: payload
      });
    });
  });

  describe('AddApplicationVersion Test Cases', () => {
    it('should AddApplicationVersion action ', () => {
      const payload: AddVersionRequestModel = {
        databaseVersion: '1.0',
        downloadUrl: null,
        locationCode: ['CPD'],
        possServiceVersion: '1.0',
        possUiVersion: '1.0'
      };
      const action = new AddApplicationVersion(payload);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.ADD_APP_VERSION,
        payload: payload
      });
    });

    it('should check correct type is used for AddApplicationVersionSuccess action ', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];

      const action = new AddApplicationVersionSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.ADD_APP_VERSION_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  AddApplicationVersionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddApplicationVersionFailure(payload);
      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.ADD_APP_VERSION_FAILURE,
        payload: payload
      });
    });
  });

  describe('PublishAllAppVersions Test Cases', () => {
    it('should PublishAllAppVersions action ', () => {
      const action = new PublishAllAppVersions();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS
      });
    });

    it('should check correct type is used for PublishAllAppVersionsSuccess action ', () => {
      const action = new PublishAllAppVersionsSuccess();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_SUCCESS
      });
    });

    it('should check correct type is used for  PublishAllAppVersionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PublishAllAppVersionsFailure(payload);
      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS_FAILURE,
        payload: payload
      });
    });
  });

  describe('DeleteAppVersionById Test Cases', () => {
    it('should DeleteAppVersionById action ', () => {
      const action = new DeleteAppVersionById(10);

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID,
        payload: 10
      });
    });

    it('should check correct type is used for DeleteAppVersionByIdSuccess action ', () => {
      const action = new DeleteAppVersionByIdSuccess();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_SUCCESS
      });
    });

    it('should check correct type is used for  DeleteAppVersionByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteAppVersionByIdFailure(payload);
      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID_FAILURE,
        payload: payload
      });
    });
  });

  describe('Reset Test Cases', () => {
    it('should Reset action ', () => {
      const action = new Reset();

      expect({ ...action }).toEqual({
        type: AppVersionDashboardActionTypes.RESET
      });
    });
  });
});
