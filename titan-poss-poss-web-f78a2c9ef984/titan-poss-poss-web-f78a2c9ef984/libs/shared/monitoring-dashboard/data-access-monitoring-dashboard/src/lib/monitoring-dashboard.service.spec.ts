import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { MonitoringDashboardService } from './monitoring-dashboard.service';
import {
  getCountByMessageTypeEndpointUrl,
  getDataSyncStatusListEndpointUrl,
  getListOfMessageEndpointUrl,
  getManualRunSchedulerEndpointUrl,
  getScheduledJobsEndpointUrl,
  getUpdateScheduleTimePayload,
  retryTheJobEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_SCHEDULER_RUN_TIME_FORMAT
} from '@poss-web/shared/util-config';
import {
  DataSyncCountByMessageTypePayload,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  SchedulerJobsResponse,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';
import { MonitoringDashboardAdaptor } from '@poss-web/shared/util-adaptors';

describe('MonitoringDashboardService', () => {
  let monitoringDashboardService: MonitoringDashboardService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  const schedulerRunTimeFormat = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MonitoringDashboardService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: POSS_WEB_SCHEDULER_RUN_TIME_FORMAT,
          useValue: schedulerRunTimeFormat
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    monitoringDashboardService = TestBed.inject(MonitoringDashboardService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(monitoringDashboardService).toBeTruthy();
  });

  it('loadAllScheduledJobs - should load all scheduled jobs', () => {
    const response: SchedulerJobsResponse = {
      schedulerJobsResults: [
        {
          active: true,
          businessDate: null,
          code: 'FILE_STN_JOB',
          cronExpression: '0 5 0/2 * * ?',
          description: 'Process Stn files from ERP',
          lastRunTime: '1639413360007',
          locationCode: null,
          nextRunTime: '1639420500000',
          status: 'COMPLETED'
        }
      ],
      schedulerJobsCount: 48
    };
    const schedulerJobsListingPayload: SchedulerJobsListingPayload = {
      pageIndex: 0,
      pageSize: 10
    };
    spyOn(MonitoringDashboardAdaptor, 'getSchedulerJobs').and.returnValue(
      response
    );
    const apiPath = getScheduledJobsEndpointUrl(0, 10);
    monitoringDashboardService
      .loadAllScheduledJobs(schedulerJobsListingPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page')).toEqual('0');
    expect(request.request.params.get('size')).toEqual('10');
    request.flush({});
  });
  it('manuallyRunSchedulerJob - should manually run scheduler jobs', () => {
    const payload: ManualRunSchedulerJobRequestPayload = {
      schedulerCode: 'FILE_STN_JOB'
    };
    const apiPath = getManualRunSchedulerEndpointUrl(payload.schedulerCode);

    monitoringDashboardService.manuallyRunSchedulerJob(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('schedulerCode')).toEqual('FILE_STN_JOB');
    request.flush({});
  });
  it('updateScheduleTime - should update scheduler time', () => {
    const payload: UpdateScheduleTimeRequestPayload = {
      cronExpression: '',
      isActive: true,
      schedulerCode: 'FILE_STN_JOB'
    };
    const apiPath = getUpdateScheduleTimePayload(
      payload.schedulerCode,
      payload.cronExpression,
      payload.isActive
    );

    monitoringDashboardService.updateScheduleTime(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('cronExpression')).toEqual('');
    expect(request.request.params.get('schedulerCode')).toEqual('FILE_STN_JOB');
    request.flush({});
  });
  it('loadDataSyncStatusList - should load datasync status list', () => {
    spyOn(
      MonitoringDashboardAdaptor,
      'getDataSyncStatusListForSelectDropdown'
    ).and.returnValue([
      {
        value: 'One',
        description: 'One'
      }
    ]);
    const apiPath = getDataSyncStatusListEndpointUrl();

    monitoringDashboardService.loadDataSyncStatusList().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('loadCountByMessageType - should load count by message type', () => {
    const requestPayload: DataSyncCountByMessageTypePayload = {
      date: 123456789,
      location: 'CPD'
    };
    const apiPath = getCountByMessageTypeEndpointUrl();

    monitoringDashboardService
      .loadCountByMessageType(requestPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('loadDataSyncJobs - should load data sync jobs', () => {
    spyOn(MonitoringDashboardAdaptor, 'loadDataSyncJobs').and.returnValue({
      messagelist: [
        {
          dataflowDirection: 'OUT',
          destination: 'CPDTES Q',
          exception: null,
          id: 'D04FB2BB-4A2D-4825-8885-3C3680185D66',
          messageRefId: null,
          messageType: 'GENERAL',
          operation: 'DISCOUNT_PUBLISH',
          source: 'EPOSS',
          status: 'SAVED',
          syncTime: 1638429956886
        }
      ],
      count: 1
    });
    const requestPayload: DataSyncMessagesRequestPayload = {
      payload: { date: 1638383400000, location: 'CPD', statusCode: 'SAVED' },
      queryParams: { page: '0', size: '10' }
    };
    const apiPath = getListOfMessageEndpointUrl();

    monitoringDashboardService.loadDataSyncJobs(requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');

    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page')).toBe('0');
    expect(request.request.params.get('size')).toEqual('10');
    request.flush({});
  });
  it('manuallyRunDataSyncJob - should manually run data sync job', () => {
    const payload: ManualRunDataSyncPayload = {
      destination: 'CPD',
      messageid: 'D04FB2BB-4A2D-4825-8885-3C3680185D66'
    };
    const apiPath = retryTheJobEndpointUrl(
      payload.destination,
      payload.messageid
    );

    monitoringDashboardService.manuallyRunDataSyncJob(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
