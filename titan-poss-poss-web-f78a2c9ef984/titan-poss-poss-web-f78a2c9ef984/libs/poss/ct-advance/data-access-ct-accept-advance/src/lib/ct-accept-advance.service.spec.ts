import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CtAcceptAdvanceService } from './ct-accept-advance.service';
import { CtAcceptAdvanceAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getAcceptAdvanceEndPointUrl,
  getAcceptAdvanceHistoryEndPointUrl
} from '@poss-web/shared/util-api-service';
import {
  AdvanceHistoryItemsRequestPayload,
  CtAcceptAdvanceTxnEnum,
  CtGrfTxnEnum,
  CtTabEnum,
  PartialUpdateAdvanceRequestPayload,
  UpdateAdvanceRequestPayload
} from '@poss-web/shared/models';

describe('CtAcceptAdvanceService', () => {
  let httpTestingController: HttpTestingController;
  let ctAcceptAdvanceService: CtAcceptAdvanceService;
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
        CtAcceptAdvanceService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    ctAcceptAdvanceService = TestBed.inject(CtAcceptAdvanceService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(ctAcceptAdvanceService).toBeTruthy();
  });

  it('initiateAdvanceTransaction - should initiate Accept Advance and create open state with transaction id', () => {
    const mockInitiateAdvanceResponse = {
      docNo: 62,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    spyOn(CtAcceptAdvanceAdaptor, 'getInitiateAdvanceResponse').and.returnValue(
      mockInitiateAdvanceResponse
    );
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES,
      CtAcceptAdvanceTxnEnum.ADV
    );
    ctAcceptAdvanceService.initiateAdvanceTransaction().subscribe(response => {
      expect(response).toBe(mockInitiateAdvanceResponse);
    });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('updateAdvanceTransaction - should update Accept Advance', () => {
    const mockUpdateAdvanceResponse = {
      cndocNos: [],
      docNo: 12,
      id: ''
    };
    const mockUpdateAdvanceRequestPayload: UpdateAdvanceRequestPayload = {
      customerId: 624,
      weightAgreed: 2.5,
      paidValue: 10000,
      remarks: ''
    };
    spyOn(
      CtAcceptAdvanceAdaptor,
      'getUpdateAdvanceTransactionResponse'
    ).and.returnValue(mockUpdateAdvanceResponse);
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES,
      CtAcceptAdvanceTxnEnum.ADV,
      '123456'
    );
    ctAcceptAdvanceService
      .updateAdvanceTransaction('123456', mockUpdateAdvanceRequestPayload)
      .subscribe(response => {
        expect(response).toBe(mockUpdateAdvanceResponse);
      });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('PartiallyUpdateAdvance - should partially update advance', () => {
    const partiallyUpdateAdvanceRequestPayload: PartialUpdateAdvanceRequestPayload = {
      customerId: 625,
      totalValue: 10000
    };
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES,
      CtAcceptAdvanceTxnEnum.ADV,
      '123456'
    );
    ctAcceptAdvanceService
      .partiallyUpdateAdvanceTransaction(
        '123456',
        partiallyUpdateAdvanceRequestPayload
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

  it('acceptAdvanceGrfTransactionDetails - should get Accept Advance Transaction Details', () => {
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES,
      CtAcceptAdvanceTxnEnum.ADV,
      '1234-abcd'
    );
    ctAcceptAdvanceService
      .getAdvanceTransactionDetails('1234-abcd')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('AcceptAdvanceHistoryItems - should get Advance History Items', () => {
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
    ctAcceptAdvanceService
      .getAdvanceHistoryItems(
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

  it('deleteAdvanceTransactionDetails - should delete Accept Advance Transaction Details', () => {
    const apiPath = getAcceptAdvanceEndPointUrl(
      CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES,
      CtAcceptAdvanceTxnEnum.ADV,
      '1234-abcd',
      'remarks'
    );
    ctAcceptAdvanceService
      .deleteAdvanceTransactionDetails('1234-abcd')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
