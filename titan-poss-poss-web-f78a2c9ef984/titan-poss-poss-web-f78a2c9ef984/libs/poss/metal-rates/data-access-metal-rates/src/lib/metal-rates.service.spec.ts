import { TestBed } from '@angular/core/testing';

import { MetalRatesService } from './metal-rates.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  getAvailableMetalRatesEndpointUrl,
  getBodBusinessDayEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getLocationMetalRatesEndpointUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { MetalRateUpdateRequestPayload } from '@poss-web/shared/models';

describe('Metal Rates Update Data Service Testing Suite', () => {
  let metalRatesService: MetalRatesService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MetalRatesService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    metalRatesService = TestBed.inject(MetalRatesService);
  });

  it('should be created', () => {
    expect(metalRatesService).toBeTruthy();
  });

  it('getBodBusinessDay - should get BOD Business Date', () => {
    const apiPath = getBodBusinessDayEndpointUrl();

    metalRatesService.getBodBusinessDay().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getEodBusinessDay - should get EOD Business Date', () => {
    const apiPath = getEodBusinessDayEndpointUrl();

    metalRatesService.getEodBusinessDay().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getGoldRateAvailabilityStatus - should get Gold Rate Availability Status', () => {
    const apiPath = getAvailableMetalRatesEndpointUrl();

    metalRatesService.getGoldRateAvailabilityStatus(123456789).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getAvailableMetalRatesForBusinessDay - should Available Metal Rates For Business Date', () => {
    const apiPath = getAvailableMetalRatesEndpointUrl();

    metalRatesService
      .getAvailableMetalRatesForBusinessDay(123456789)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('saveMetalRates - should get Save Metal Rates', () => {
    const payload: MetalRateUpdateRequestPayload = {
      applicableDate: '123456789',
      metalRates: {
        additionalProp1: {
          metalTypeCode: 'J',
          ratePerUnit: 5000
        },
        additionalProp2: {
          metalTypeCode: 'L',
          ratePerUnit: 4500
        },
        additionalProp3: {
          metalTypeCode: 'P',
          ratePerUnit: 899
        }
      },
      password: 'password'
    };
    const apiPath = getLocationMetalRatesEndpointUrl();

    metalRatesService.saveMetalRates(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
