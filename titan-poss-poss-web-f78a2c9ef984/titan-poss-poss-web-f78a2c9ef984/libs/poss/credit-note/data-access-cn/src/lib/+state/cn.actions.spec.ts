import {
  CancelCnRequestPayload,
  CnRefundAmountDetails,
  ConfirmRequestTypePayload,
  CreditNoteDetails,
  CreditNoteSearch,
  CreditNoteSearchResult,
  CustomErrors,
  LoadRequestsPayload,
  SentRequestPayload,
  SentRequestResponse,
  TransferedCNS,
  TransferEghsPayload,
  TransferToEghs
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
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
  CreditNoteActionTypes,
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
  ResetDetailPage,
  ResetListPage,
  ResetRequests,
  ResetSearch,
  SearchCreditNotes,
  SearchCreditNotesFailure,
  SearchCreditNotesSuccess,
  SearchRequst,
  SearchRequstFailure,
  SearchRequstSuccess,
  StoreRequestType,
  StoreSearch,
  TransfetToEghs,
  TransfetToEghsFailure,
  TransfetToEghsSuccess
} from './cn.actions';

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

describe('CreditNote Testing Suite', () => {
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
  describe('SearchCreditNotes Action Test Cases', () => {
    it('should check correct type is used for SearchCreditNotes action ', () => {
      const action = new SearchCreditNotes(searchPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.SEARCH_CREDIT_NOTES);
      expect(action.payload).toEqual(searchPayload);
    });
    it('should check correct type is used for  LoadCFAProductsSuccess action ', () => {
      const action = new SearchCreditNotesSuccess({
        searchResult: dummyCreditNoteSearchResult,
        count: 0
      });

      expect(action.type).toEqual(
        CreditNoteActionTypes.SEARCH_CREDIT_NOTES_SUCCESS
      );
      expect(action.payload).toEqual({
        searchResult: dummyCreditNoteSearchResult,
        count: 0
      });
    });
    it('should check correct type is used for SearchCreditNotesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCreditNotesFailure(payload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.SEARCH_CREDIT_NOTES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreditNoteDetailsById Action Test Cases', () => {
    it('should check correct type is used for CreditNoteDetailsById action ', () => {
      const action = new CreditNoteDetailsById('abc123');

      expect(action.type).toEqual(
        CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for CreditNoteDetailsByIdSuccess action ', () => {
      const action = new CreditNoteDetailsByIdSuccess(dummyCreditNoteDetails);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_SUCCESS
      );
      expect(action.payload).toEqual(dummyCreditNoteDetails);
    });
    it('should check correct type is used for CreditNoteDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreditNoteDetailsByIdFailure(payload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('RaiseRequest Action Test Cases', () => {
    const payload: SentRequestPayload = {
      creditNoteType: 'REMOVE_GOLD_RATE',
      id: 'abc123',
      payload: {}
    };
    it('should check correct type is used for RaiseRequest action ', () => {
      const action = new RaiseRequest(payload);

      expect(action.type).toEqual(CreditNoteActionTypes.RAISE_REQUEST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for RaiseRequestSuccess action ', () => {
      const action = new RaiseRequestSuccess('abc123');

      expect(action.type).toEqual(CreditNoteActionTypes.RAISE_REQUEST_SUCCESS);
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for RaiseRequestFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RaiseRequestFailure(errorPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.RAISE_REQUEST_FAILURE);
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('ResetListPage Action Test Cases', () => {
    it('should check correct type is used for ResetListPage action ', () => {
      const action = new ResetListPage();

      expect(action.type).toEqual(CreditNoteActionTypes.RESET_LIST_PAGE);
    });
  });

  describe('StoreSearch Action Test Cases', () => {
    it('should check correct type is used for StoreSearch action ', () => {
      const action = new StoreSearch(searchPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.STORE_SEARCH);
    });
  });

  describe('LoadSentRequests Action Test Cases', () => {
    it('should check correct type is used for LoadSentRequests action ', () => {
      const action = new LoadSentRequests(loadRequestPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.LOAD_SENT_REQUESTS);
      expect(action.payload).toEqual(loadRequestPayload);
    });
    it('should check correct type is used for LoadSentRequestsSuccess action ', () => {
      const action = new LoadSentRequestsSuccess(sentRequestResponse);

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_SENT_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(sentRequestResponse);
    });
    it('should check correct type is used for LoadSentRequestsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSentRequestsFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_SENT_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('ResetDetailPage Action Test Cases', () => {
    it('should check correct type is used for ResetDetailPage action ', () => {
      const action = new ResetDetailPage();

      expect(action.type).toEqual(CreditNoteActionTypes.RESET_DETAILS_PAGE);
    });
    it('should check correct type is used for ResetRequests action ', () => {
      const action = new ResetRequests();
      expect(action.type).toEqual(CreditNoteActionTypes.RESET_REQUESTS);
    });
  });

  describe('SearchRequst Action Test Cases', () => {
    it('should check correct type is used for SearchRequst action ', () => {
      const action = new SearchRequst(loadRequestPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.SEARCH_REQUEST);
      expect(action.payload).toEqual(loadRequestPayload);
    });
    it('should check correct type is used for SearchRequstSuccess action ', () => {
      const action = new SearchRequstSuccess(sentRequestResponse);

      expect(action.type).toEqual(CreditNoteActionTypes.SEARCH_REQUEST_SUCCESS);
      expect(action.payload).toEqual(sentRequestResponse);
    });
    it('should check correct type is used for SearchRequstFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchRequstFailure(errorPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.SEARCH_REQUEST_FAILURE);
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('ConfirmRequestType Action Test Cases', () => {
    it('should check correct type is used for ConfirmRequestType action ', () => {
      const action = new ConfirmRequestType(confirmRequestPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE);
      expect(action.payload).toEqual(confirmRequestPayload);
    });
    it('should check correct type is used for ConfirmRequestTypeSuccess action ', () => {
      const action = new ConfirmRequestTypeSuccess(12);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_SUCCESS
      );
      expect(action.payload).toEqual(12);
    });
    it('should check correct type is used for ConfirmRequestTypeFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmRequestTypeFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('StoreRequestType Action Test Cases', () => {
    it('should check correct type is used for StoreRequestType action ', () => {
      const action = new StoreRequestType('RemoveGoldRate');

      expect(action.type).toEqual(CreditNoteActionTypes.STORE_REQUEST_TYPE);
      expect(action.payload).toEqual('RemoveGoldRate');
    });
  });

  describe('LoadRequestById Action Test Cases', () => {
    it('should check correct type is used for LoadRequestById action ', () => {
      const action = new LoadRequestById({
        processId: '123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });

      expect(action.type).toEqual(CreditNoteActionTypes.LOAD_REQUEST_BY_ID);
      expect(action.payload).toEqual({
        processId: '123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
    });
    it('should check correct type is used for LoadRequestByIdSuccess action ', () => {
      const action = new LoadRequestByIdSuccess(sentRequestResponseById);

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_REQUEST_BY_ID_SUCCESS
      );
      expect(action.payload).toEqual(sentRequestResponseById);
    });
    it('should check correct type is used for LoadRequestByIdFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestByIdFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_REQUEST_BY_ID_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('TransfetToEghs Action Test Cases', () => {
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
    it('should check correct type is used for TransfetToEghs action ', () => {
      const action = new TransfetToEghs(transferToEghsPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.TRANSFER_TO_EGHS);
      expect(action.payload).toEqual(transferToEghsPayload);
    });
    it('should check correct type is used for TransfetToEghsSuccess action ', () => {
      const response: TransferToEghs = {
        balanceAmtCnDocNo: 123,
        amount: 12,
        cashCollected: 10,
        docNo: 12,
        id: 'abc123'
      };
      const action = new TransfetToEghsSuccess(response);

      expect(action.type).toEqual(
        CreditNoteActionTypes.TRANSFER_TO_EGHS_SUCCESS
      );
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for TransfetToEghsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new TransfetToEghsFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.TRANSFER_TO_EGHS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('LoadTransferedCNS Action Test Cases', () => {
    it('should check correct type is used for LoadTransferedCNS action ', () => {
      const action = new LoadTransferedCNS();

      expect(action.type).toEqual(CreditNoteActionTypes.LOAD_TRANSFERED_CNS);
    });
    it('should check correct type is used for LoadTransferedCNSSuccess action ', () => {
      const action = new LoadTransferedCNSSuccess({
        transferedCNs: transferdCNs,
        totalCount: 1
      });

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_TRANSFERED_CNS_SUCCESS
      );
      expect(action.payload).toEqual({
        transferedCNs: transferdCNs,
        totalCount: 1
      });
    });
    it('should check correct type is used for LoadTransferedCNSFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransferedCNSFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.LOAD_TRANSFERED_CNS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('DownloadCN Action Test Cases', () => {
    it('should check correct type is used for DownloadCN action ', () => {
      const action = new DownloadCN({ id: '123', ghsDocNo: 12 });

      expect(action.type).toEqual(CreditNoteActionTypes.DOWNLOAD_CN);
      expect(action.payload).toEqual({ id: '123', ghsDocNo: 12 });
    });
    it('should check correct type is used for DownloadCNSuccess action ', () => {
      const action = new DownloadCNSuccess();

      expect(action.type).toEqual(CreditNoteActionTypes.DOWNLOAD_CN_SUCCESS);
    });
    it('should check correct type is used for DownloadCNFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DownloadCNFailure(errorPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.DOWNLOAD_CN_FAILURE);
      expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('CancelRequest Action Test Cases', () => {
    it('should check correct type is used for CancelRequest action ', () => {
      const action = new CancelRequest({
        remarks: 'good',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });

      expect(action.type).toEqual(CreditNoteActionTypes.CANCEL_REQUEST);
      expect(action.payload).toEqual({
        remarks: 'good',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
    });
    it('should check correct type is used for CancelCNSuccess action ', () => {
      const action = new CancelRequestSuccess();

      expect(action.type).toEqual(CreditNoteActionTypes.CANCEL_REQUEST_SUCCESS);
    });
    it('should check correct type is used for CancelRequestFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelRequestFailure(errorPayload);

      expect(action.type).toEqual(CreditNoteActionTypes.CANCEL_REQUEST_FAILURE);
      expect(action.payload).toEqual(errorPayload);
    });

    it('should check correct type is used for ResetSearch action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ResetSearch();

      expect(action.type).toEqual(CreditNoteActionTypes.RESET_SEARCH);
      //expect(action.payload).toEqual(errorPayload);
    });
  });

  describe('CalculateCnRefundAmount Action Test Cases', () => {
    it('should check correct type is used for CalculateCnRefundAmount action ', () => {
      const action = new CalculateCnRefundAmount('123');

      expect(action.type).toEqual(
        CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT
      );
      expect(action.payload).toEqual('123');
    });
    it('should check correct type is used for CalculateCnRefundAmountSuccess action ', () => {
      const action = new CalculateCnRefundAmountSuccess(
        calculateCnRefundAmountSuccess
      );

      expect(action.type).toEqual(
        CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_SUCCESS
      );
    });
    it('should check correct type is used for CalculateCnRefundAmountFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CalculateCnRefundAmountFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('CancelAutoApprovedCn Action Test Cases', () => {
    it('should check correct type is used for CancelAutoApprovedCn action ', () => {
      const action = new CancelAutoApprovedCn(cancelCnRequestPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN
      );
      expect(action.payload).toEqual(cancelCnRequestPayload);
    });
    it('should check correct type is used for CancelAutoApprovedCnSuccess action ', () => {
      const action = new CancelAutoApprovedCnSuccess(123);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_SUCCESS
      );
      expect(action.payload).toEqual(123);
    });
    it('should check correct type is used for CancelAutoApprovedCnFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelAutoApprovedCnFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('CancelRequestApprovedCn Action Test Cases', () => {
    it('should check correct type is used for CancelRequestApprovedCn action ', () => {
      const action = new CancelRequestApprovedCn(cancelCnRequestPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN
      );
      expect(action.payload).toEqual(cancelCnRequestPayload);
    });
    it('should check correct type is used for CancelRequestApprovedCnSuccess action ', () => {
      const action = new CancelRequestApprovedCnSuccess(123);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_SUCCESS
      );
      expect(action.payload).toEqual(123);
    });
    it('should check correct type is used for CancelRequestApprovedCnFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelRequestApprovedCnFailure(errorPayload);

      expect(action.type).toEqual(
        CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
});
