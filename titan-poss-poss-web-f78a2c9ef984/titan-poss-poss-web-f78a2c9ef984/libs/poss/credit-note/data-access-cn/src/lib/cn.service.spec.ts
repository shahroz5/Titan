import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CancelCnRequestPayload,
  ConfirmRequestTypePayload,
  CreditNoteDetails,
  CreditNoteSearch,
  CreditNoteSearchResult,
  LoadRequestsPayload,
  SentRequestPayload,
  SentRequestResponse,
  TransferEghsPayload
} from '@poss-web/shared/models';
import { CreditNoteAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCalculateCnRefundAmountRequestUrl,
  getCancelAutoApprovedCnRequestUrl,
  getCancelRequestApprovedCnRequestUrl,
  getCancelRequstUrl,
  getCreditNoteSearchUrl,
  getCreditNotesUrl,
  getDownloadGHSUrl,
  getLoadSentRequestsUrl,
  getRequestUrl,
  getSentRequestUrl,
  getTransfetToEghsUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { CreditNoteService } from './cn.service';
describe('CreditNoteService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let creditNoteService: CreditNoteService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CreditNoteService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    creditNoteService = TestBed.inject(CreditNoteService);
  });

  it('should be created', () => {
    expect(creditNoteService).toBeTruthy();
  });
  const searchPayload: CreditNoteSearch = {
    cnNumber: '123',
    mobileNumber: '9010462817',
    fiscalYear: '2021',
    pageIndex: 0,
    pageSize: 5
  };
  const creditNoteSearchResult: CreditNoteSearchResult[] = [
    {
      amount: 123,
      creditNoteType: 'ADVANCE',
      customerName: 'Srinivas',
      docDate: moment('123'),
      docNo: 123,
      fiscalYear: 2021,
      id: 'abc123',
      linkedTxnId: 'abc123',
      linkedTxnType: 'abc',
      locationCode: 'URB',
      mobileNumber: '9010462817',
      status: 'open',
      customerId: '2',
      frozenRateDetails: {},
      accountNumber: '12'
    }
  ];
  const dummyCreditNoteSearchResult = {
    results: creditNoteSearchResult,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 2
  };

  const dummyCreditNoteDetails: CreditNoteDetails = {
    id: 'abc123',
    docNo: 123,
    fiscalYear: 2021,
    customerName: 'Srinivas',
    customerId: 123,
    locationCode: 'URB',
    creditNoteType: 'ADVANCE',
    docDate: moment(123),
    amount: 1000,
    status: 'open',
    linkedTxnType: 'abc',
    mobileNumber: '9010462817',
    linkedTxnId: 'abc123',
    refDocNo: 123,
    refDocType: 'abc',
    workflowStatus: 'REMOVE_GOLD_RATE',
    frozenRateDetails: {}
  };
  const sentRequestPayload: SentRequestPayload = {
    creditNoteType: 'REMOVE_GOLD_RATE',
    id: 'abc123',
    payload: {}
  };

  const sentRequestResponse: {
    requestSentResponse: SentRequestResponse[];
    count: number;
  } = {
    requestSentResponse: [
      {
        docNo: 12,
        fiscalYear: 2021,
        cnType: 'ADVANCE',
        amount: '1000',
        custName: 'srinivas',
        reqDate: moment('123'),
        status: 'open',
        id: 'abc123',
        processId: 'abc123',
        requestorRemarks: 'good',
        frozenRateDetails: {},
        approvalStatus: 'open',
        createdDate: moment(123),
        custId: 'abc123',
        cnNumber: '12'
      }
    ],
    count: 1
  };

  const dummySentRequestResponse = {
    results: sentRequestResponse.requestSentResponse,
    totalElements: sentRequestResponse.count,
    pageIndex: 0,
    pageSize: 0
  };
  const cancelCnRequestPayload: CancelCnRequestPayload = {
    paymentDetails: {
      data: {
        paymentCode: 'CASH',
        paymentGroup: '',
        refundAmount: 12345,
        otherDetails: null
      },
      type: 'CN_REFUND_PAYMENT_DETAILS'
    },
    id: '12345',
    creditNoteWorkFlowType: 'CREDIT_NOTE_CANCELLATION',
    remarks: null
  };

  describe('CreditNoteSearch', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteSearchResult').and.returnValue({});

      creditNoteService.searchCreditNotes(searchPayload).subscribe();
      const { path, params } = getCreditNoteSearchUrl(
        searchPayload.cnNumber,
        searchPayload.fiscalYear,
        searchPayload.mobileNumber,
        searchPayload.pageIndex,
        searchPayload.pageSize
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.get('docNo')).toEqual(
        searchPayload.cnNumber
      );
      expect(request.request.params.get('fiscalYear')).toEqual(
        searchPayload.fiscalYear
      );
      expect(request.request.params.get('mobileNo')).toEqual(
        searchPayload.mobileNumber
      );

      expect(request.request.params.get('page')).toEqual(
        searchPayload.pageIndex.toString()
      );
      expect(request.request.params.get('size')).toEqual(
        searchPayload.pageSize.toString()
      );

      request.flush({});
    });

    it('should call CreditNoteAdaptor getCreditNoteSearchResult method with correct  parameters', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteSearchResult').and.returnValue({});

      const { path, params } = getCreditNoteSearchUrl(
        searchPayload.cnNumber,
        searchPayload.fiscalYear,
        searchPayload.mobileNumber,
        searchPayload.pageIndex,
        searchPayload.pageSize
      );

      creditNoteService.searchCreditNotes(searchPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCreditNoteSearchResult);
      expect(CreditNoteAdaptor.getCreditNoteSearchResult).toHaveBeenCalledWith(
        dummyCreditNoteSearchResult
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteSearchResult').and.returnValue({
        searchResult: creditNoteSearchResult,
        count: 1
      });

      const { path, params } = getCreditNoteSearchUrl(
        searchPayload.cnNumber,
        searchPayload.fiscalYear,
        searchPayload.mobileNumber,
        searchPayload.pageIndex,
        searchPayload.pageSize
      );

      creditNoteService.searchCreditNotes(searchPayload).subscribe(data => {
        expect(data).toEqual({
          searchResult: creditNoteSearchResult,
          count: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('LoadCreditNote', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteDetails').and.returnValue({});

      creditNoteService.loadCreditNote('12').subscribe();
      const path = getCreditNotesUrl('12');
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      request.flush({});
    });

    it('should call CreditNoteAdaptor getCreditNoteDetails method with correct  parameters', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteDetails').and.returnValue({});

      const path = getCreditNotesUrl('12');

      creditNoteService.loadCreditNote('12').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCreditNoteDetails);
      expect(CreditNoteAdaptor.getCreditNoteDetails).toHaveBeenCalledWith(
        dummyCreditNoteDetails
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CreditNoteAdaptor, 'getCreditNoteDetails').and.returnValue(
        dummyCreditNoteDetails
      );

      const path = getCreditNotesUrl('12');

      creditNoteService.loadCreditNote('12').subscribe(data => {
        expect(data).toEqual(dummyCreditNoteDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('RaiseRequest', () => {
    it('should call POST api method with correct url and params', () => {
      const { path, params } = getSentRequestUrl(
        sentRequestPayload.creditNoteType,
        sentRequestPayload.id
      );
      creditNoteService.raiseRequest(sentRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        sentRequestPayload.creditNoteType
      );
      request.flush({});
    });
  });

  describe('ConfirmRequest', () => {
    const confirmRequestPayload: ConfirmRequestTypePayload = {
      payload: {},
      workFlowType: 'REMOVE_GOLD_RATE',
      id: 'abc123'
    };
    it('should call POST api method with correct url and params', () => {
      const { path, params } = getSentRequestUrl(
        confirmRequestPayload.workFlowType,
        sentRequestPayload.id
      );
      creditNoteService.confirmRequest(confirmRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        sentRequestPayload.creditNoteType
      );
      request.flush({});
    });
  });

  describe('LoadSentRequests', () => {
    const loadRequestPayload: LoadRequestsPayload = {
      workFlowType: 'REMOVE_GOLD_RATE',
      pageIndex: 0,
      pageSize: 10,
      payload: {}
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(CreditNoteAdaptor, 'getSentRequests').and.returnValue({});

      const { path, params } = getLoadSentRequestsUrl(
        loadRequestPayload.workFlowType,
        loadRequestPayload.pageIndex,
        loadRequestPayload.pageSize
      );
      creditNoteService.loadSentRequests(loadRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      // expect(request.request.params.get('workflowType')).toEqual(
      //   loadRequestPayload.workFlowType
      // );
      // expect(request.request.params.get('page').toString()).toEqual(
      //   loadRequestPayload.pageIndex.toString()
      // );
      // expect(request.request.params.get('size').toString()).toEqual(
      //   loadRequestPayload.pageSize.toString()
      // );
      request.flush({});
    });

    it('should call CreditNoteAdaptor getSentRequests method with correct  parameters', () => {
      spyOn(CreditNoteAdaptor, 'getSentRequests').and.returnValue({});

      const { path, params } = getLoadSentRequestsUrl(
        loadRequestPayload.workFlowType,
        loadRequestPayload.pageIndex,
        loadRequestPayload.pageSize
      );

      creditNoteService.loadSentRequests(loadRequestPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummySentRequestResponse);
      expect(CreditNoteAdaptor.getSentRequests).toHaveBeenCalledWith(
        dummySentRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CreditNoteAdaptor, 'getSentRequests').and.returnValue(
        sentRequestResponse
      );

      const { path, params } = getLoadSentRequestsUrl(
        loadRequestPayload.workFlowType,
        loadRequestPayload.pageIndex,
        loadRequestPayload.pageSize
      );

      creditNoteService.loadSentRequests(loadRequestPayload).subscribe(data => {
        expect(data).toEqual(sentRequestResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('LoadRequestById', () => {
    const payload = {
      processId: 'abc123',
      workFlowType: 'REMOVE_GOLD_RATE'
    };
    const sentRequestResponseById: SentRequestResponse = {
      docNo: 12,
      fiscalYear: 2021,
      cnType: 'ADVANCE',
      amount: '1000',
      custName: 'srinivas',
      reqDate: moment('123'),
      status: 'open',
      id: 'abc123',
      processId: 'abc123',
      requestorRemarks: 'good',
      frozenRateDetails: {},
      approvalStatus: 'open',
      createdDate: moment(123),
      custId: 'abc123',
      cnNumber: '12'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(CreditNoteAdaptor, 'getRequest').and.returnValue({});

      creditNoteService.loadRequestById(payload).subscribe();
      const { path, params } = getRequestUrl(
        payload.processId,
        payload.workFlowType
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('workflowType')).toEqual(
        payload.workFlowType
      );

      request.flush({});
    });

    it('should call CreditNoteAdaptor getRequest method with correct  parameters', () => {
      spyOn(CreditNoteAdaptor, 'getRequest').and.returnValue({});

      creditNoteService.loadRequestById(payload).subscribe();
      const { path, params } = getRequestUrl(
        payload.processId,
        payload.workFlowType
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(sentRequestResponseById);
      expect(CreditNoteAdaptor.getRequest).toHaveBeenCalledWith(
        sentRequestResponseById
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CreditNoteAdaptor, 'getRequest').and.returnValue(
        sentRequestResponseById
      );

      const { path, params } = getRequestUrl(
        payload.processId,
        payload.workFlowType
      );

      creditNoteService.loadRequestById(payload).subscribe(data => {
        expect(data).toEqual(sentRequestResponseById);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('CancelRequest', () => {
    const cancelRequestPayload = {
      remarks: 'good',
      id: '12',
      workFlowType: 'REMOVE_GOLD_RATE'
    };
    it('should call PUT api method with correct url and params', () => {
      const { path, params } = getCancelRequstUrl(
        cancelRequestPayload.id,
        cancelRequestPayload.workFlowType
      );
      creditNoteService.cancelRequest(cancelRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        cancelRequestPayload.workFlowType
      );
      request.flush({});
    });
  });

  describe('DownloadCN', () => {
    it('should call PATCH api method with correct url and params', () => {
      const { path, params } = getDownloadGHSUrl('1', 12);
      creditNoteService.downloadCN({ id: '1', ghsDocNo: 12 }).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('ghsDocNo')).toEqual('12');
      request.flush({});
    });
  });

  describe('TransferToEghs', () => {
    const transferToEghsPayload: TransferEghsPayload = {
      id: 'abc123',
      payload: {
        accountNumber: 12345678,
        fiscalYear: 2021,
        locationCode: 'CPD',
        remarks: 'good',
        transferAmount: 0
      }
    };
    it('should call PUT api method with correct url and params', () => {
      const path = getTransfetToEghsUrl(transferToEghsPayload.id);
      creditNoteService.transferToEghs(transferToEghsPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      request.flush({});
    });
  });

  // describe('LoadTransferedCNs', () => {
  //   const transferdCNs: TransferedCNS[] = [
  //     {
  //       creditNoteType: 'AdVANCE',
  //       amount: 1000,
  //       ghsDiscount: 12,
  //       docNo: 12,
  //       fiscalYear: 2021,
  //       customerName: 'srinivas',
  //       customerId: 12,
  //       mobileNumber: '9010462817',
  //       ulpId: '9010462817',
  //       status: 'open',
  //       ghsDocNo: '13'
  //     }
  //   ];
  //   const dummyTransferedCns = {
  //     results: transferdCNs,
  //     pageIndex: 0,
  //     pageSize: 10,
  //     totalElements: 1
  //   };

  //   it('should call GET api method with correct url and params', () => {
  //     const { path, params } = getTransferedCNsurl();
  //     creditNoteService.loadTransferedCNs().subscribe();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     expect(request.request.params.get('vendorCode')).toEqual('GHS');
  //     request.flush({});
  //   });

  //   it('should call CreditNoteAdaptor getTransferedCNs method with correct  parameters', () => {
  //     spyOn(CreditNoteAdaptor, 'getTransferedCNs').and.returnValue({});

  //     const path = getTransferedCNsurl().path;
  //     creditNoteService.loadTransferedCNs().subscribe();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });

  //     request.flush(dummyTransferedCns);
  //     expect(CreditNoteAdaptor.getTransferedCNs).toHaveBeenCalledWith(
  //       dummyTransferedCns
  //     );
  //   });

  // it('should return data mapped by adaptors', () => {
  //   spyOn(CreditNoteAdaptor, 'getTransferedCNs').and.returnValue({
  //     transferedCNs: transferdCNs,
  //     totalCount: 1
  //   });

  //   const { path, params } = getTransferedCNsurl();

  //   creditNoteService.loadTransferedCNs().subscribe(data => {
  //     expect(data).toEqual({
  //       transferedCNs: transferdCNs,
  //       totalCount: 1
  //     });
  //   });

  //   const request = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + path;
  //   });

  //   request.flush({});
  // });
  //});
  describe('calculateCnRefundAmount', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getCalculateCnRefundAmountRequestUrl('123');
      creditNoteService.calculateCnRefundAmount('123').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      request.flush({});
    });
  });
  describe('cancelAutoApprovedCn', () => {
    it('should call PUT api method with correct url and params', () => {
      const path = getCancelAutoApprovedCnRequestUrl(cancelCnRequestPayload.id);
      creditNoteService
        .cancelAutoApprovedCn(cancelCnRequestPayload)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      request.flush({});
    });
  });
  describe('cancelRequestApprovedCn', () => {
    it('should call PUT api method with correct url and params', () => {
      const path = getCancelRequestApprovedCnRequestUrl(
        cancelCnRequestPayload.id,
        cancelCnRequestPayload.creditNoteWorkFlowType
      );
      creditNoteService
        .cancelRequestApprovedCn(cancelCnRequestPayload)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        cancelCnRequestPayload.creditNoteWorkFlowType.toString()
      );
      request.flush({});
    });
  });
});
