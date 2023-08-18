import { Inject, Injectable } from '@angular/core';
import {
  ApiService,
  getCountByMessageTypeEndpointUrl,
  getDataSyncStatusListEndpointUrl,
  getListOfMessageEndpointUrl,
  getManualRunSchedulerEndpointUrl,
  getScheduledJobsEndpointUrl,
  getUpdateScheduleTimePayload,
  retryTheJobEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonitoringDashboardAdaptor } from '@poss-web/shared/util-adaptors';
import {
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
import { POSS_WEB_SCHEDULER_RUN_TIME_FORMAT } from '@poss-web/shared/util-config';

@Injectable({
  providedIn: 'root'
})
export class MonitoringDashboardService {
  constructor(
    private apiService: ApiService,
    @Inject(POSS_WEB_SCHEDULER_RUN_TIME_FORMAT) private schedulerTimeFormat
  ) {}

  loadAllScheduledJobs(
    schedulerJobsListingPayload: SchedulerJobsListingPayload
  ): Observable<SchedulerJobsResponse> {
    const url = getScheduledJobsEndpointUrl(
      schedulerJobsListingPayload.pageIndex,
      schedulerJobsListingPayload.pageSize
    );
    const requestPayload = {};

    return this.apiService
      .post(url.path, requestPayload, url.params)
      .pipe(
        map(data =>
          MonitoringDashboardAdaptor.getSchedulerJobs(
            data,
            this.schedulerTimeFormat
          )
        )
      );
  }

  manuallyRunSchedulerJob(payload: ManualRunSchedulerJobRequestPayload) {
    const url = getManualRunSchedulerEndpointUrl(payload.schedulerCode);
    const requestPayload = {};
    return this.apiService.post(url.path, requestPayload, url.params);
  }

  updateScheduleTime(payload: UpdateScheduleTimeRequestPayload) {
    const url = getUpdateScheduleTimePayload(
      payload.schedulerCode,
      payload.cronExpression,
      payload.isActive
    );
    const requestPayload = {};
    return this.apiService.patch(url.path, requestPayload, url.params);
  }

  loadDataSyncStatusList(): Observable<SelectDropDownOption[]> {
    const url = getDataSyncStatusListEndpointUrl();
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          MonitoringDashboardAdaptor.getDataSyncStatusListForSelectDropdown(
            data
          )
        )
      );
  }

  loadCountByMessageType(
    requestPayload: DataSyncCountByMessageTypePayload
  ): Observable<DataSyncCountByMessageTypeResponse[]> {
    const url = getCountByMessageTypeEndpointUrl();
    return this.apiService.post(url, requestPayload);
  }

  loadDataSyncJobs(
    requestPayload: DataSyncMessagesRequestPayload
  ): Observable<DataSyncMessagesListResponse> {
    const url = getListOfMessageEndpointUrl();
    return this.apiService
      .post(url, requestPayload.payload, requestPayload.queryParams)
      .pipe(map(data => MonitoringDashboardAdaptor.loadDataSyncJobs(data)));
  }

  manuallyRunDataSyncJob(payload: ManualRunDataSyncPayload) {
    const url = retryTheJobEndpointUrl(payload.destination, payload.messageid);
    return this.apiService.put(url);
  }
}
