import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AdvanceBookingService } from './advance-booking.service';
import {
  ABRequestStatusDownValues,
  ABRequestStatusList,
  ABSearchResponse,
  ABSearchValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingDetailsResponse,
  AdvanceBookingSearchPayload,
  CashMemoItemDetailsRequestPayload,
  RequestPayload,
  StatusTypesEnum
} from '@poss-web/shared/models';

import {
  ApiService,
  getSearchProductEndPointUrl,
  getProductDetailsEndPointUrl,
  getPriceDetailsEndPointUrl,
  getValidateProductDetailsEndPointUrl,
  getTaxDetailsEndPointUrl,
  getAdvanceBookingEndPointUrl,
  getAdvanceBookingPriceUpdateEndPointUrl,
  getAdvanceBoookingItemEndPointUrl,
  searchABUrl,
  getBillCancelUrl,
  getAdvanceBookingActionUrl,
  getWorkFlowProcessUrl
} from '@poss-web/shared/util-api-service';
import {
  CashMemoHelper,
  CashMemoAdaptor
} from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
const requestPayload: RequestPayload = {
  httpMethod: 'string',
  relativeUrl: '',
  reqBody: {
    dateRangeType: 'string',
    docNo: 1,
    endDate: moment(),
    fiscalYear: 1,
    startDate: moment()
  },
  requestParams: {
    page: 1,
    size: 0,
    workflowType: 's',
    approvalStatus: 'string',
    sort: 'any'
  }
};

const advanceBookingSearchPayload: AdvanceBookingSearchPayload = {
  docNo: 0,
  page: 0,
  size: 8,
  subTxnType: '',
  txnType: '',
  fiscalYear: 2015
};

const advanceBookingDetailsRequestPayload: AdvanceBookingDetailsRequestPayload = {
  subTxnType: '',
  txnType: '',
  actionType: ''
};

const aBRequestStatusDownValues: ABRequestStatusDownValues = {
  status: '',
  type: ''
};

const aBSearchValues: ABSearchValues = {
  doNo: 0,
  fiscalYear: 2016,
  function: '',
  phNo: 810539193
};

const aBRequestStatusList: ABRequestStatusList = {
  pageNumber: 0,
  pageSize: 8,
  response: {},
  results: [],
  totalElements: 8,
  totalPages: 1
};

const advanceBookingDetailsResponse: AdvanceBookingDetailsResponse = {
  activationDetails: {},
  hallmarkCharges: 0,
  hallmarkDiscount: 0,
  isFrozenAmount: 0,
  isRivaah: false,
  cancellationDetails: {},
  confirmedTime: moment(),
  refSubTxnType: '',
  customerDocDetails: '',
  customerId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  finalValue: 123,
  firstHoldTime: moment(),
  fiscalYear: 2015,
  focDetails: {},
  id: '',
  isBestRate: true,
  isFrozenRate: true,
  lastHoldTime: moment(),
  metalRateList: {},
  minValue: 1,
  occasion: '',
  txnType: '',
  otherChargesList: {},
  paidValue: 1,
  refTxnId: '',
  refTxnType: '',
  remarks: '',
  roundingVariance: 1,
  status: StatusTypesEnum.APPROVED,
  subTxnType: '',
  taxDetails: { cess: [], data: [], taxClass: '', taxType: '' },
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  totalWeight: 1,
  txnTime: moment()
};

const aBSearchResponse: ABSearchResponse = {
  ABList: [advanceBookingDetailsResponse],
  totalElements: 1
};
describe('AdvanceBookingService', () => {
  let httpTestingController: HttpTestingController;
  let advanceBookingService: AdvanceBookingService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdvanceBookingService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    advanceBookingService = TestBed.inject(AdvanceBookingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(AdvanceBookingService).toBeTruthy();
  });

  // 'getItemFromCashMemo',
  // 'getloadRequest'

  describe('viewCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl('', '', '12');
      advanceBookingService.viewCashMemo('12', '', '').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl('', '', '12');
      advanceBookingService.viewCashMemo('12', '', '').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );

      const path = getAdvanceBookingEndPointUrl('', '', '12');
      advanceBookingService.viewCashMemo('12', '', '').subscribe(data => {
        expect(data).toEqual(advanceBookingDetailsResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('partialUpdateCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl(
        'test',
        'test',
        '12',
        null,
        'action'
      );
      advanceBookingService
        .partialUpdateCashMemo('12', 'test', 'test', 'test', 'action')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl(
        'test',
        'test',
        '12',
        null,
        'action'
      );
      advanceBookingService
        .partialUpdateCashMemo('12', 'test', 'test', 'test', 'action')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );

      const path = getAdvanceBookingEndPointUrl(
        'test',
        'test',
        '12',
        null,
        'action'
      );
      advanceBookingService
        .partialUpdateCashMemo('12', 'test', 'test', 'test', 'action')
        .subscribe(data => {
          expect(data).toEqual(advanceBookingDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('createCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );

      const path = getAdvanceBookingEndPointUrl('txnType', 'subTxnType');
      advanceBookingService.createCashMemo('txnType', 'subTxnType').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl('txnType', 'subTxnType');
      advanceBookingService.createCashMemo('txnType', 'subTxnType').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );

      const path = getAdvanceBookingEndPointUrl('txnType', 'subTxnType');
      advanceBookingService
        .createCashMemo('txnType', 'subTxnType')
        .subscribe(data => {
          expect(data).toEqual(advanceBookingDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('updateABActions', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingActionUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateABActions('12', 'test', 'txnType', 'subTxnType', 'ACTION')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingActionUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateABActions('12', 'test', 'txnType', 'subTxnType', 'ACTION')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );

      const path = getAdvanceBookingActionUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateABActions('12', 'test', 'txnType', 'subTxnType', 'ACTION')
        .subscribe(data => {
          expect(data).toEqual(advanceBookingDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('updateCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateCashMemo(
          advanceBookingDetailsRequestPayload.requestDetails,
          '12',
          'ACTION',
          'txnType',
          'subTxnType'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingEndPointUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateCashMemo(
          advanceBookingDetailsRequestPayload.requestDetails,
          '12',
          'ACTION',
          'txnType',
          'subTxnType'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );

      const path = getAdvanceBookingEndPointUrl(
        'txnType',
        'subTxnType',
        '12',
        'ACTION'
      );
      advanceBookingService
        .updateCashMemo(
          advanceBookingDetailsRequestPayload.requestDetails,
          '12',
          'ACTION',
          'txnType',
          'subTxnType'
        )
        .subscribe(data => {
          expect(data).toEqual(advanceBookingDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('deleteCashMemo', () => {
    it('should call GET api method with correct url', () => {
      const path = getAdvanceBookingEndPointUrl('txnType', 'subTxnType', '12');
      advanceBookingService
        .deleteCashMemo('12', 'txnType', 'subTxnType')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('updatePriceDetails', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingPriceUpdateEndPointUrl(
        '12',
        'txnType',
        'subTxnType'
      );
      advanceBookingService
        .updatePriceDetails('12', 'txnType', 'subTxnType')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getAdvanceBookingPriceUpdateEndPointUrl(
        '12',
        'txnType',
        'subTxnType'
      );
      advanceBookingService
        .updatePriceDetails('12', 'txnType', 'subTxnType')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(advanceBookingDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(advanceBookingDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        advanceBookingDetailsResponse
      );
      const path = getAdvanceBookingPriceUpdateEndPointUrl(
        '12',
        'txnType',
        'subTxnType'
      );
      advanceBookingService
        .updatePriceDetails('12', 'txnType', 'subTxnType')
        .subscribe(data => {
          expect(data).toEqual(advanceBookingDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  // describe('searchAB', () => {
  //   it('should call GET api method with correct url', () => {
  //     spyOn(CashMemoHelper, 'getABDetails').and.returnValue({});
  //     const path = searchABUrl(advanceBookingSearchPayload);
  //     advanceBookingService.searchAB(advanceBookingSearchPayload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.urlWithParams === apiUrl + path.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });
  //   it('should call  CashMemoHelper method with correct arguments', () => {
  //     spyOn(CashMemoHelper, 'getABDetails').and.returnValue({});
  //     const path = searchABUrl(advanceBookingSearchPayload);
  //     advanceBookingService.searchAB(advanceBookingSearchPayload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.urlWithParams === apiUrl + path.path;
  //     });
  //     request.flush(aBSearchResponse);
  //     expect(CashMemoHelper.getABDetails).toHaveBeenCalledWith(
  //       aBSearchResponse
  //     );
  //   });

  //   it('should retun data mapped by CashMemoAdaptor', () => {
  //     spyOn(CashMemoHelper, 'getABDetails').and.returnValue(aBSearchResponse);
  //     const path = searchABUrl(advanceBookingSearchPayload);
  //     advanceBookingService
  //       .searchAB(advanceBookingSearchPayload)
  //       .subscribe(data => {
  //         expect(data).toEqual(aBSearchResponse);
  //       });

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path.path
  //     );
  //     request.flush({});
  //   });
  // });

  describe('getloadRequest', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue({});
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      advanceBookingService.getloadRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoHelper method with correct arguments', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue({});
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      advanceBookingService.getloadRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(aBRequestStatusList);
      expect(CashMemoHelper.loadRequest).toHaveBeenCalledWith(
        aBRequestStatusList
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue(aBRequestStatusList);
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      advanceBookingService.getloadRequest(requestPayload).subscribe(data => {
        expect(data).toEqual(aBRequestStatusList);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
