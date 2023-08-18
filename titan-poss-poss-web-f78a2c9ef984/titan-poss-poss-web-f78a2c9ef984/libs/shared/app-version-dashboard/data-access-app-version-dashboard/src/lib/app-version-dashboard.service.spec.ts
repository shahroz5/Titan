import { TestBed } from '@angular/core/testing';

import { AppVersionDashboardService } from './app-version-dashboard.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  addNewAppVersionEndpointUrl,
  deleteAppVersionsEndpointUrl,
  getApplicationVersionsEndpointUrl,
  listAllAppVersionsEndpointUrl,
  listAppVersionStatusEndpointUrl,
  listsAppVersionByStatusEndpointUrl,
  publishToBoutiquesEndpointUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { AddVersionRequestModel } from '@poss-web/shared/models';

describe('App Version Dashboard Data Service Testing Suite', () => {
  let appVersionDashboardService: AppVersionDashboardService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppVersionDashboardService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    appVersionDashboardService = TestBed.inject(AppVersionDashboardService);
  });

  it('should be created', () => {
    expect(appVersionDashboardService).toBeTruthy();
  });

  it('getAppVersions - should get Application versions', () => {
    const apiPath = getApplicationVersionsEndpointUrl();

    appVersionDashboardService.getAppVersions().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('listAllApplicationVersions - should list all app versions', () => {
    const apiPath = listAllAppVersionsEndpointUrl();

    appVersionDashboardService.listAllApplicationVersions().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getAppVersionsByStatus - should get App versions by status', () => {
    const apiPath = listsAppVersionByStatusEndpointUrl();
    const requestPayload = {
      appVersionByStatusRequestPayload: {
        status: 'ACTIVE',
        location: 'CPD',
        databaseVersion: '1.0.0',
        epossUiVersion: '1.0.0',
        possServiceVersion: '1.0.0',
        possUiVersion: '1.0.0'
      },
      queryParams: ''
    };

    appVersionDashboardService
      .getAppVersionsByStatus(requestPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getStatusList - should get status list', () => {
    const apiPath = listAppVersionStatusEndpointUrl();

    appVersionDashboardService.getStatusList().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('addApplicationVersion - should add application version', () => {
    const requestPayload: AddVersionRequestModel = {
      databaseVersion: '1.0.0',
      downloadUrl: '',
      locationCode: ['CPD'],
      possServiceVersion: '1.0.0',
      possUiVersion: '1.0.0'
    };
    const apiPath = addNewAppVersionEndpointUrl();

    appVersionDashboardService
      .addApplicationVersion(requestPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('publishAllAppVersions - should publish all app version', () => {
    const apiPath = publishToBoutiquesEndpointUrl();

    appVersionDashboardService.publishAllAppVersions().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('deleteAppVersionById - should delete app version by ID', () => {
    const apiPath = deleteAppVersionsEndpointUrl(1);

    appVersionDashboardService.deleteAppVersionById(1).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
