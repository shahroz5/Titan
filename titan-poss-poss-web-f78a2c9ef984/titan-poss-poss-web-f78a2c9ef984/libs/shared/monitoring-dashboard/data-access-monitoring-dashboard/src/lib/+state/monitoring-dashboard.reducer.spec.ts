import * as actions from './monitoring-dashboard.actions';
import { MonitoringDashboardState } from './monitoring-dashboard.state';
import {
  initialState,
  MonitoringDashboardReducer
} from './monitoring-dashboard.reducer';
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

describe('Monitoring Dashboard Reducer Testing Suite', () => {
  describe('Testing LoadAllScheduledJobs Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SCHEDULED_JOBS', () => {
      const listingPayload: SchedulerJobsListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadAllScheduledJobs(listingPayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.scheduledJobs).toBe(null);
      expect(result.schedulerJobsCount).toBe(null);
    });

    it('Testing LOAD_SCHEDULED_JOBS_SUCCESS', () => {
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

      const action = new actions.LoadAllScheduledJobsSuccess(responsePayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.scheduledJobs).toBe(action.payload.schedulerJobsResults);
      expect(result.schedulerJobsCount).toBe(action.payload.schedulerJobsCount);
    });

    it('Testing LOAD_SCHEDULED_JOBS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAllScheduledJobsFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.scheduledJobs).toBe(null);
      expect(result.schedulerJobsCount).toBe(null);
    });
  });

  describe('Testing ManuallyRunSchedulerJob Functionality', () => {
    beforeEach(() => {});

    it('Testing MANUAL_RUN_SCHEDULE_JOB', () => {
      const payload: ManualRunSchedulerJobRequestPayload = {
        schedulerCode: 'ABCD'
      };
      const action = new actions.ManuallyRunSchedulerJob(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.manualRunScheduleJobSuccess).toBe(null);
    });

    it('Testing MANUAL_RUN_SCHEDULE_JOB_SUCCESS', () => {
      const action = new actions.ManuallyRunSchedulerJobSuccess();
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.manualRunScheduleJobSuccess).toBe(true);
    });

    it('Testing MANUAL_RUN_SCHEDULE_JOB_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ManuallyRunSchedulerJobFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.manualRunScheduleJobSuccess).toBe(false);
    });
  });

  describe('Testing LoadAllScheduledJobsForUpdate Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SCHEDULED_JOBS_FOR_UPDATE', () => {
      const listingPayload: SchedulerJobsListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const action = new actions.LoadAllScheduledJobsForUpdate(listingPayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.scheduledJobsListForUpdate).toBe(null);
      expect(result.scheduledJobsListForUpdateCount).toBe(null);
    });

    it('Testing LOAD_SCHEDULED_JOBS_FOR_UPDATE_SUCCESS', () => {
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

      const action = new actions.LoadAllScheduledJobsForUpdateSuccess(
        responsePayload
      );
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.scheduledJobsListForUpdate).toBe(
        action.payload.schedulerJobsResults
      );
      expect(result.scheduledJobsListForUpdateCount).toBe(
        action.payload.schedulerJobsCount
      );
    });

    it('Testing LOAD_SCHEDULED_JOBS_FOR_UPDATE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAllScheduledJobsForUpdateFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.scheduledJobsListForUpdate).toBe(null);
      expect(result.scheduledJobsListForUpdateCount).toBe(null);
    });
  });

  describe('Testing UpdateScheduleTime Functionality', () => {
    beforeEach(() => {});

    it('Testing UPDATE_SCHEDULE_TIME', () => {
      const payload: UpdateScheduleTimeRequestPayload = {
        cronExpression: '',
        isActive: true,
        schedulerCode: 'CODE'
      };
      const action = new actions.UpdateScheduleTime(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.updatingScheduleJobSuccess).toBe(null);
    });

    it('Testing UPDATE_SCHEDULE_TIME_SUCCESS', () => {
      const action = new actions.UpdateScheduleTimeSuccess();
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.updatingScheduleJobSuccess).toBe(true);
    });

    it('Testing UPDATE_SCHEDULE_TIME_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateScheduleTimeFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.updatingScheduleJobSuccess).toBe(false);
    });
  });

  describe('Testing LoadDataSyncStatusList Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_DATA_SYNC_STATUS_LIST', () => {
      const action = new actions.LoadDataSyncStatusList();
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.dataSyncStatusList).toBe(null);
    });

    it('Testing LOAD_DATA_SYNC_STATUS_LIST_SUCCESS', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: 'value',
          description: 'description'
        }
      ];

      const action = new actions.LoadDataSyncStatusListSuccess(responsePayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.dataSyncStatusList).toBe(action.payload);
    });

    it('Testing LOAD_DATA_SYNC_STATUS_LIST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadDataSyncStatusListFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.dataSyncStatusList).toBe(null);
    });
  });

  describe('Testing LoadCountByMessageType Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE', () => {
      const payload: DataSyncCountByMessageTypePayload = {
        date: 123456789,
        location: 'CPD'
      };
      const action = new actions.LoadCountByMessageType(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.dataSyncCountByMessageType).toBe(null);
    });

    it('Testing LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_SUCCESS', () => {
      const responsePayload: DataSyncCountByMessageTypeResponse[] = [
        {
          statusCode: 'SAVED',
          statusDecs: 'saved',
          messageCount: 1
        }
      ];

      const action = new actions.LoadCountByMessageTypeSuccess(responsePayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.dataSyncCountByMessageType).toBe(action.payload);
    });

    it('Testing LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCountByMessageTypeFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.dataSyncCountByMessageType).toBe(null);
    });
  });

  describe('Testing LoadDataSyncJobs Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_DATA_SYNC_JOBS', () => {
      const dataSyncMessagesPayloadData: DataSyncMessagesPayloadData = {
        date: 123456789,
        location: 'CPD',
        statusCode: 'SAVED'
      };
      const payload: DataSyncMessagesRequestPayload = {
        payload: dataSyncMessagesPayloadData,
        queryParams: null
      };
      const action = new actions.LoadDataSyncJobs(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.dataSyncJobs).toBe(null);
      expect(result.dataSyncJobsCount).toBe(null);
    });

    it('Testing LOAD_DATA_SYNC_JOBS_SUCCESS', () => {
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

      const action = new actions.LoadDataSyncJobsSuccess(responsePayload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.dataSyncJobs).toBe(action.payload.messagelist);
      expect(result.dataSyncJobsCount).toBe(action.payload.count);
    });

    it('Testing LOAD_DATA_SYNC_JOBS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadDataSyncJobsFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.dataSyncJobs).toBe(null);
      expect(result.dataSyncJobsCount).toBe(null);
    });
  });

  describe('Testing ManuallyRunSelectedJob Functionality', () => {
    beforeEach(() => {});

    it('Testing MANUAL_RUN_DATASYNC_JOB', () => {
      const manualRunDataSyncPayload: ManualRunDataSyncPayload = {
        destination: 'EPOSS',
        messageid: '1234'
      };
      const action = new actions.ManuallyRunSelectedJob(
        manualRunDataSyncPayload
      );
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.manualRetryDataSyncJobSuccess).toBe(null);
    });

    it('Testing MANUAL_RUN_DATASYNC_JOB_SUCCESS', () => {
      const action = new actions.ManuallyRunSelectedJobSuccess();
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
      expect(result.manualRetryDataSyncJobSuccess).toBe(true);
    });

    it('Testing MANUAL_RUN_DATASYNC_JOB_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ManuallyRunSelectedJobFailure(payload);
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(action.payload);
      expect(result.manualRetryDataSyncJobSuccess).toBe(false);
    });
  });

  describe('Testing ResetState Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET', () => {
      const action = new actions.ResetState();
      const result: MonitoringDashboardState = MonitoringDashboardReducer(
        initialState,
        action
      );
      expect(result.scheduledJobs).toBe(null);
      expect(result.schedulerJobsCount).toBe(null);
      expect(result.manualRunScheduleJobSuccess).toBe(null);
      expect(result.scheduledJobsListForUpdate).toBe(null);
      expect(result.scheduledJobsListForUpdateCount).toBe(null);
      expect(result.updatingScheduleJobSuccess).toBe(null);
      expect(result.dataSyncStatusList).toBe(null);
      expect(result.dataSyncCountByMessageType).toBe(null);
      expect(result.dataSyncJobs).toBe(null);
      expect(result.dataSyncJobsCount).toBe(null);
      expect(result.manualRetryDataSyncJobSuccess).toBe(null);
    });
  });
});
