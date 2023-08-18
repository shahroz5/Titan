import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BgrConfigService } from './bgr-config.service';
import {
  getConfigurationListUrl,
  getSaveConfigFiledValueUrl,
  getTepGlobalConfigListUrl,
  getUpdateConfigFiledValueUrl,
  updateTepGlobalConfigUrl
} from '@poss-web/shared/util-api-service';
import {
  BgrConfigListingParams,
  BgrConfigListingRequestPayload,
  ConfigTypeEnum,
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';
import {
  BgrConfigAdaptor,
  MaxFlatTepConfigAdaptor
} from '@poss-web/shared/util-adaptors';

describe('MaxFlatTepConfigService', () => {
  let httpTestingController: HttpTestingController;
  let bgrConfigService: BgrConfigService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BgrConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bgrConfigService = TestBed.inject(BgrConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(bgrConfigService).toBeTruthy();
  });

  it('getBgrConfigList - should Get Bgr Config List', () => {
    const response = [
      {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    ];
    const params: BgrConfigListingParams = {
      pageIndex: 0,
      pageSize: 10
    };
    const requestPayload: BgrConfigListingRequestPayload = {
      ruleType: 'BGR_CONFIG'
    };
    spyOn(BgrConfigAdaptor, 'getBgrConfigListing').and.returnValue(response);
    const apiPath = getConfigurationListUrl(0, 10);
    bgrConfigService.getBgrConfigList(params, requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getBgrConfigSearch - should Get Bgr Config Search', () => {
    const response = [
      {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    ];
    spyOn(BgrConfigAdaptor, 'getBgrConfigListing').and.returnValue(response);
    const apiPath = getConfigurationListUrl(0, 10);
    bgrConfigService.getBgrConfigSearch('').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('GETBgrConfigDetails - should Save Bgr Config Details', () => {
    const payload = {
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    };
    spyOn(BgrConfigAdaptor, 'getBgrConfigListing').and.returnValue(payload);
    const apiPath = getUpdateConfigFiledValueUrl('', ConfigTypeEnum.BGR_CONFIG);
    bgrConfigService.getBgrConfigDetails('').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('saveBgrConfigDetails - should Save Bgr Config Details', () => {
    const payload = {
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    };
    spyOn(BgrConfigAdaptor, 'getBgrConfigListing').and.returnValue(payload);
    const apiPath = getSaveConfigFiledValueUrl(ConfigTypeEnum.BGR_CONFIG);
    bgrConfigService.saveBgrConfigDetails(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('editBgrConfigDetails - should Edit Bgr Config Details', () => {
    const payload = {
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    };
    spyOn(BgrConfigAdaptor, 'getBgrConfigListing').and.returnValue(payload);
    const apiPath = getUpdateConfigFiledValueUrl(
      '1234',
      ConfigTypeEnum.BGR_CONFIG
    );
    bgrConfigService.editBgrConfigDetails(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
