import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TEPService } from './tep.service';
import {
  RequestPayload,
  ABRequestStatusList,
  workflowPayload,
  RefundStatusCount,
  RefundRequestPayload,
  GetTepItemConfiguratonResponse,
  AdvanceBookingSearchPayload,
  TEPSearchResponse,
  AdvanceHistoryItemsRequestPayload,
  HistorySearchParamDetails,
  ABRequestStatusDownValues
} from '@poss-web/shared/models';

import {
  ApiService,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl,
  getRefundStatusUrl,
  getRefundDetailsUrl,
  getTepItemConfigUrl,
  searchTEPWithActionUrl,
  getTEPHistoryEndPointUrl
} from '@poss-web/shared/util-api-service';
import { CashMemoHelper, TEPHelper } from '@poss-web/shared/util-adaptors';
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

const aBRequestStatusList: ABRequestStatusList = {
  pageNumber: 0,
  pageSize: 8,
  response: {},
  results: [],
  totalElements: 8,
  totalPages: 1
};
const WorkflowPayload: workflowPayload = { processId: '', workflowType: '' };
const refundStatusCount: RefundStatusCount = {
  refundList: [],
  totalElements: 1
};
const refundRequestPayload: RefundRequestPayload = {
  id: '',
  txnType: '',
  status: ''
};
const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
  isCMMandatory: true,
  isQuantityEditable: true,
  isTepAllowed: true,
  isTEPSaleBin: true,
  isCutPieceTepAllowed: true,
  isFVTAllowed: true,
  tepOfferDetails: {
    type: '',
    data: {
      deductionPercent: 0,
      flatTepExchangeValue: 0,
      isWeightToleranceAllowed: true,
      approvedBy: '',
      reasonForException: ''
    }
  },
  goldDeductionPercent: 0,
  silverDeductionPercent: 0,
  platinumDeductionPercent: 0,
  ucpDeductionPercent: 0,
  ucpDeductionFlatValue: [],
  isStoneChargesApplicable: true,
  stoneDeductionPercent: 0,
  cmUnavailableDeductionPercent: 0,
  recoverDiscountPercent: 0,
  refundDeductionPercent: 0,
  weightTolerancePercent: 0,
  isProportionedValue: true,
  typeOfExchange: '',
  isInterBrandTepAllowed: true,
  fvtDeductionPercent: 0,
  tepGeneralCodeConfig: {
    allowedProductGroups: [],
    isCMMandatory: true,
    isValuationAtStore: true
  },
  tepCutPieceConfig: {
    cutPieceItemCode: '',
    weightTolerancePercent: 0
  }
};
const tEPSearchResponse: TEPSearchResponse = { TEPList: [], totalElements: 8 };
const historySearchParamDetails: HistorySearchParamDetails = { cnDocNo: 9 };
const advanceHistoryItemsRequestPayload: AdvanceHistoryItemsRequestPayload = {
  docNo: 4
};

describe('TEPService', () => {
  let httpTestingController: HttpTestingController;
  let tEPService: TEPService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TEPService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    tEPService = TestBed.inject(TEPService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(TEPService).toBeTruthy();
  });

  describe('getWorkFlowProcessDetailsUrl', () => {
    it('should call GET api method with correct url', () => {
      const path = getWorkFlowProcessDetailsUrl(WorkflowPayload);
      tEPService.loadWorkflowDeatils(WorkflowPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  // describe('searchTep', () => {
  //   it('should call GET api method with correct url', () => {

  //     const path = searchTEPWithActionUrl(advanceBookingSearchPayload);
  //     tEPService.searchTep(advanceBookingSearchPayload,requestPayload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });

  // });

  describe('getRefundRequestDetails', () => {
    it('should call GET api method with correct url', () => {
      const path = getRefundDetailsUrl(refundRequestPayload);
      tEPService.getRefundRequestDetails(refundRequestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('ApproveRefundRequestDetails', () => {
    it('should call GET api method with correct url', () => {
      const path = getRefundDetailsUrl(refundRequestPayload);
      tEPService.ApproveRefundRequestDetails(refundRequestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getTepItemConfiguration', () => {
    it('should call GET api method with correct url', () => {
      const path = getTepItemConfigUrl('test', '1', false, '2');
      tEPService.getTepItemConfiguration('test', '1', '2').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getloadRequest', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue({});
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      tEPService.getloadRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  TEPHelper method with correct arguments', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue({});
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      tEPService.getloadRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(aBRequestStatusList);
      expect(CashMemoHelper.loadRequest).toHaveBeenCalledWith(
        aBRequestStatusList
      );
    });

    it('should retun data mapped by TEPAdaptor', () => {
      spyOn(CashMemoHelper, 'loadRequest').and.returnValue(aBRequestStatusList);
      const path = getWorkFlowProcessUrl(requestPayload.requestParams);
      tEPService.getloadRequest(requestPayload).subscribe(data => {
        expect(data).toEqual(aBRequestStatusList);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
  describe('getRefundRequest', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoHelper, 'loadRefundDeatils').and.returnValue({});
      const path = getRefundStatusUrl(requestPayload.requestParams);
      tEPService.getRefundRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call TEPHelper method with correct arguments', () => {
      spyOn(CashMemoHelper, 'loadRefundDeatils').and.returnValue({});
      const path = getRefundStatusUrl(requestPayload.requestParams);
      tEPService.getRefundRequest(requestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(aBRequestStatusList);
      expect(CashMemoHelper.loadRefundDeatils).toHaveBeenCalledWith(
        aBRequestStatusList
      );
    });

    it('should retun data mapped by TEPAdaptor', () => {
      spyOn(CashMemoHelper, 'loadRefundDeatils').and.returnValue(
        refundStatusCount
      );
      const path = getRefundStatusUrl(requestPayload.requestParams);
      tEPService.getRefundRequest(requestPayload).subscribe(data => {
        expect(data).toEqual(refundStatusCount);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('getHistoryItems', () => {
    it('should call GET api method with correct url', () => {
      spyOn(TEPHelper, 'getHistoryDetails').and.returnValue({});
      const path = getTEPHistoryEndPointUrl(
        'subTxnType',
        'txnType',
        {
          colId: '1',
          sort: '1'
        },
        'searchField',
        'searchType',
        'status',
        0,
        0
      );
      tEPService
        .getHistoryItems(
          advanceHistoryItemsRequestPayload,
          'searchField',
          'searchType',
          'status',
          0,
          0,
          'txnType',
          'subTxnType',
          {
            colId: '1',
            sort: '1'
          }
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  TEPHelper method with correct arguments', () => {
      spyOn(TEPHelper, 'getHistoryDetails').and.returnValue({});
      const path = getTEPHistoryEndPointUrl(
        'subTxnType',
        'txnType',
        {
          colId: '1',
          sort: '1'
        },
        'searchField',
        'searchType',
        'status',
        0,
        0
      );
      tEPService
        .getHistoryItems(
          advanceHistoryItemsRequestPayload,
          'searchField',
          'searchType',
          'status',
          0,
          0,
          'txnType',
          'subTxnType',
          {
            colId: '1',
            sort: '1'
          }
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(aBRequestStatusList);
      expect(TEPHelper.getHistoryDetails).toHaveBeenCalledWith(
        aBRequestStatusList
      );
    });

    it('should retun data mapped by TEPHelper', () => {
      spyOn(TEPHelper, 'getHistoryDetails').and.returnValue(tEPSearchResponse);
      const path = getTEPHistoryEndPointUrl(
        'subTxnType',
        'txnType',
        {
          colId: '1',
          sort: '1'
        },
        'searchField',
        'searchType',
        'status',
        0,
        0
      );
      tEPService
        .getHistoryItems(
          advanceHistoryItemsRequestPayload,
          'searchField',
          'searchType',
          'status',
          0,
          0,
          'txnType',
          'subTxnType',
          {
            colId: '1',
            sort: '1'
          }
        )
        .subscribe(data => {
          expect(data).toEqual(tEPSearchResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
