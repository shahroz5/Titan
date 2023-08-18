import {
  CustomErrors,
  DataSyncCountByMessageTypePayload,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesList,
  DataSyncMessagesListResponse,
  DataSyncMessagesPayloadData,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  SchedulerJobsResponse,
  SchedulerJobsResults,
  SelectDropDownOption,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadAllScheduledJobs,
  LoadAllScheduledJobsFailure,
  LoadAllScheduledJobsForUpdate,
  LoadAllScheduledJobsForUpdateFailure,
  LoadAllScheduledJobsForUpdateSuccess,
  LoadAllScheduledJobsSuccess,
  LoadCountByMessageType,
  LoadCountByMessageTypeFailure,
  LoadCountByMessageTypeSuccess,
  LoadDataSyncJobs,
  LoadDataSyncJobsFailure,
  LoadDataSyncJobsSuccess,
  LoadDataSyncStatusList,
  LoadDataSyncStatusListFailure,
  LoadDataSyncStatusListSuccess,
  ManuallyRunSchedulerJob,
  ManuallyRunSchedulerJobFailure,
  ManuallyRunSchedulerJobSuccess,
  ManuallyRunSelectedJob,
  ManuallyRunSelectedJobFailure,
  ManuallyRunSelectedJobSuccess,
  MonitoringDashboardActionTypes,
  ResetState,
  UpdateScheduleTime,
  UpdateScheduleTimeFailure,
  UpdateScheduleTimeSuccess
} from './monitoring-dashboard.actions';

describe('Monitoring Dashboard Actions Testing Suite', () => {
  describe('LoadAllScheduledJobs Test Cases', () => {
    const listingPayload: SchedulerJobsListingPayload = {
      pageIndex: 1,
      pageSize: 10
    };

    it('should LoadAllScheduledJobs action ', () => {
      const action = new LoadAllScheduledJobs(listingPayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadAllScheduledJobsSuccess action ', () => {
      const schedulerJobsResults: SchedulerJobsResults[] = [
        {
          active: true,
          businessDate: 123456789,
          code: 'SAVED',
          cronExpression: null,
          description: 'description',
          lastRunTime: null,
          locationCode: 'CPD',
          nextRunTime: null,
          status: 'SAVED'
        }
      ];

      const responsePayload: SchedulerJobsResponse = {
        schedulerJobsResults: schedulerJobsResults,
        schedulerJobsCount: 1
      };

      const action = new LoadAllScheduledJobsSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadAllScheduledJobsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllScheduledJobsFailure(payload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FAILURE,
        payload: payload
      });
    });
  });

  describe('ManuallyRunSchedulerJob Test Cases', () => {
    const payload: ManualRunSchedulerJobRequestPayload = {
      schedulerCode: 'ABCD'
    };

    it('should ManuallyRunSchedulerJob action ', () => {
      const action = new ManuallyRunSchedulerJob(payload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB,
        payload: payload
      });
    });

    it('should check correct type is used for ManuallyRunSchedulerJobSuccess action ', () => {
      const action = new ManuallyRunSchedulerJobSuccess();

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_SUCCESS
      });
    });

    it('should check correct type is used for  ManuallyRunSchedulerJobFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ManuallyRunSchedulerJobFailure(errorPayload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_FAILURE,
        payload: errorPayload
      });
    });
  });

  describe('LoadAllScheduledJobsForUpdate Test Cases', () => {
    const listingPayload: SchedulerJobsListingPayload = {
      pageIndex: 1,
      pageSize: 10
    };

    it('should LoadAllScheduledJobsForUpdate action ', () => {
      const action = new LoadAllScheduledJobsForUpdate(listingPayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE,
        payload: listingPayload
      });
    });

    it('should check correct type is used for LoadAllScheduledJobsForUpdateSuccess action ', () => {
      const schedulerJobsResults: SchedulerJobsResults[] = [
        {
          active: true,
          businessDate: 123456789,
          code: 'SAVED',
          cronExpression: null,
          description: 'description',
          lastRunTime: null,
          locationCode: 'CPD',
          nextRunTime: null,
          status: 'SAVED'
        }
      ];
      const responsePayload: SchedulerJobsResponse = {
        schedulerJobsResults: schedulerJobsResults,
        schedulerJobsCount: 1
      };

      const action = new LoadAllScheduledJobsForUpdateSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadAllScheduledJobsForUpdateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllScheduledJobsForUpdateFailure(payload);
      expect({ ...action }).toEqual({
        type:
          MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_FAILURE,
        payload: payload
      });
    });
  });

  describe('UpdateScheduleTime Test Cases', () => {
    it('should UpdateScheduleTime action ', () => {
      const payload: UpdateScheduleTimeRequestPayload = {
        cronExpression: '',
        isActive: true,
        schedulerCode: 'CODE'
      };

      const action = new UpdateScheduleTime(payload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME,
        payload: payload
      });
    });

    it('should check correct type is used for UpdateScheduleTimeSuccess action ', () => {
      const action = new UpdateScheduleTimeSuccess();

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_SUCCESS
      });
    });

    it('should check correct type is used for  UpdateScheduleTimeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateScheduleTimeFailure(payload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadDataSyncStatusList Test Cases', () => {
    it('should LoadDataSyncStatusList action ', () => {
      const action = new LoadDataSyncStatusList();

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST
      });
    });

    it('should check correct type is used for LoadDataSyncStatusListSuccess action ', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: 'value',
          description: 'description'
        }
      ];

      const action = new LoadDataSyncStatusListSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadDataSyncStatusListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDataSyncStatusListFailure(payload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_FAILURE,
        payload: payload
      });
    });
  });

  describe('LoadCountByMessageType Test Cases', () => {
    const payload: DataSyncCountByMessageTypePayload = {
      date: 123456789,
      location: 'CPD'
    };
    it('should LoadCountByMessageType action ', () => {
      const action = new LoadCountByMessageType(payload);

      expect({ ...action }).toEqual({
        type:
          MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE,
        payload: payload
      });
    });

    it('should check correct type is used for LoadCountByMessageTypeSuccess action ', () => {
      const responsePayload: DataSyncCountByMessageTypeResponse[] = [
        {
          statusCode: 'SAVED',
          statusDecs: 'saved',
          messageCount: 1
        }
      ];

      const action = new LoadCountByMessageTypeSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type:
          MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadCountByMessageTypeFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountByMessageTypeFailure(errorPayload);
      expect({ ...action }).toEqual({
        type:
          MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_FAILURE,
        payload: errorPayload
      });
    });
  });

  describe('LoadDataSyncJobs Test Cases', () => {
    const dataSyncMessagesPayloadData: DataSyncMessagesPayloadData = {
      date: 123456789,
      location: 'CPD',
      statusCode: 'SAVED'
    };
    const payload: DataSyncMessagesRequestPayload = {
      payload: dataSyncMessagesPayloadData,
      queryParams: null
    };

    it('should LoadDataSyncJobs action ', () => {
      const action = new LoadDataSyncJobs(payload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS,
        payload: payload
      });
    });

    it('should check correct type is used for LoadDataSyncJobsSuccess action ', () => {
      const dataSyncMessagesList: DataSyncMessagesList[] = [
        {
          dataflowDirection: 'IN',
          destination: 'CPD',
          exception: null,
          id: '123',
          messageRefId: '1234',
          messageType: 'type',
          operation: 'FLOW',
          source: 'EPOSS',
          status: 'SAVED',
          syncTime: 123
        }
      ];
      const responsePayload: DataSyncMessagesListResponse = {
        messagelist: dataSyncMessagesList,
        count: 1
      };

      const action = new LoadDataSyncJobsSuccess(responsePayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_SUCCESS,
        payload: responsePayload
      });
    });

    it('should check correct type is used for  LoadDataSyncJobsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDataSyncJobsFailure(errorPayload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_FAILURE,
        payload: errorPayload
      });
    });
  });

  describe('ManuallyRunSelectedJob Test Cases', () => {
    const manualRunDataSyncPayload: ManualRunDataSyncPayload = {
      destination: 'EPOSS',
      messageid: '1234'
    };

    it('should ManuallyRunSelectedJob action ', () => {
      const action = new ManuallyRunSelectedJob(manualRunDataSyncPayload);

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB,
        payload: manualRunDataSyncPayload
      });
    });

    it('should check correct type is used for ManuallyRunSelectedJobSuccess action ', () => {
      const action = new ManuallyRunSelectedJobSuccess();

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_SUCCESS
      });
    });

    it('should check correct type is used for  ManuallyRunSelectedJobFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ManuallyRunSelectedJobFailure(payload);
      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_FAILURE,
        payload: payload
      });
    });
  });

  describe('ResetState Test Cases', () => {
    it('should ResetState action ', () => {
      const action = new ResetState();

      expect({ ...action }).toEqual({
        type: MonitoringDashboardActionTypes.RESET
      });
    });
  });
});
