import { createSelector } from '@ngrx/store';
import { selectMonitoringDashboardState } from './monitoring-dashboard.reducer';

const selectIsLoading = createSelector(
  selectMonitoringDashboardState,
  state => state.isLoading
);
const selectError = createSelector(
  selectMonitoringDashboardState,
  state => state.errors
);
const selectScheduledJobs = createSelector(
  selectMonitoringDashboardState,
  state => state.scheduledJobs
);
const selectSchedulerJobsCount = createSelector(
  selectMonitoringDashboardState,
  state => state.schedulerJobsCount
);
const selectManualRunScheduleJobStatus = createSelector(
  selectMonitoringDashboardState,
  state => state.manualRunScheduleJobSuccess
);
const selectScheduledJobsListForUpdate = createSelector(
  selectMonitoringDashboardState,
  state => state.scheduledJobsListForUpdate
);
const selectScheduledJobsListForUpdateCount = createSelector(
  selectMonitoringDashboardState,
  state => state.scheduledJobsListForUpdateCount
);
const selectUpdateScheduleJobSuccess = createSelector(
  selectMonitoringDashboardState,
  state => state.updatingScheduleJobSuccess
);
const selectDataSyncStatusList = createSelector(
  selectMonitoringDashboardState,
  state => state.dataSyncStatusList
);
const selectDataSyncCountByMessageType = createSelector(
  selectMonitoringDashboardState,
  state => state.dataSyncCountByMessageType
);
const selectDataSyncJobs = createSelector(
  selectMonitoringDashboardState,
  state => state.dataSyncJobs
);
const selectDataSyncJobsCount = createSelector(
  selectMonitoringDashboardState,
  state => state.dataSyncJobsCount
);
const selectManualRetryDataSyncJobStatus = createSelector(
  selectMonitoringDashboardState,
  state => state.manualRetryDataSyncJobSuccess
);

export const monitoringDashboardSelectors = {
  selectIsLoading,
  selectError,
  selectScheduledJobs,
  selectSchedulerJobsCount,
  selectManualRunScheduleJobStatus,
  selectScheduledJobsListForUpdate,
  selectScheduledJobsListForUpdateCount,
  selectUpdateScheduleJobSuccess,
  selectDataSyncStatusList,
  selectDataSyncCountByMessageType,
  selectDataSyncJobs,
  selectDataSyncJobsCount,
  selectManualRetryDataSyncJobStatus
};
