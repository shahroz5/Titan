import {
  addNewAppVersionEndpointUrl,
  ApiService,
  deleteAppVersionsEndpointUrl,
  getApplicationVersionsEndpointUrl,
  listAllAppVersionsEndpointUrl,
  listAppVersionStatusEndpointUrl,
  listsAppVersionByStatusEndpointUrl,
  publishToBoutiquesEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonitoringDashboardAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AddVersionRequestModel,
  AllAppVersionsList,
  AppVersionByStatusRequestPayloadWithQueryParams,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  SelectDropDownOption
} from '@poss-web/shared/models';

@Injectable()
export class AppVersionDashboardService {
  constructor(private apiService: ApiService) {}

  getAppVersions(): Observable<AppVersionsList> {
    const requestUrl = getApplicationVersionsEndpointUrl();
    return this.apiService
      .get(requestUrl)
      .pipe(map(data => MonitoringDashboardAdaptor.getAppVersions(data)));
  }

  listAllApplicationVersions(): Observable<AllAppVersionsList> {
    const requestUrl = listAllAppVersionsEndpointUrl();
    return this.apiService
      .get(requestUrl)
      .pipe(
        map(data => MonitoringDashboardAdaptor.listAllApplicationVersions(data))
      );
  }

  getAppVersionsByStatus(
    requestPayload: AppVersionByStatusRequestPayloadWithQueryParams
  ): Observable<AppVersionDataByStatusResponse> {
    const requestUrl = listsAppVersionByStatusEndpointUrl();
    return this.apiService
      .post(
        requestUrl,
        requestPayload.appVersionByStatusRequestPayload,
        requestPayload.queryParams
      )
      .pipe(
        map(data => MonitoringDashboardAdaptor.getAppVersionsByStatus(data))
      );
  }

  getStatusList(): Observable<SelectDropDownOption[]> {
    const requestUrl = listAppVersionStatusEndpointUrl();
    return this.apiService
      .get(requestUrl)
      .pipe(map(data => MonitoringDashboardAdaptor.getStatusList(data)));
  }

  addApplicationVersion(requestPayload: AddVersionRequestModel) {
    const requestUrl = addNewAppVersionEndpointUrl();
    return this.apiService.post(requestUrl, requestPayload);
  }

  publishAllAppVersions() {
    const requestUrl = publishToBoutiquesEndpointUrl();
    return this.apiService.post(requestUrl);
  }

  deleteAppVersionById(appVersionId: number) {
    const requestUrl = deleteAppVersionsEndpointUrl(appVersionId);
    return this.apiService.delete(requestUrl);
  }
}
