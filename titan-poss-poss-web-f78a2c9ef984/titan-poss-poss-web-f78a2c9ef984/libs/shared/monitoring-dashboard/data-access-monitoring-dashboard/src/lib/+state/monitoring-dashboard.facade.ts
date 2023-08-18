import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DataSyncCountByMessageTypePayload,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';

import * as MonitoringDashboardActions from './monitoring-dashboard.actions';
import { monitoringDashboardSelectors } from './monitoring-dashboard.selectors';
import { MonitoringDashboardState } from './monitoring-dashboard.state';

@Injectable()
export class MonitoringDashboardFacade {
  constructor(private store: Store<MonitoringDashboardState>) {}
  /*Select from store*/
  private isLoading$ = this.store.select(
    monitoringDashboardSelectors.selectIsLoading
  );
  private error$ = this.store.select(monitoringDashboardSelectors.selectError);
  private scheduledJobs$ = this.store.select(
    monitoringDashboardSelectors.selectScheduledJobs
  );
  private schedulerJobsCount$ = this.store.select(
    monitoringDashboardSelectors.selectSchedulerJobsCount
  );
  private manualRunScheduleJobStatus$ = this.store.select(
    monitoringDashboardSelectors.selectManualRunScheduleJobStatus
  );
  private scheduledJobsListForUpdate$ = this.store.select(
    monitoringDashboardSelectors.selectScheduledJobsListForUpdate
  );
  private scheduledJobsListForUpdateCount$ = this.store.select(
    monitoringDashboardSelectors.selectScheduledJobsListForUpdateCount
  );
  private updateScheduleJobSuccess$ = this.store.select(
    monitoringDashboardSelectors.selectUpdateScheduleJobSuccess
  );
  private dataSyncStatusList$ = this.store.select(
    monitoringDashboardSelectors.selectDataSyncStatusList
  );
  private dataSyncCountByMessageType$ = this.store.select(
    monitoringDashboardSelectors.selectDataSyncCountByMessageType
  );
  private dataSyncJobs$ = this.store.select(
    monitoringDashboardSelectors.selectDataSyncJobs
  );
  private dataSyncJobsCount$ = this.store.select(
    monitoringDashboardSelectors.selectDataSyncJobsCount
  );
  private manualRetryDataSyncJobStatus$ = this.store.select(
    monitoringDashboardSelectors.selectManualRetryDataSyncJobStatus
  );

  /*Dispatching Actions*/
  resetState() {
    this.store.dispatch(new MonitoringDashboardActions.ResetState());
  }
  loadScheduledJobs(listingPayload: SchedulerJobsListingPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.LoadAllScheduledJobs(listingPayload)
    );
  }
  loadScheduledJobsListForUpdate(listingPayload: SchedulerJobsListingPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.LoadAllScheduledJobsForUpdate(
        listingPayload
      )
    );
  }
  updateScheduleTime(payload: UpdateScheduleTimeRequestPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.UpdateScheduleTime(payload)
    );
  }
  loadDataSyncStatusList() {
    this.store.dispatch(
      new MonitoringDashboardActions.LoadDataSyncStatusList()
    );
  }
  loadCountByMessageType(payload: DataSyncCountByMessageTypePayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.LoadCountByMessageType(payload)
    );
  }
  loadDataSyncJobs(listingPayload: DataSyncMessagesRequestPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.LoadDataSyncJobs(listingPayload)
    );
  }
  manuallyRunSelectedJob(payload: ManualRunDataSyncPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.ManuallyRunSelectedJob(payload)
    );
  }
  manuallyRunSchedulerJob(payload: ManualRunSchedulerJobRequestPayload) {
    this.store.dispatch(
      new MonitoringDashboardActions.ManuallyRunSchedulerJob(payload)
    );
  }

  /*Selector Methods */
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getScheduledJobs() {
    return this.scheduledJobs$;
  }
  getSchedulerJobsCount() {
    return this.schedulerJobsCount$;
  }
  getManualRunScheduleJobStatus() {
    return this.manualRunScheduleJobStatus$;
  }
  getScheduledJobsListForUpdate() {
    return this.scheduledJobsListForUpdate$;
  }
  getScheduledJobsListForUpdateCount() {
    return this.scheduledJobsListForUpdateCount$;
  }
  getUpdateScheduleJobSuccess() {
    return this.updateScheduleJobSuccess$;
  }
  getDataSyncStatusList() {
    return this.dataSyncStatusList$;
  }
  getDataSyncCountByMessageType() {
    return this.dataSyncCountByMessageType$;
  }
  getDataSyncJobs() {
    return this.dataSyncJobs$;
  }
  getDataSyncJobsCount() {
    return this.dataSyncJobsCount$;
  }
  getManualRetryDataSyncJobStatus() {
    return this.manualRetryDataSyncJobStatus$;
  }
}
