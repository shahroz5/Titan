import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CREDIT_NOTE_TRANSFER_FEATURE_KEY } from './cn-transfer.reducer';
import { CreditNotetransferEffects } from './cn-transfer.effects';
import { CreditNoteTransferService } from '../credit-note-transfer.service';
import {
  ApproveOrRejectCnTransferPayaload,
  CNDetailsInfo,
  CnTransferSearchPayload,
  CnTransferSearchResponsePayload,
  cnTransferTabEnum,
  InwardCnPayload,
  LegacyCNTransferPayload,
  LegacyInwardTransferResponsePayload,
  LegacyOutwardTransferResponsePayload,
  LoadCnTransferRequestsPayload,
  LoadSelectedCnDetailsReqPayload,
  LocationSummaryList,
  RequestTransferPayload,
  SendRequestResponsePayload
} from '@poss-web/shared/models';
import {
  ApproveOrRejectCnTransfer,
  ApproveOrRejectCnTransferFailure,
  ApproveOrRejectCnTransferSuccess,
  GetCreditNoteDetailsById,
  GetCreditNoteDetailsByIdFailure,
  GetCreditNoteDetailsByIdSuccess,
  GetLocationCodes,
  GetLocationCodesFailure,
  GetLocationCodesSuccess,
  InwardCreditNote,
  InwardCreditNoteFailure,
  InwardCreditNoteSuccess,
  LegacyCNInwardTransfer,
  LegacyCNInwardTransferFailure,
  LegacyCNInwardTransferSuccess,
  LegacyCNOutwardTransfer,
  LegacyCNOutwardTransferFailure,
  LegacyCNOutwardTransferSuccess,
  LoadTransferRequests,
  LoadTransferRequestsFailure,
  LoadTransferRequestsSuccess,
  RaiseTransferRequest,
  RaiseTransferRequestFailure,
  RaiseTransferRequestSuccess,
  SearchCreditNotes,
  SearchCreditNotesFailure,
  SearchCreditNotesSuccess
} from './cn-transfer.actions';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
describe('Cn Transfer Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CreditNotetransferEffects;

  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const cnTransferServiceSpy = jasmine.createSpyObj<CreditNoteTransferService>([
    'searchCreditNotes',
    'getCreditNotesDetailsById',
    'raiseTransferRequest',
    'loadRequests',
    'inwardCn',
    'approveOrRejectCnTransferRequest',
    'legacyCNOutwardTransfer',
    'legacyCNInwardTransfer',
    'getLocationCodes'
  ]);
  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreditNotetransferEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [CREDIT_NOTE_TRANSFER_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: CreditNoteTransferService,
          useValue: cnTransferServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CreditNotetransferEffects);
  });
  describe('searchCustomer', () => {
    it('should return data of selected Customer', () => {
      const resPayload: LocationSummaryList[] = [
        { description: 'CPD', locationCode: 'CPD', isMigrated: true }
      ];
      const action = new GetLocationCodes();
      const outcome = new GetLocationCodesSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.getLocationCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getLocationCodes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GetLocationCodes();
      const error = new Error('some error');
      const outcome = new GetLocationCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.getLocationCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getLocationCodes$).toBeObservable(expected);
    });
  });
  describe('searchCreditNotes', () => {
    it('should return data of searchCreditNotes', () => {
      const reqPayload: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const resPayload: CnTransferSearchResponsePayload = {
        totalCount: 10,
        result: [
          {
            amount: 1000,
            creditNoteType: 'ADV',
            customerName: 'Joe',
            docDate: moment(),
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
      const action = new SearchCreditNotes(reqPayload);
      const outcome = new SearchCreditNotesSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.searchCreditNotes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCreditNotes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const action = new SearchCreditNotes(reqPayload);
      const error = new Error('some error');
      const outcome = new SearchCreditNotesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.searchCreditNotes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCreditNotes$).toBeObservable(expected);
    });
  });
  describe('loadSelectedCreditNoteDetailsById', () => {
    it('should return data of loadSelectedCreditNoteDetailsById', () => {
      const reqPayload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        id: '123456',
        srcBtqCode: 'PTU',
        taskId: '1234567'
      };
      const resPayload: CNDetailsInfo = {
        amount: 1000,
        approvalLevel: null,
        approvalStatus: 'PENDING',
        approverLocationCode: 'CPD',
        customerId: 60,
        docDate: moment(),
        id: '1234',
        locationCode: 'PTU',
        processId: '12345678',
        approverRemarks: 'remarks',
        creditNoteType: 'ADV',
        docNo: 444,
        mobileNumber: '9745512430',
        fiscalYear: 2021,
        status: 'PENDING',
        customerName: 'Joe',
        headerData: {},
        approvedDate: null,
        taskId: null,
        approvedBy: null,
        linkedTxnId: null,
        refDocNo: null,
        linkedTxnType: null,
        refDocType: null,
        requestedBy: null
      };
      const action = new GetCreditNoteDetailsById(reqPayload);
      const outcome = new GetCreditNoteDetailsByIdSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.getCreditNotesDetailsById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedCreditNoteDetailsById$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        id: '123456',
        srcBtqCode: 'PTU',
        taskId: '1234567'
      };
      const action = new GetCreditNoteDetailsById(reqPayload);
      const error = new Error('some error');
      const outcome = new GetCreditNoteDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.getCreditNotesDetailsById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedCreditNoteDetailsById$).toBeObservable(
        expected
      );
    });
  });
  describe('raiseTransferRequest', () => {
    it('should return data of raiseTransferRequest', () => {
      const reqPayload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const resPayload = { requestNo: '333' };
      const action = new RaiseTransferRequest(reqPayload);
      const outcome = new RaiseTransferRequestSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.raiseTransferRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.raiseTransferRequest$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const action = new RaiseTransferRequest(reqPayload);
      const error = new Error('some error');
      const outcome = new RaiseTransferRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.raiseTransferRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.raiseTransferRequest$).toBeObservable(expected);
    });
  });
  describe('CNOutwardTransfer', () => {
    it('should return data of LegacyCNOutwardTransfer', () => {
      const reqPayload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const resPayload: LegacyOutwardTransferResponsePayload = { status: true, errorMessage: '' };
      const action = new LegacyCNOutwardTransfer(reqPayload);
      const outcome = new LegacyCNOutwardTransferSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.legacyCNOutwardTransfer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.CNOutwardTransfer$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const action = new LegacyCNOutwardTransfer(reqPayload);
      const error = new Error('some error');
      const outcome = new LegacyCNOutwardTransferFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.legacyCNOutwardTransfer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.CNOutwardTransfer$).toBeObservable(expected);
    });
  });
  describe('CNInwardTransfer', () => {
    it('should return data of LegacyCNInwardTransfer', () => {
      const reqPayload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const resPayload: LegacyInwardTransferResponsePayload = { docNo: 1};
      const action = new LegacyCNInwardTransfer(reqPayload);
      const outcome = new LegacyCNInwardTransferSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.legacyCNInwardTransfer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.CNInwardTransfer$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'ABC'
      };
      const action = new LegacyCNInwardTransfer(reqPayload);
      const error = new Error('some error');
      const outcome = new LegacyCNInwardTransferFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.legacyCNInwardTransfer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.CNInwardTransfer$).toBeObservable(expected);
    });
  });
  describe('loadSentRequests', () => {
    it('should return data of loadSentRequests', () => {
      const reqPayload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const resPayload: SendRequestResponsePayload = {
        results: [
          {
            amount: 1000,
            approvalLevel: null,
            approvalStatus: 'PENDING',
            approverLocationCode: 'CPD',
            customerId: 60,
            docDate: moment(),
            id: '1234',
            locationCode: 'PTU',
            processId: '12345678',
            approverRemarks: 'remarks',
            creditNoteType: 'ADV',
            docNo: 444,
            mobileNumber: '9745512430',
            fiscalYear: 2021,
            status: 'PENDING',
            customerName: 'Joe',
            headerData: {},
            approvedDate: null,
            taskId: null,
            approvedBy: null,
            linkedTxnId: null,
            refDocNo: null,
            linkedTxnType: null,
            refDocType: null,
            requestedBy: null
          }
        ],
        count: 1
      };
      const action = new LoadTransferRequests(reqPayload);
      const outcome = new LoadTransferRequestsSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.loadRequests.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSentRequests$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const action = new LoadTransferRequests(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadTransferRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.loadRequests.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSentRequests$).toBeObservable(expected);
    });
  });
  describe('inwardCn', () => {
    it('should return data of inwardCn', () => {
      const reqPayload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CN_TRANSFER'
      };
      const resPayload: CNDetailsInfo = {
        amount: 1000,
        approvalLevel: null,
        approvalStatus: 'PENDING',
        approverLocationCode: 'CPD',
        customerId: 60,
        docDate: moment(),
        id: '1234',
        locationCode: 'PTU',
        processId: '12345678',
        approverRemarks: 'remarks',
        creditNoteType: 'ADV',
        docNo: 444,
        mobileNumber: '9745512430',
        fiscalYear: 2021,
        status: 'PENDING',
        customerName: 'Joe',
        headerData: {},
        approvedDate: null,
        taskId: null,
        approvedBy: null,
        linkedTxnId: null,
        refDocNo: null,
        linkedTxnType: null,
        refDocType: null,
        requestedBy: null
      };
      const action = new InwardCreditNote(reqPayload);
      const outcome = new InwardCreditNoteSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.inwardCn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.inwardCn$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CN_TRANSFER'
      };
      const action = new InwardCreditNote(reqPayload);
      const error = new Error('some error');
      const outcome = new InwardCreditNoteFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.inwardCn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.inwardCn$).toBeObservable(expected);
    });
  });
  describe('approveOrRejectCnRequest', () => {
    it('should return data of approveOrRejectCnRequest', () => {
      const reqPayload: ApproveOrRejectCnTransferPayaload = {
        id: '1234',
        remarksDto: { remarks: 'test' },
        status: 'APPROVE',
        workflowType: 'CN_TRANSFER'
      };
      const resPayload = true;
      const action = new ApproveOrRejectCnTransfer(reqPayload);
      const outcome = new ApproveOrRejectCnTransferSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      cnTransferServiceSpy.approveOrRejectCnTransferRequest.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.approveOrRejectCnRequest$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const reqPayload: ApproveOrRejectCnTransferPayaload = {
        id: '1234',
        remarksDto: { remarks: 'test' },
        status: 'APPROVE',
        workflowType: 'CN_TRANSFER'
      };
      const action = new ApproveOrRejectCnTransfer(reqPayload);
      const error = new Error('some error');
      const outcome = new ApproveOrRejectCnTransferFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnTransferServiceSpy.approveOrRejectCnTransferRequest.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.approveOrRejectCnRequest$).toBeObservable(expected);
    });
  });
});
