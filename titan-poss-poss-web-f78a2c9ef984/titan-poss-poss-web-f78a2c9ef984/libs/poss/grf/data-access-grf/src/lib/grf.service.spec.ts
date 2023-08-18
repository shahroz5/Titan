import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CtGrfService } from './grf.service';
import { CtGrfAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getAcceptAdvanceEndPointUrl,
  getAcceptAdvanceHistoryEndPointUrl,
  getCashPaymentEngineUrl,
  getFrozenCNsUrl,
  getGenerateOTPUrl,
  getMegreCNsUrl,
  getSearchGRFUrl,
  getValidateOTPUrl
} from '@poss-web/shared/util-api-service';
import {
  AdvanceHistoryItemsRequestPayload,
  CtGrfTxnEnum,
  MergeCNPayload,
  PartialUpdateGrfRequestPayload,
  UpdateGrfRequestPayload
} from '@poss-web/shared/models';

describe('CtAcceptAdvanceService', () => {
  let httpTestingController: HttpTestingController;
  let ctGrfService: CtGrfService;
  // let ctAcceptAdvanceAdaptorSpy: CtAcceptAdvanceAdaptor;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    // ctAcceptAdvanceAdaptorSpy = jasmine.createSpyObj([
    //     'getInitiateAdvanceResponse',
    //     'getUpdateAdvanceTransactionResponse'
    // ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CtGrfService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    ctGrfService = TestBed.inject(CtGrfService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(ctGrfService).toBeTruthy();
  });

  it('initiateGrfTransaction - should initiate new Grf and create open state with transaction id', () => {
    const mockInitiateGrfResponse = {
      docNo: 62,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    spyOn(CtGrfAdaptor, 'getInitiateAdvanceResponse').and.returnValue(
      mockInitiateGrfResponse
    );
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtGrfTxnEnum.FROZEN_RATES,
      CtGrfTxnEnum.ADV
    );
    ctGrfService.initiateGrfTransaction('NEW_GRF', {}).subscribe(response => {
      expect(response).toBe(mockInitiateGrfResponse);
    });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('updateGrfTransaction - should update Grf', () => {
    const mockUpdateGrfResponse = {
      cndocNos: [],
      docNo: 12,
      id: ''
    };
    const mockUpdateGrfRequestPayload: UpdateGrfRequestPayload = {
      customerId: 624,
      weightAgreed: 2.5,
      paidValue: 10000,
      metalRateList: {
        metalRates: {
          J: {
            metalTypeCode: 'J',
            purity: 92,
            ratePerUnit: 1540,
            applicableDate: Number(new Date().toTimeString()),
            currency: 'INR'
          }
        }
      },
      remarks: ''
    };
    spyOn(CtGrfAdaptor, 'getUpdateAdvanceTransactionResponse').and.returnValue(
      mockUpdateGrfResponse
    );
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtGrfTxnEnum.FROZEN_RATES,
      CtGrfTxnEnum.ADV,
      '123456'
    );
    ctGrfService
      .updateGrfTransaction('NEW_GRF', '123456', mockUpdateGrfRequestPayload)
      .subscribe(response => {
        expect(response).toBe(mockUpdateGrfResponse);
      });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('PartiallyUpdateGrf - should partially update grf', () => {
    const partiallyUpdateGrfRequestPayload: PartialUpdateGrfRequestPayload = {
      customerId: 625,
      totalValue: 10000
    };
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtGrfTxnEnum.FROZEN_RATES,
      CtGrfTxnEnum.ADV,
      '123456'
    );
    ctGrfService
      .partiallyUpdateGrfTransaction(
        'NEW_GRF',
        '123456',
        partiallyUpdateGrfRequestPayload
      )
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getGrfTransactionDetails - should get Grf Transaction Details', () => {
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtGrfTxnEnum.FROZEN_RATES,
      CtGrfTxnEnum.ADV,
      '1234-abcd'
    );
    ctGrfService.getGrfTransactionDetails('NEW_GRF', '1234-abcd').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getAdvanceHistoryItems - should get Advance History Items', () => {
    const requestPayload: AdvanceHistoryItemsRequestPayload = {
      docNo: 123,
      fiscalYear: 2021
    };
    const apiPath = getAcceptAdvanceHistoryEndPointUrl(
      CtGrfTxnEnum.FROZEN_RATES,
      CtGrfTxnEnum.ADV,
      '123',
      'docNo',
      'CONFIRMED',
      0,
      10
    );
    ctGrfService
      .getAdvanceHistoryItems(
        'NEW_GRF',
        requestPayload,
        '123',
        'docNo',
        'CONFIRMED',
        0,
        10
      )
      .subscribe(response => {
        expect(response.results.length).toBe(0);
      });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getCNValidationDetails - get CN Validation Details', () => {
    const apiPath = getCashPaymentEngineUrl('RULE_TYPE');
    ctGrfService
      .getCNValidationDetails({
        ruleType: 'RULE_TYPE',
        requestBody: null
      })
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  describe('Merging CNs Testing Suite', () => {
    describe('LoadFrozenCNs', () => {
      it('should call GET api method with correct url and params', () => {
        const { path, params } = getFrozenCNsUrl('12');

        ctGrfService.loadFrozenCNs('12').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');
        expect(request.request.params.get('customerId').toString()).toEqual(
          '12'
        );
        expect(request.request.params.get('subTxnType').toString()).toEqual(
          'FROZEN_RATES'
        );
        expect(request.request.params.get('txnType').toString()).toEqual('ADV');
        //expect(request.request.urlWithParams).toEqual(apiUrl + path);
        request.flush({});
      });
    });

    describe('SearchGRF', () => {
      it('should call GET api method with correct url and params', () => {
        const { path, params } = getSearchGRFUrl('12', '2020');

        ctGrfService.searchGRF({ docNo: '12', fiscalYear: '2020' }).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');
        expect(request.request.params.get('docNo').toString()).toEqual('12');
        expect(request.request.params.get('fiscalYear').toString()).toEqual(
          '2020'
        );
        request.flush({});
      });
    });

    describe('MergeCNs', () => {
      it('should call GET api method with correct url and params', () => {
        const mergeCNPayload: MergeCNPayload = {
          tempFileIds: { others: ['abc123'] },
          customerId: '12',
          employeeCode: 'URB',
          ids: ['12'],
          remarks: 'abc'
        };
        const { path, params } = getMegreCNsUrl();

        ctGrfService.mergeCNs(mergeCNPayload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('PATCH');
        expect(request.request.responseType).toEqual('json');
        expect(request.request.params.get('subTxnType').toString()).toEqual(
          'FROZEN_RATES'
        );
        expect(request.request.params.get('txnType').toString()).toEqual('ADV');
        request.flush({});
      });
    });

    describe('GenerateOTP', () => {
      it('should call GET api method with correct url and params', () => {
        const { path, params } = getGenerateOTPUrl('12');

        ctGrfService.generateOTP('12').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('POST');
        expect(request.request.responseType).toEqual('json');
        expect(request.request.params.get('id').toString()).toEqual('12');
        expect(request.request.params.get('otpType').toString()).toEqual('CN');
        request.flush({});
      });
    });

    describe('ValidateOTP', () => {
      it('should call GET api method with correct url and params', () => {
        const { path, params } = getValidateOTPUrl('12', '12');

        ctGrfService.validateOTP({ token: '12', id: '12' }).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('PUT');
        expect(request.request.responseType).toEqual('json');
        expect(request.request.params.get('id').toString()).toEqual('12');
        expect(request.request.params.get('otpType').toString()).toEqual('CN');
        expect(request.request.params.get('token').toString()).toEqual('12');
        request.flush({});
      });
    });
  });
});
