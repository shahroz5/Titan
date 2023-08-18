import { Action } from '@ngrx/store';
import {
  CustomErrors,
  DataSyncCountByMessageTypePayload,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesListResponse,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  SchedulerJobsResponse,
  SelectDropDownOption,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';

export enum MonitoringDashboardActionTypes {
  LOAD_SCHEDULED_JOBS = '[Monitoring Dashboard] Load All Scheduled Jobs',
  LOAD_SCHEDULED_JOBS_SUCCESS = '[Monitoring Dashboard] Load All Scheduled Jobs Success',
  LOAD_SCHEDULED_JOBS_FAILURE = '[Monitoring Dashboard] Load All Scheduled Jobs Failure',

  MANUAL_RUN_SCHEDULE_JOB = '[Monitoring Dashboard] Manual Run Schedule Job',
  MANUAL_RUN_SCHEDULE_JOB_SUCCESS = '[Monitoring Dashboard] Manual Run Schedule Job Success',
  MANUAL_RUN_SCHEDULE_JOB_FAILURE = '[Monitoring Dashboard] Manual Run Schedule Job Failure',

  LOAD_SCHEDULED_JOBS_FOR_UPDATE = '[Monitoring Dashboard] Load All Scheduled Jobs For Update',
  LOAD_SCHEDULED_JOBS_FOR_UPDATE_SUCCESS = '[Monitoring Dashboard] Load All Scheduled Jobs For Update Success',
  LOAD_SCHEDULED_JOBS_FOR_UPDATE_FAILURE = '[Monitoring Dashboard] Load All Scheduled Jobs For Update Failure',

  UPDATE_SCHEDULE_TIME = '[Monitoring Dashboard] Update the Schedule Time',
  UPDATE_SCHEDULE_TIME_SUCCESS = '[Monitoring Dashboard] Update the Schedule Time Success',
  UPDATE_SCHEDULE_TIME_FAILURE = '[Monitoring Dashboard] Update the Schedule Time Failure',

  LOAD_DATA_SYNC_STATUS_LIST = '[Monitoring Dashboard] Load DataSync Status List',
  LOAD_DATA_SYNC_STATUS_LIST_SUCCESS = '[Monitoring Dashboard] Load DataSync Status List Success',
  LOAD_DATA_SYNC_STATUS_LIST_FAILURE = '[Monitoring Dashboard] Load DataSync Status List Failure',

  LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE = '[Monitoring Dashboard] Load DataSync Count by Message type',
  LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_SUCCESS = '[Monitoring Dashboard] Load DataSync Count by Message type Success',
  LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_FAILURE = '[Monitoring Dashboard] Load DataSync Count by Message type Failure',

  LOAD_DATA_SYNC_JOBS = '[Monitoring Dashboard] Load DataSync Jobs',
  LOAD_DATA_SYNC_JOBS_SUCCESS = '[Monitoring Dashboard] Load DataSync Jobs Success',
  LOAD_DATA_SYNC_JOBS_FAILURE = '[Monitoring Dashboard] Load DataSync Jobs Failure',

  MANUAL_RUN_DATASYNC_JOB = '[Monitoring Dashboard] Manual Run Data Sync Job',
  MANUAL_RUN_DATASYNC_JOB_SUCCESS = '[Monitoring Dashboard] Manual Run Data Sync Job Success',
  MANUAL_RUN_DATASYNC_JOB_FAILURE = '[Monitoring Dashboard] Manual Run Data Sync Job Failure',

  RESET = '[Monitoring Dashboard] Reset State'
}

export class LoadAllScheduledJobs implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS;
  constructor(readonly payload: SchedulerJobsListingPayload) {}
}
export class LoadAllScheduledJobsSuccess implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_SUCCESS;
  constructor(readonly payload: SchedulerJobsResponse) {}
}
export class LoadAllScheduledJobsFailure implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ManuallyRunSchedulerJob implements Action {
  readonly type = MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB;
  constructor(readonly payload: ManualRunSchedulerJobRequestPayload) {}
}
export class ManuallyRunSchedulerJobSuccess implements Action {
  readonly type =
    MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_SUCCESS;
}
export class ManuallyRunSchedulerJobFailure implements Action {
  readonly type =
    MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadAllScheduledJobsForUpdate implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE;
  constructor(readonly payload: SchedulerJobsListingPayload) {}
}
export class LoadAllScheduledJobsForUpdateSuccess implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_SUCCESS;
  constructor(readonly payload: SchedulerJobsResponse) {}
}
export class LoadAllScheduledJobsForUpdateFailure implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class UpdateScheduleTime implements Action {
  readonly type = MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME;
  constructor(readonly payload: UpdateScheduleTimeRequestPayload) {}
}
export class UpdateScheduleTimeSuccess implements Action {
  readonly type = MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_SUCCESS;
}
export class UpdateScheduleTimeFailure implements Action {
  readonly type = MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadDataSyncStatusList implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST;
}
export class LoadDataSyncStatusListSuccess implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_SUCCESS;
  constructor(readonly payload: SelectDropDownOption[]) {}
}
export class LoadDataSyncStatusListFailure implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadCountByMessageType implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE;
  constructor(readonly payload: DataSyncCountByMessageTypePayload) {}
}
export class LoadCountByMessageTypeSuccess implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_SUCCESS;
  constructor(readonly payload: DataSyncCountByMessageTypeResponse[]) {}
}
export class LoadCountByMessageTypeFailure implements Action {
  readonly type =
    MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadDataSyncJobs implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS;
  constructor(readonly payload: DataSyncMessagesRequestPayload) {}
}
export class LoadDataSyncJobsSuccess implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_SUCCESS;
  constructor(readonly payload: DataSyncMessagesListResponse) {}
}
export class LoadDataSyncJobsFailure implements Action {
  readonly type = MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ManuallyRunSelectedJob implements Action {
  readonly type = MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB;
  constructor(readonly payload: ManualRunDataSyncPayload) {}
}
export class ManuallyRunSelectedJobSuccess implements Action {
  readonly type =
    MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_SUCCESS;
}
export class ManuallyRunSelectedJobFailure implements Action {
  readonly type =
    MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetState implements Action {
  readonly type = MonitoringDashboardActionTypes.RESET;
}

export type MonitoringDashboardActions =
  | LoadAllScheduledJobs
  | LoadAllScheduledJobsSuccess
  | LoadAllScheduledJobsFailure
  | ManuallyRunSchedulerJob
  | ManuallyRunSchedulerJobSuccess
  | ManuallyRunSchedulerJobFailure
  | LoadAllScheduledJobsForUpdate
  | LoadAllScheduledJobsForUpdateSuccess
  | LoadAllScheduledJobsForUpdateFailure
  | LoadDataSyncStatusList
  | LoadDataSyncStatusListSuccess
  | LoadDataSyncStatusListFailure
  | LoadCountByMessageType
  | LoadCountByMessageTypeSuccess
  | LoadCountByMessageTypeFailure
  | UpdateScheduleTime
  | UpdateScheduleTimeSuccess
  | UpdateScheduleTimeFailure
  | LoadDataSyncJobs
  | LoadDataSyncJobsSuccess
  | LoadDataSyncJobsFailure
  | ManuallyRunSelectedJob
  | ManuallyRunSelectedJobSuccess
  | ManuallyRunSelectedJobFailure
  | ResetState;
