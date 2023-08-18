import {
  POSS_WEB_API_URL,
  POSS_WEB_DATE_FORMAT
} from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WalkInsRecordService } from './walk-ins-record.service';
import {
  getWalkInDetailsCustomerVisitsCountEndpointUrl,
  saveWalkInDetailsEndpointUrl,
  walkInsHistoryDataApiUrl
} from '@poss-web/shared/util-api-service';
import {
  SaveWalkInDetailsRequestPayload,
  WalkInsCountRequestPayload
} from '@poss-web/shared/models';

describe('WalkInsRecordService', () => {
  let httpTestingController: HttpTestingController;
  let walkInsRecordService: WalkInsRecordService;
  const apiUrl = 'http://localhost:3000';
  const dateFormat = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WalkInsRecordService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: POSS_WEB_DATE_FORMAT,
          useValue: dateFormat
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    walkInsRecordService = TestBed.inject(WalkInsRecordService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(walkInsRecordService).toBeTruthy();
  });

  it('saveWalkInsDetails - should save walk in details', () => {
    const mockRequestPayload: SaveWalkInDetailsRequestPayload = {
      businessDate: 123456789,

      noOfInvoice: 2,
      nonPurchaserCount: 2,
      purchaserCount: 3,
      walkins: 5
    };
    const apiPath = saveWalkInDetailsEndpointUrl();
    walkInsRecordService.saveWalkInsDetails(mockRequestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('loadWalkInsHistoryData - should load Walk-in History Data', () => {
    const apiPath = walkInsHistoryDataApiUrl();
    walkInsRecordService.loadWalkInsHistoryData().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getWalkInsCustomerVisitDetails - should load Walk-in Customer Visits Details', () => {
    const payload: WalkInsCountRequestPayload = {
      businessDate: 123456789
    };
    const apiPath = getWalkInDetailsCustomerVisitsCountEndpointUrl();
    walkInsRecordService.getWalkInsCustomerVisitDetails(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
