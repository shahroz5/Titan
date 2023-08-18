import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { MonitoringDashboardState } from './monitoring-dashboard.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MonitoringDashboardActionTypes } from './monitoring-dashboard.actions';
import * as MonitoringDashboardActions from './monitoring-dashboard.actions';
import { MonitoringDashboardService } from '../monitoring-dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesListResponse,
  SchedulerJobsResponse,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class MonitoringDashboardEffects {
  constructor(
    private dataPersistence: DataPersistence<MonitoringDashboardState>,
    private monitoringDashboardService: MonitoringDashboardService,
    private loggerService: LoggerService
  ) {}

  @Effect() loadAllScheduledJobs$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS,
    {
      run: (action: MonitoringDashboardActions.LoadAllScheduledJobs) => {
        return this.monitoringDashboardService
          .loadAllScheduledJobs(action.payload)
          .pipe(
            map(
              (data: SchedulerJobsResponse) =>
                new MonitoringDashboardActions.LoadAllScheduledJobsSuccess(data)
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.LoadAllScheduledJobs,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.LoadAllScheduledJobsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() manuallyRunSchedulerJob$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.MANUAL_RUN_SCHEDULE_JOB,
    {
      run: (action: MonitoringDashboardActions.ManuallyRunSchedulerJob) => {
        return this.monitoringDashboardService
          .manuallyRunSchedulerJob(action.payload)
          .pipe(
            map(
              (data: any) =>
                new MonitoringDashboardActions.ManuallyRunSchedulerJobSuccess()
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.ManuallyRunSchedulerJob,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.ManuallyRunSchedulerJobFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadAllScheduledJobsForUpdate$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.LOAD_SCHEDULED_JOBS_FOR_UPDATE,
    {
      run: (
        action: MonitoringDashboardActions.LoadAllScheduledJobsForUpdate
      ) => {
        return this.monitoringDashboardService
          .loadAllScheduledJobs(action.payload)
          .pipe(
            map(
              (data: SchedulerJobsResponse) =>
                new MonitoringDashboardActions.LoadAllScheduledJobsForUpdateSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.LoadAllScheduledJobsForUpdate,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.LoadAllScheduledJobsForUpdateFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateScheduleTime$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.UPDATE_SCHEDULE_TIME,
    {
      run: (action: MonitoringDashboardActions.UpdateScheduleTime) => {
        return this.monitoringDashboardService
          .updateScheduleTime(action.payload)
          .pipe(
            map(
              (data: any) =>
                new MonitoringDashboardActions.UpdateScheduleTimeSuccess()
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.UpdateScheduleTime,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.UpdateScheduleTimeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadDataSyncStatusList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.LOAD_DATA_SYNC_STATUS_LIST,
    {
      run: (action: MonitoringDashboardActions.LoadDataSyncStatusList) => {
        return this.monitoringDashboardService
          .loadDataSyncStatusList()
          .pipe(
            map(
              (data: SelectDropDownOption[]) =>
                new MonitoringDashboardActions.LoadDataSyncStatusListSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.LoadDataSyncStatusList,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.LoadDataSyncStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadCountByMessageType$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.LOAD_DATASYNC_COUNT_BY_MESSAGE_TYPE,
    {
      run: (action: MonitoringDashboardActions.LoadCountByMessageType) => {
        return this.monitoringDashboardService
          .loadCountByMessageType(action.payload)
          .pipe(
            map(
              (data: DataSyncCountByMessageTypeResponse[]) =>
                new MonitoringDashboardActions.LoadCountByMessageTypeSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.LoadCountByMessageType,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.LoadCountByMessageTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadDataSyncJobs$: Observable<Action> = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.LOAD_DATA_SYNC_JOBS,
    {
      run: (action: MonitoringDashboardActions.LoadDataSyncJobs) => {
        return this.monitoringDashboardService
          .loadDataSyncJobs(action.payload)
          .pipe(
            map(
              (data: DataSyncMessagesListResponse) =>
                new MonitoringDashboardActions.LoadDataSyncJobsSuccess(data)
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.LoadDataSyncJobs,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.LoadDataSyncJobsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() manuallyRunSelectedJob$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MonitoringDashboardActionTypes.MANUAL_RUN_DATASYNC_JOB,
    {
      run: (action: MonitoringDashboardActions.ManuallyRunSelectedJob) => {
        return this.monitoringDashboardService
          .manuallyRunDataSyncJob(action.payload)
          .pipe(
            map(
              (data: any) =>
                new MonitoringDashboardActions.ManuallyRunSelectedJobSuccess()
            )
          );
      },
      onError: (
        action: MonitoringDashboardActions.ManuallyRunSelectedJob,
        error: HttpErrorResponse
      ) => {
        return new MonitoringDashboardActions.ManuallyRunSelectedJobFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
