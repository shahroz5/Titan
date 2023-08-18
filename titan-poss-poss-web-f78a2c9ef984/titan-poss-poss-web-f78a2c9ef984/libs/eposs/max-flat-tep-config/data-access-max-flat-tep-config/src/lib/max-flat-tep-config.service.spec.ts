import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { MaxFlatTepConfigService } from './max-flat-tep-config.service';
import {
  getTepGlobalConfigListUrl,
  updateTepGlobalConfigUrl
} from '@poss-web/shared/util-api-service';
import {
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';
import { MaxFlatTepConfigAdaptor } from '@poss-web/shared/util-adaptors';

describe('MaxFlatTepConfigService', () => {
  let httpTestingController: HttpTestingController;
  let maxFlatTepConfigService: MaxFlatTepConfigService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MaxFlatTepConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    maxFlatTepConfigService = TestBed.inject(MaxFlatTepConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(maxFlatTepConfigService).toBeTruthy();
  });

  it('getMaxFlatTepConfig - should Get Max Flat Tep Config', () => {
    const mockInitiateGrfResponse = {
      docNo: 62,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    spyOn(
      MaxFlatTepConfigAdaptor,
      'getConfigDetailsFromListResponse'
    ).and.returnValue(mockInitiateGrfResponse);
    const apiPath = getTepGlobalConfigListUrl();
    maxFlatTepConfigService.getMaxFlatTepConfig().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('updateMaxFlatTepConfig - Should Update Max Flat Tep Config', () => {
    const payload: MaxFlatValuePatchPayload = {
      configDetails: {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      }
    };
    const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
      type: 'MAX_FLAT_CONFIG',
      data: {
        maxFlatTepExchangeValue: '1200'
      },
      configId: '1234-abcd'
    };
    spyOn(
      MaxFlatTepConfigAdaptor,
      'getConfigDetailsFromUpdateResponse'
    ).and.returnValue(maxFlatTepConfigDetailsResponse);
    const apiPath = updateTepGlobalConfigUrl('1234-abcd');
    maxFlatTepConfigService
      .updateMaxFlatTepConfig('1234-abcd', payload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
