import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApproveOrRejectCnTransferPayaload,
  CnTransferSearchPayload,
  CnTransferSearchResponsePayload,
  cnTransferTabEnum,
  InwardCnPayload,
  LegacyCNTransferPayload,
  LoadCnTransferRequestsPayload,
  LoadSelectedCnDetailsReqPayload,
  RequestTransferPayload
} from '@poss-web/shared/models';
import { CreditNoteTransferAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCnTransferApprovalUrl,
  getCnTransferRequestUrl,
  getCreditNoteTransferSearchDetailsUrl,
  getCreditNoteTransferSearchUrl,
  getLegacyCNInwardTransferUrl,
  getLegacyCNOutwardTransferUrl,
  getLoadCreditNoteReceivedRequestsDetailsByIdUrl,
  getLoadCreditNoteReceivedRequestsUrl,
  getLoadCreditNoteSentRequestDetailsByIdUrl,
  getLoadCreditNoteSentRequestsUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { CreditNoteTransferService } from './credit-note-transfer.service';

describe('CreditNoteTransferService', () => {
  let service: CreditNoteTransferService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  const dummyCnSearchresult: CnTransferSearchResponsePayload = {
    totalCount: 10,
    result: [
      {
        amount: 1000,
        creditNoteType: 'ADV',
        customerName: 'Joe',
        docDate: moment(1626394585),
        docNo: 10,
        fiscalYear: 2021,
        id: '12345678',
        linkedTxnId: null,
        linkedTxnType: null,
        locationCode: 'PTU',
        mobileNumber: '9745512430',
        status: 'OPEN'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CreditNoteTransferService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CreditNoteTransferService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('searchCreditNotes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNotetransferSearchResult'
      ).and.returnValue({});

      const reqPaylod: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const { path, params } = getCreditNoteTransferSearchUrl(
        reqPaylod.srcBtqCode,
        reqPaylod.docNo,
        reqPaylod.fiscalYear,
        reqPaylod.mobileNo,
        reqPaylod.page,
        reqPaylod.sort
      );
      service.searchCreditNotes(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('locationCode')).toEqual('PTU');
      expect(request.request.params.get('docNo')).toEqual('10');
      expect(request.request.params.get('fiscalYear')).toEqual('2021');

      request.flush({});
    });
    it('should call getCreditNotetransferSearchResult CreditNoteTransferAdaptor adaptor method with correct arguments', () => {
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNotetransferSearchResult'
      ).and.returnValue({});
      const reqPaylod: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const { path, params } = getCreditNoteTransferSearchUrl(
        reqPaylod.srcBtqCode,
        reqPaylod.docNo,
        reqPaylod.fiscalYear,
        reqPaylod.mobileNo,
        reqPaylod.page,
        reqPaylod.sort
      );
      service.searchCreditNotes(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCnSearchresult);
      expect(
        CreditNoteTransferAdaptor.getCreditNotetransferSearchResult
      ).toHaveBeenCalledWith(dummyCnSearchresult);
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNotetransferSearchResult'
      ).and.returnValue(dummyCnSearchresult);
      const reqPaylod: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const path = getCreditNoteTransferSearchUrl(
        reqPaylod.srcBtqCode,
        reqPaylod.docNo,
        reqPaylod.fiscalYear,
        reqPaylod.mobileNo,
        reqPaylod.page,
        reqPaylod.sort
      ).path;

      service.searchCreditNotes(reqPaylod).subscribe(data => {
        expect(data).toEqual(dummyCnSearchresult);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('getCreditNotesDetailsById', () => {
    it('should call GET api method with correct url and params', () => {
      const reqPayload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SEARCH,
        id: '123456',
        srcBtqCode: 'PTU'
      };
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNoteTransferSearchDetailsData'
      ).and.returnValue({});

      const { path, params } = getCreditNoteTransferSearchDetailsUrl(
        reqPayload.id,
        reqPayload.srcBtqCode
      );
      service.getCreditNotesDetailsById(reqPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('locationCode')).toEqual('PTU');

      request.flush({});
    });
    it('should call GET api method with correct url and params', () => {
      const reqPayload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        id: '123456',
        srcBtqCode: 'PTU',
        workflowType: 'CN_TRANSFER'
      };
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNoteTransferSearchDetailsData'
      ).and.returnValue({});

      const { path, params } = getLoadCreditNoteSentRequestDetailsByIdUrl(
        reqPayload.id,
        reqPayload.workflowType
      );
      service.getCreditNotesDetailsById(reqPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('workflowType')).toEqual('CN_TRANSFER');

      request.flush({});
    });
    it('should call GET api method with correct url and params', () => {
      const reqPayload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.RECEIVED_REQUESTS,
        id: '123456',
        taskId: '123',
        taskName: 'CN_TRANSFER',
        workflowType: 'CN_TRANSFER'
      };
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNoteTransferSearchDetailsData'
      ).and.returnValue({});

      const { path, params } = getLoadCreditNoteReceivedRequestsDetailsByIdUrl(
        reqPayload.id,
        reqPayload.taskId,
        reqPayload.taskName,
        reqPayload.workflowType
      );
      service.getCreditNotesDetailsById(reqPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('workflowType')).toEqual('CN_TRANSFER');
      expect(request.request.params.get('processId')).toEqual('123456');
      expect(request.request.params.get('taskName')).toEqual('CN_TRANSFER');

      request.flush({});
    });
  });
  describe('raiseTransferRequest', () => {
    it('should call POST api method with correct url and params', () => {
      // spyOn(
      //   CreditNoteTransferAdaptor,
      //   'getCreditNotetransferSearchResult'
      // ).and.returnValue({});

      const payload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const { path, params } = getCnTransferRequestUrl(
        payload.id,
        'CREDIT_NOTE_TRANSFER'
      );
      service.raiseTransferRequest(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        'CREDIT_NOTE_TRANSFER'
      );
      request.flush({});
    });
  });
  describe('legacyCNOutwardTransfer', () => {
    it('should call POST api method with correct url and params', () => {

      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const { path, params } = getLegacyCNOutwardTransferUrl(
        payload.id,
        payload.locationCode
      );
      service.legacyCNOutwardTransfer(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('id')).toEqual(
        '123456'
      );
      request.flush({});
    });
  });
  describe('legacyCNInwardTransfer', () => {
    it('should call POST api method with correct url and params', () => {

      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const { path, params } = getLegacyCNInwardTransferUrl(
        payload.id,
        payload.locationCode
      );
      service.legacyCNInwardTransfer(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('srcLocationCode')).toEqual(
        'ABC'
      );
      request.flush({});
    });
  });
  describe('loadRequests', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(CreditNoteTransferAdaptor, 'getRequestsDetails').and.returnValue(
        {}
      );

      const payload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        workflowType: 'CREDIT_NOTE_TRANSFER',
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const { path, params } = getLoadCreditNoteSentRequestsUrl(
        payload.workflowType,
        payload.page,
        payload.size,
        payload.approvalStatus
      );
      service.loadRequests(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('workflowType')).toEqual(
        'CREDIT_NOTE_TRANSFER'
      );
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('10');
      expect(request.request.params.get('approvalStatus')).toEqual('PENDING');

      request.flush({});
    });
    it('should call POST api method with correct url and params', () => {
      spyOn(CreditNoteTransferAdaptor, 'getRequestsDetails').and.returnValue(
        {}
      );

      const payload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.RECEIVED_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        workflowType: 'CREDIT_NOTE_TRANSFER',
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const { path, params } = getLoadCreditNoteReceivedRequestsUrl(
        payload.workflowType,
        payload.page,
        payload.size,
        payload.approvalStatus
      );
      service.loadRequests(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('workflowType')).toEqual(
        'CREDIT_NOTE_TRANSFER'
      );
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('10');
      expect(request.request.params.get('approvalStatus')).toEqual('PENDING');

      request.flush({});
    });
  });
  describe('inwardCn', () => {
    it('should call PUT api method with correct url and params', () => {
      spyOn(
        CreditNoteTransferAdaptor,
        'getCreditNoteTransferSearchDetailsData'
      ).and.returnValue({});

      const payload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CREDIT_NOTE_TRANSFER'
      };
      const { path, params } = getCnTransferApprovalUrl(
        payload.id,
        payload.workflowType
      );
      service.inwardCn(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        'CREDIT_NOTE_TRANSFER'
      );

      request.flush({});
    });
  });
  describe('approveOrRejectCnTransferRequest', () => {
    it('should call POST api method with correct url and params', () => {
      const payload: ApproveOrRejectCnTransferPayaload = {
        id: '1234',
        remarksDto: { remarks: 'test' },
        status: 'APPROVE',
        workflowType: 'CN_TRANSFER'
      };
      const { path, params } = getCnTransferApprovalUrl(
        payload.id,
        payload.workflowType,
        payload.status
      );
      service.approveOrRejectCnTransferRequest(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('creditNoteWorkFlowType')).toEqual(
        'CN_TRANSFER'
      );
      expect(request.request.params.get('status')).toEqual('APPROVE');

      request.flush({});
    });
  });
});
