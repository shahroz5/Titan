import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  CancelCnRequestPayload,
  CnRefundAmountDetails,
  ConfirmRequestTypePayload,
  CreditNoteDetails,
  CreditNoteSearch,
  CreditNoteSearchResult,
  LoadRequestsPayload,
  SentRequestPayload,
  SentRequestResponse,
  TransferedCNS,
  TransferEghsPayload,
  TransferToEghs
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { CreditNoteService } from '../cn.service';
import {
  CalculateCnRefundAmount,
  CalculateCnRefundAmountFailure,
  CalculateCnRefundAmountSuccess,
  CancelAutoApprovedCn,
  CancelAutoApprovedCnFailure,
  CancelAutoApprovedCnSuccess,
  CancelRequest,
  CancelRequestApprovedCn,
  CancelRequestApprovedCnFailure,
  CancelRequestApprovedCnSuccess,
  CancelRequestFailure,
  CancelRequestSuccess,
  ConfirmRequestType,
  ConfirmRequestTypeFailure,
  ConfirmRequestTypeSuccess,
  CreditNoteDetailsById,
  CreditNoteDetailsByIdFailure,
  CreditNoteDetailsByIdSuccess,
  DownloadCN,
  DownloadCNFailure,
  DownloadCNSuccess,
  LoadRequestById,
  LoadRequestByIdFailure,
  LoadRequestByIdSuccess,
  LoadSentRequests,
  LoadSentRequestsFailure,
  LoadSentRequestsSuccess,
  LoadTransferedCNS,
  LoadTransferedCNSFailure,
  LoadTransferedCNSSuccess,
  RaiseRequest,
  RaiseRequestFailure,
  RaiseRequestSuccess,
  SearchCreditNotes,
  SearchCreditNotesFailure,
  SearchCreditNotesSuccess,
  SearchRequst,
  SearchRequstFailure,
  SearchRequstSuccess,
  TransfetToEghs,
  TransfetToEghsFailure,
  TransfetToEghsSuccess
} from './cn.actions';
import { CreditNoteEffects } from './cn.effects';

const calculateCnRefundAmountSuccess: CnRefundAmountDetails = {
  amount: 12345,
  deductionPercentage: '2',
  fullAdvCNPaymentMode: 'CASH',
  netRefundAmount: 12245,
  allowedRefundPaymentModes: [
    {
      description: 'CASH',
      value: 'CASH'
    }
  ],
  refundDeductionAmount: 100,
  totalTax: 100,
  utilisedAmount: 100
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

describe('CreditNote Effects Testing Suite', () => {
  const dummyCreditNoteSearchResult: CreditNoteSearchResult[] = [
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
  const searchPayload: CreditNoteSearch = {
    cnNumber: '123',
    mobileNumber: '9010462817',
    fiscalYear: '2021'
  };

  const loadRequestPayload: LoadRequestsPayload = {
    workFlowType: 'REMOVE_GOLD_RATE',
    pageIndex: 0,
    pageSize: 10,
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

  const confirmRequestPayload: ConfirmRequestTypePayload = {
    payload: {},
    workFlowType: 'REMOVE_GOLD_RATE',
    id: 'abc123'
  };
  const sentRequestPayload: SentRequestPayload = {
    creditNoteType: 'REMOVE_GOLD_RATE',
    id: 'abc123',
    payload: {}
  };
  let actions$: Observable<any>;
  let effect: CreditNoteEffects;

  const initialState = {};
  const creditNoteServiceSpy = jasmine.createSpyObj<CreditNoteService>([
    'searchCreditNotes',
    'loadCreditNote',
    'raiseRequest',
    'loadSentRequests',
    'confirmRequest',
    'loadRequestById',
    'transferToEghs',
    'loadTransferedCNs',
    'downloadCN',
    'cancelRequest',
    'calculateCnRefundAmount',
    'cancelAutoApprovedCn',
    'cancelRequestApprovedCn'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreditNoteEffects,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: CreditNoteService,
          useValue: creditNoteServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CreditNoteEffects);
  });

  describe('SearchCreditNotes', () => {
    it('should return a stream with SearchCreditNotes', () => {
      const action = new SearchCreditNotes(searchPayload);
      const outcome = new SearchCreditNotesSuccess({
        searchResult: dummyCreditNoteSearchResult,
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { searchResult: dummyCreditNoteSearchResult, count: 1 }
      });
      creditNoteServiceSpy.searchCreditNotes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCreditNote$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchCreditNotes(searchPayload);
      const error = new Error('some error');
      const outcome = new SearchCreditNotesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.searchCreditNotes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCreditNote$).toBeObservable(expected);
    });
  });

  describe('CreditNoteDetailsById', () => {
    it('should return a stream with CreditNoteDetailsById', () => {
      const action = new CreditNoteDetailsById('123');
      const outcome = new CreditNoteDetailsByIdSuccess(dummyCreditNoteDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCreditNoteDetails });
      creditNoteServiceSpy.loadCreditNote.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.creditNoteDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreditNoteDetailsById('123');
      const error = new Error('some error');
      const outcome = new CreditNoteDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.loadCreditNote.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.creditNoteDetailsById$).toBeObservable(expected);
    });
  });

  describe('RaiseRequest', () => {
    it('should return a stream with RaiseRequest', () => {
      const action = new RaiseRequest(sentRequestPayload);
      const outcome = new RaiseRequestSuccess('123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: '123' });
      creditNoteServiceSpy.raiseRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.sentRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new RaiseRequest(sentRequestPayload);
      const error = new Error('some error');
      const outcome = new RaiseRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.raiseRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.sentRequest$).toBeObservable(expected);
    });
  });

  describe('LoadSentRequests', () => {
    it('should return a stream with LoadSentRequests', () => {
      const action = new LoadSentRequests(loadRequestPayload);
      const outcome = new LoadSentRequestsSuccess(sentRequestResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: sentRequestResponse });
      creditNoteServiceSpy.loadSentRequests.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSentRequests$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSentRequests(loadRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadSentRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.loadSentRequests.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSentRequests$).toBeObservable(expected);
    });
  });

  describe('SearchRequst', () => {
    it('should return a stream with SearchRequst', () => {
      const action = new SearchRequst(loadRequestPayload);
      const outcome = new SearchRequstSuccess(sentRequestResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: sentRequestResponse });
      creditNoteServiceSpy.loadSentRequests.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchRequst(loadRequestPayload);
      const error = new Error('some error');
      const outcome = new SearchRequstFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.loadSentRequests.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchRequest$).toBeObservable(expected);
    });
  });

  describe('ConfirmRequestType', () => {
    it('should return a stream with ConfirmRequestType', () => {
      const action = new ConfirmRequestType(confirmRequestPayload);
      const outcome = new ConfirmRequestTypeSuccess(12);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 12 });
      creditNoteServiceSpy.confirmRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmRequestType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmRequestType(confirmRequestPayload);
      const error = new Error('some error');
      const outcome = new ConfirmRequestTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.confirmRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmRequestType$).toBeObservable(expected);
    });
  });

  describe('LoadRequestById', () => {
    const payload = { processId: 'abc123', workFlowType: 'REMOVE_GOLD_RATE' };
    it('should return a stream with LoadRequestById', () => {
      const action = new LoadRequestById(payload);
      const outcome = new LoadRequestByIdSuccess(sentRequestResponseById);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: sentRequestResponseById });
      creditNoteServiceSpy.loadRequestById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestById(payload);
      const error = new Error('some error');
      const outcome = new LoadRequestByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.loadRequestById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequest$).toBeObservable(expected);
    });
  });

  describe('TransfetToEghs', () => {
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
    const response: TransferToEghs = {
      balanceAmtCnDocNo: 123,
      amount: 12,
      cashCollected: 10,
      docNo: 12,
      id: 'abc123'
    };
    it('should return a stream with TransfetToEghs', () => {
      const action = new TransfetToEghs(transferToEghsPayload);
      const outcome = new TransfetToEghsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      creditNoteServiceSpy.transferToEghs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.transfetToEghs$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new TransfetToEghs(transferToEghsPayload);
      const error = new Error('some error');
      const outcome = new TransfetToEghsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.transferToEghs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.transfetToEghs$).toBeObservable(expected);
    });
  });

  describe('LoadTransferedCNS', () => {
    const transferdCNs: TransferedCNS[] = [
      {
        creditNoteType: 'AdVANCE',
        amount: 1000,
        ghsDiscount: 12,
        docNo: 12,
        fiscalYear: 2021,
        customerName: 'srinivas',
        customerId: 12,
        mobileNumber: '9010462817',
        ulpId: '9010462817',
        status: 'open',
        ghsDocNo: '13'
      }
    ];

    it('should return a stream with LoadTransferedCNS', () => {
      const action = new LoadTransferedCNS();
      const outcome = new LoadTransferedCNSSuccess({
        transferedCNs: transferdCNs,
        totalCount: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          transferedCNs: transferdCNs,
          totalCount: 1
        }
      });
      creditNoteServiceSpy.loadTransferedCNs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTransferedCNS$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTransferedCNS();
      const error = new Error('some error');
      const outcome = new LoadTransferedCNSFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.loadTransferedCNs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTransferedCNS$).toBeObservable(expected);
    });
  });

  describe('DownloadCN', () => {
    it('should return a stream with DownloadCN', () => {
      const action = new DownloadCN({ id: '12', ghsDocNo: 12 });
      const outcome = new DownloadCNSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      creditNoteServiceSpy.downloadCN.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.downloadCN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DownloadCN({ id: '12', ghsDocNo: 12 });
      const error = new Error('some error');
      const outcome = new DownloadCNFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.downloadCN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.downloadCN$).toBeObservable(expected);
    });
  });

  describe('CancelRequest', () => {
    it('should return a stream with CancelRequest', () => {
      const action = new CancelRequest({
        remarks: 'goood',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
      const outcome = new CancelRequestSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      creditNoteServiceSpy.cancelRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cancelRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelRequest({
        remarks: 'goood',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
      const error = new Error('some error');
      const outcome = new CancelRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.cancelRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelRequest$).toBeObservable(expected);
    });
  });

  describe('CalculateCnRefundAmount', () => {
    it('should return a stream with CalculateCnRefundAmount', () => {
      const action = new CalculateCnRefundAmount('123');
      const outcome = new CalculateCnRefundAmountSuccess(
        calculateCnRefundAmountSuccess
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: calculateCnRefundAmountSuccess
      });
      creditNoteServiceSpy.calculateCnRefundAmount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.calculateCnRefundAmount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CalculateCnRefundAmount('123');
      const error = new Error('some error');
      const outcome = new CalculateCnRefundAmountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.calculateCnRefundAmount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.calculateCnRefundAmount$).toBeObservable(expected);
    });
  });
  describe('CancelAutoApprovedCn', () => {
    it('should return a stream with CancelAutoApprovedCn', () => {
      const action = new CancelAutoApprovedCn(cancelCnRequestPayload);
      const outcome = new CancelAutoApprovedCnSuccess(123);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 123
      });
      creditNoteServiceSpy.cancelAutoApprovedCn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cancelAutoApprovedCn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelAutoApprovedCn(cancelCnRequestPayload);
      const error = new Error('some error');
      const outcome = new CancelAutoApprovedCnFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.cancelAutoApprovedCn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelAutoApprovedCn$).toBeObservable(expected);
    });
  });
  describe('CancelRequestApprovedCn', () => {
    it('should return a stream with CancelRequestApprovedCn', () => {
      const action = new CancelRequestApprovedCn(cancelCnRequestPayload);
      const outcome = new CancelRequestApprovedCnSuccess(123);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 123
      });
      creditNoteServiceSpy.cancelRequestApprovedCn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cancelRequestApprovedCn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelRequestApprovedCn(cancelCnRequestPayload);
      const error = new Error('some error');
      const outcome = new CancelRequestApprovedCnFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      creditNoteServiceSpy.cancelRequestApprovedCn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelRequestApprovedCn$).toBeObservable(expected);
    });
  });
});
