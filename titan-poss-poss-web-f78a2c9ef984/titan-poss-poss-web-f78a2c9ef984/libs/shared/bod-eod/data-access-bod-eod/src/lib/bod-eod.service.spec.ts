import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApiService,
  getAvailableMetalRatesEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getLatestBodEndpointUrl,
  getOpenBusinessDayUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { BodEodService } from './bod-eod.service';

describe('Shared Bod/Eod data Service testing Suite', () => {
  let bodEodService: BodEodService;
  let mockApiService: ApiService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BodEodService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bodEodService = TestBed.inject(BodEodService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(bodEodService).toBeTruthy();
  });

  it('getOpenBusinessDate - should get Open Business Date', () => {
    const apiPath = getOpenBusinessDayUrl();
    bodEodService.getOpenBusinessDate().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getEodBusinessDate - should get EOD Business Date', () => {
    const apiPath = getEodBusinessDayEndpointUrl();
    bodEodService.getEodBusinessDate().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getLatestBusinessDay - should get Latest Business Date', () => {
    const apiPath = getLatestBodEndpointUrl();
    bodEodService.getLatestBusinessDay().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getMetalRatesAndGoldRateAvailabityForBusinessDay - should get Metal Rates For Business Date', () => {
    const apiPath = getAvailableMetalRatesEndpointUrl();

    bodEodService
      .getMetalRatesAndGoldRateAvailabityForBusinessDay(123456789)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
