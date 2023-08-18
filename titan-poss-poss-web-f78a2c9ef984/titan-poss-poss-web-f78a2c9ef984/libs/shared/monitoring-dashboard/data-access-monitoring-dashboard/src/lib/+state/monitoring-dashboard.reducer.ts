import { createFeatureSelector } from '@ngrx/store';
import {
  monitoringDashboardFeatureKey,
  MonitoringDashboardState
} from './monitoring-dashboard.state';
import {
  MonitoringDashboardActionTypes,
  MonitoringDashboardActions
} from './monitoring-dashboard.actions';

export const selectMonitoringDashboardState = createFeatureSelector<
  MonitoringDashboardState
>(monitoringDashboardFeatureKey);

export const initialState: MonitoringDashboardState = {
  errors: null,
  isLoading: false,
  scheduledJobs: null,
  schedulerJobsCount: null,
  manualRunScheduleJobSuccess: null,
  scheduledJobsListForUpdate: null,
  scheduledJobsListForUpdateCount: null,
  updatingScheduleJobSuccess: null,
  dataSyncStatusList: null,
  dataSyncCountByMessageType: null,
  dataSyncJobs: null,
  dataSyncJobsCount: null,
  manualRetryDataSyncJobSuccess: null
};

export function MonitoringDashboardReducer(
  state: MonitoringDashboardState = initialState,
  action: MonitoringDashboardActions
): MonitoringDashboardState {
  switch (action.type) {
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS:
      return {
        ...state,
        isLoading: true,
        errors: null,
        scheduledJobs: null,
        schedulerJobsCount: null
      };
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        scheduledJobs: action.payload.schedulerJobsResults,
        schedulerJobsCount: action.payload.schedulerJobsCount
      };
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        scheduledJobs: null,
        schedulerJobsCount: null
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB:
      return {
        ...state,
        isLoading: true,
        errors: null,
        manualRunScheduleJobSuccess: null
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        manualRunScheduleJobSuccess: true
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        manualRunScheduleJobSuccess: false
      };
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE:
      return {
        ...state,
        isLoading: true,
        errors: null,
        scheduledJobsListForUpdate: null,
        scheduledJobsListForUpdateCount: null
      };
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        scheduledJobsListForUpdate: action.payload.schedulerJobsResults,
        scheduledJobsListForUpdateCount: action.payload.schedulerJobsCount
      };
    case MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        scheduledJobsListForUpdate: null,
        scheduledJobsListForUpdateCount: null
      };
    case MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME:
      return {
        ...state,
        isLoading: true,
        errors: null,
        updatingScheduleJobSuccess: null
      };
    case MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        updatingScheduleJobSuccess: true
      };
    case MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        updatingScheduleJobSuccess: false
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST:
      return {
        ...state,
        isLoading: true,
        errors: null,
        dataSyncStatusList: null
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        dataSyncStatusList: action.payload
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        dataSyncStatusList: null
      };
    case MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE:
      return {
        ...state,
        isLoading: true,
        errors: null,
        dataSyncCountByMessageType: null
      };
    case MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        dataSyncCountByMessageType: action.payload
      };
    case MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        dataSyncCountByMessageType: null
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS:
      return {
        ...state,
        isLoading: true,
        errors: null,
        dataSyncJobs: null,
        dataSyncJobsCount: null
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        dataSyncJobs: action.payload.messagelist,
        dataSyncJobsCount: action.payload.count
      };
    case MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        dataSyncJobs: null,
        dataSyncJobsCount: null
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB:
      return {
        ...state,
        isLoading: true,
        errors: null,
        manualRetryDataSyncJobSuccess: null
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        manualRetryDataSyncJobSuccess: true
      };
    case MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        manualRetryDataSyncJobSuccess: false
      };
    case MonitoringDashboardActionTypes.RESET:
      return {
        ...state,
        scheduledJobs: null,
        schedulerJobsCount: null,
        manualRunScheduleJobSuccess: null,
        scheduledJobsListForUpdate: null,
        scheduledJobsListForUpdateCount: null,
        updatingScheduleJobSuccess: null,
        dataSyncStatusList: null,
        dataSyncCountByMessageType: null,
        dataSyncJobs: null,
        dataSyncJobsCount: null,
        manualRetryDataSyncJobSuccess: null
      };
    default:
      return state;
  }
}
