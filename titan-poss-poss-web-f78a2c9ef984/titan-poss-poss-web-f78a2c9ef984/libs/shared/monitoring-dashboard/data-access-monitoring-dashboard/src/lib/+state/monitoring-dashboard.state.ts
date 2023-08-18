import {
  CustomErrors,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesList,
  SchedulerJobsResults,
  SelectDropDownOption
} from '@poss-web/shared/models';

export const monitoringDashboardFeatureKey = 'monitoringDashboard';

export class MonitoringDashboardState {
  errors?: CustomErrors;
  isLoading: boolean;
  scheduledJobs: SchedulerJobsResults[];
  schedulerJobsCount: number;
  manualRunScheduleJobSuccess: boolean;
  scheduledJobsListForUpdate: SchedulerJobsResults[];
  scheduledJobsListForUpdateCount: number;
  updatingScheduleJobSuccess: boolean;
  dataSyncStatusList: SelectDropDownOption[];
  dataSyncCountByMessageType: DataSyncCountByMessageTypeResponse[];
  dataSyncJobs: DataSyncMessagesList[];
  dataSyncJobsCount: number;
  manualRetryDataSyncJobSuccess: boolean;
}
