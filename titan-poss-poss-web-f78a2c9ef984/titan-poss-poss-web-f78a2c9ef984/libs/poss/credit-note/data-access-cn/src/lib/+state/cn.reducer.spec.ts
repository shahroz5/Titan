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
import * as moment from 'moment';
import * as actions from './cn.actions';
import { sentRequestAdaptor, transferedCNsAdaptor } from './cn.entity';
import { CreditNoteReducer, initialState } from './cn.reducer';
import { CreditNoteState } from './cn.state';
describe('CreditNoteReducer Testing Suite', () => {
  const testState = initialState;
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
  const searchPayload: CreditNoteSearch = {
    cnNumber: '12',
    mobileNumber: '9010462817',
    fiscalYear: '2021'
  };

  const loadRequestPayload: LoadRequestsPayload = {
    workFlowType: 'REMOVE_GOLD_RATE',
    pageIndex: 0,
    pageSize: 10,
    payload: {}
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

  describe('Testing CreditNoteSearch', () => {
    beforeEach(() => {});
    it('SearchCreditNotes should return isLoading=true,error=null', () => {
      const action = new actions.SearchCreditNotes(searchPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchCreditNotesSuccess should return success response', () => {
      const response = {
        searchResult: dummyCreditNoteSearchResult,
        count: 1
      };
      const action = new actions.SearchCreditNotesSuccess(response);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.creditNoteSearchResult).toBe(response.searchResult);
      expect(result.totalElements).toBe(response.count);
    });

    it('SearchCreditNotesFailure should return error', () => {
      const action = new actions.SearchCreditNotesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing CreditNoteDetailsById', () => {
    beforeEach(() => {});
    it('CreditNoteDetailsById should return proper state', () => {
      const action = new actions.CreditNoteDetailsById('abc123');

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('CreditNoteDetailsByIdSuccess should return success response', () => {
      const action = new actions.CreditNoteDetailsByIdSuccess(
        dummyCreditNoteDetails
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.creditNoteDetails).toBe(dummyCreditNoteDetails);
    });

    it('CreditNoteDetailsByIdFailure should return error', () => {
      const action = new actions.CreditNoteDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing RaiseRequest', () => {
    beforeEach(() => {});
    it('RaiseRequest should return proper state', () => {
      const action = new actions.RaiseRequest(sentRequestPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('RaiseRequestSuccess should return success response', () => {
      const action = new actions.RaiseRequestSuccess('abc123');

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.requestNo).toBe('abc123');
    });

    it('RaiseRequestFailure should return error', () => {
      const action = new actions.RaiseRequestFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing ResetListPage', () => {
    beforeEach(() => {});
    it('RaiseRequest should return proper state', () => {
      const action = new actions.ResetListPage();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.creditNoteSearchResult.length).toBe(0);
      expect(result.creditNoteDetails).toBe(null);
      expect(result.requestNo).toBe(null);
      expect(result.search.cnNumber).toBe('');
      expect(result.search.mobileNumber).toBe('');
      expect(result.search.fiscalYear).toBe('');
      expect(result.sentRequests.ids.length).toBe(0);
      expect(result.searchRequests.ids.length).toBe(0);
      expect(result.count).toBe(0);
      expect(result.hasSearched).toBe(false);
    });
  });

  describe('Testing LoadSentRequests', () => {
    beforeEach(() => {});
    it('LoadSentRequests should return proper state', () => {
      const action = new actions.LoadSentRequests(loadRequestPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadSentRequestsSuccess should return success response', () => {
      const action = new actions.LoadSentRequestsSuccess(sentRequestResponse);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(false);
      expect(result.count).toBe(sentRequestResponse.count);
    });

    it('LoadSentRequestsFailure should return error', () => {
      const action = new actions.LoadSentRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing ResetDetailPage', () => {
    beforeEach(() => {});
    it('ResetDetailPage should return proper state', () => {
      const action = new actions.ResetDetailPage();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.creditNoteDetails).toBe(null);
      expect(result.requestNo).toBe(null);
      expect(result.request).toBe(null);
      expect(result.cnNumber).toBe(null);
    });

    it('ResetRequests should return proper state', () => {
      const action = new actions.ResetRequests();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.sentRequests.ids.length).toBe(0);
    });
  });

  describe('Testing SearchRequst', () => {
    beforeEach(() => {});
    it('SearchRequst should return proper state', () => {
      const action = new actions.SearchRequst(loadRequestPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSearched).toBe(false);
      expect(result.searchRequests.ids.length).toBe(0);
      expect(result.sentRequests.ids.length).toBe(0);
      expect(result.error).toBe(null);
    });
    it('SearchRequstSuccess should return success response', () => {
      const newState = {
        ...testState,
        searchRequests: sentRequestAdaptor.setAll(
          sentRequestResponse.requestSentResponse,
          testState.searchRequests
        )
      };
      const action = new actions.SearchRequstSuccess(sentRequestResponse);

      const result: CreditNoteState = CreditNoteReducer(newState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(true);
      expect(result.count).toBe(1);
      expect(result.searchRequests.ids.length).toBe(1);
    });

    it('LoadSentRequestsFailure should return error', () => {
      const action = new actions.SearchRequstFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSearched).toEqual(false);
    });
  });

  describe('Testing ConfirmRequestType', () => {
    beforeEach(() => {});
    it('ConfirmRequestType should return proper state', () => {
      const confirmRequestPayload: ConfirmRequestTypePayload = {
        payload: {},
        workFlowType: 'REMOVE_GOLD_RATE',
        id: 'abc123'
      };
      const action = new actions.ConfirmRequestType(confirmRequestPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.cnNumber).toBe(null);
    });
    it('ConfirmRequestTypeSuccess should return success response', () => {
      const action = new actions.ConfirmRequestTypeSuccess(12);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.cnNumber).toBe(12);
    });

    it('ConfirmRequestTypeFailure should return error', () => {
      const action = new actions.ConfirmRequestTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });

    it('StoreRequestType should return error', () => {
      const action = new actions.StoreRequestType('RemoveGoldRate');

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.requestType).toEqual('RemoveGoldRate');
    });
  });

  describe('Testing LoadRequestById', () => {
    beforeEach(() => {});
    it('LoadRequestById should return proper state', () => {
      const action = new actions.LoadRequestById({
        processId: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadRequestByIdSuccess should return success response', () => {
      const action = new actions.LoadRequestByIdSuccess(
        sentRequestResponseById
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.request).toBe(sentRequestResponseById);
    });

    it('LoadRequestByIdFailure should return error', () => {
      const action = new actions.LoadRequestByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing StoreSearch', () => {
    beforeEach(() => {});
    it('LoadRequestById should return proper state', () => {
      const action = new actions.StoreSearch(searchPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.search.cnNumber).toBe(searchPayload.cnNumber);
      expect(result.search.mobileNumber).toBe(searchPayload.mobileNumber);
      expect(result.search.fiscalYear).toBe(searchPayload.fiscalYear);
    });
  });

  describe('Testing TransfetToEghs', () => {
    beforeEach(() => {});
    it('TransfetToEghs should return proper state', () => {
      const action = new actions.TransfetToEghs(transferToEghsPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.count).toBe(0);
      expect(result.searchRequests.ids.length).toBe(0);
    });
    it('TransfetToEghsSuccess should return success response', () => {
      const payload: TransferToEghs = {
        balanceAmtCnDocNo: 123,
        amount: 12,
        cashCollected: 10,
        docNo: 12,
        id: 'abc123'
      };
      const action = new actions.TransfetToEghsSuccess(payload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.transferToEghs).toBe(payload);
    });

    it('TransfetToEghsFailure should return error', () => {
      const action = new actions.TransfetToEghsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadTransferedCNS', () => {
    beforeEach(() => {});
    it('LoadTransferedCNS should return proper state', () => {
      const action = new actions.LoadTransferedCNS();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadTransferedCNSSuccess should return success response', () => {
      const response = {
        transferedCNs: transferdCNs,
        totalCount: 1
      };
      const newState = {
        ...testState,
        transferdCNs: transferedCNsAdaptor.setAll(
          response.transferedCNs,
          testState.transferedCNs
        )
      };

      const action = new actions.LoadTransferedCNSSuccess(response);

      const result: CreditNoteState = CreditNoteReducer(newState, action);

      expect(result.isLoading).toBe(false);
      expect(result.totalCount).toBe(response.totalCount);
      expect(result.transferedCNs.ids.length).toBe(1);
    });

    it('LoadTransferedCNSFailure should return error', () => {
      const action = new actions.LoadTransferedCNSFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing DownloadCN', () => {
    beforeEach(() => {});
    it('DownloadCN should return proper state', () => {
      const action = new actions.DownloadCN({ id: 'abc123', ghsDocNo: 12 });

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.count).toBe(0);
      expect(result.searchRequests.ids.length).toBe(0);
    });
    it('DownloadCNSuccesss should return success response', () => {
      const action = new actions.DownloadCNSuccess();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.downloadCN).toBe(true);
    });

    it('DownloadCNFailure should return error', () => {
      const action = new actions.DownloadCNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.downloadCN).toEqual(false);
    });
  });

  describe('Testing CancelRequest', () => {
    beforeEach(() => {});
    it('CancelRequest should return proper state', () => {
      const action = new actions.CancelRequest({
        remarks: 'good',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasCancelled).toBe(false);
    });
    it('CancelRequestSuccess should return success response', () => {
      const action = new actions.CancelRequestSuccess();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasCancelled).toBe(true);
    });

    it('CancelRequestFailure should return error', () => {
      const action = new actions.CancelRequestFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasCancelled).toEqual(false);
    });

    it('ResetSearch should return success response', () => {
      const action = new actions.ResetSearch();

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.hasCancelled).toBe(false);
      expect(result.searchRequests.ids.length).toBe(0);
    });
  });

  describe('Testing CalculateCnRefundAmount', () => {
    beforeEach(() => {});
    it('CalculateCnRefundAmount should return proper state', () => {
      const action = new actions.CalculateCnRefundAmount('123');

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.refundAmountDetails).toBe(null);
    });
    it('CalculateCnRefundAmountSuccess should return success response', () => {
      const action = new actions.CalculateCnRefundAmountSuccess(
        calculateCnRefundAmountSuccess
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.refundAmountDetails).toBe(action.payload);
    });

    it('CalculateCnRefundAmountFailure should return error', () => {
      const action = new actions.CalculateCnRefundAmountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.refundAmountDetails).toEqual(null);
    });
  });
  describe('Testing CancelAutoApprovedCn', () => {
    beforeEach(() => {});
    it('CancelAutoApprovedCn should return proper state', () => {
      const action = new actions.CancelAutoApprovedCn(cancelCnRequestPayload);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.cnNumber).toBe(null);
    });
    it('CancelAutoApprovedCnSuccess should return success response', () => {
      const action = new actions.CancelAutoApprovedCnSuccess(123);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.cnNumber).toBe(action.payload);
    });

    it('CancelAutoApprovedCnFailure should return error', () => {
      const action = new actions.CancelAutoApprovedCnFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.cnNumber).toEqual(null);
    });
  });
  describe('Testing CancelRequestApprovedCn', () => {
    beforeEach(() => {});
    it('CancelRequestApprovedCn should return proper state', () => {
      const action = new actions.CancelRequestApprovedCn(
        cancelCnRequestPayload
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.cnNumber).toBe(null);
    });
    it('CancelRequestApprovedCnSuccess should return success response', () => {
      const action = new actions.CancelRequestApprovedCnSuccess(123);

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.cnNumber).toBe(action.payload);
    });

    it('CancelRequestApprovedCnFailure should return error', () => {
      const action = new actions.CancelRequestApprovedCnFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CreditNoteState = CreditNoteReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.cnNumber).toEqual(null);
    });
  });
});
