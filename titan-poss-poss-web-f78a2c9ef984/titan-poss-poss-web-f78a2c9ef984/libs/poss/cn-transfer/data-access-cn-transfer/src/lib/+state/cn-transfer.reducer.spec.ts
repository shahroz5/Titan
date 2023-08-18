import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CreditNoteTransferReducer, initialState } from './cn-transfer.reducer';
import * as actions from './cn-transfer.actions';
import { CreditNoteTransferState } from './cn-transfer.state';
import {
  ApproveOrRejectCnTransferPayaload,
  CNDetailsInfo,
  CnTransferSearchPayload,
  CnTransferSearchResponsePayload,
  cnTransferTabEnum,
  CustomErrors,
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
import * as moment from 'moment';
describe('Cn Transfer Reducer Testing Suite', () => {
  const errorPayload = CustomErrorAdaptor.fromJson(Error('some error'));
  const testState = initialState;

  describe('Testing Get Locations reducers', () => {
    it('GET_LOCATION_CODES should be called', () => {
      const action = new actions.GetLocationCodes();
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('GET_LOCATION_CODES_SUCCESS should be called', () => {
      const payload: LocationSummaryList[] = [
        { description: 'CPD', locationCode: 'CPD' }
      ];
      const action = new actions.GetLocationCodesSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.locationCodes).toBeTruthy();
    });
    it('GET_LOCATION_CODES_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.GetLocationCodesFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing Search Credit Note reducers', () => {
    it('SEARCH_CREDIT_NOTES should be called', () => {
      const payload: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const action = new actions.SearchCreditNotes(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('SEARCH_CREDIT_NOTES_SUCCESS should be called', () => {
      const payload: CnTransferSearchResponsePayload = {
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
      const action = new actions.SearchCreditNotesSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.creditNoteSearchResult).toBeTruthy();
      expect(result.searchCount).toBe(10);
    });
    it('SEARCH_CREDIT_NOTES_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SearchCreditNotesFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing Load details by ID reducers', () => {
    it('CREDIT_NOTE_DETAILS_BY_ID should be called', () => {
      const payload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        id: '123456',
        srcBtqCode: 'PTU',
        taskId: '1234567'
      };
      const action = new actions.GetCreditNoteDetailsById(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('CREDIT_NOTE_DETAILS_BY_ID_SUCCESS should be called', () => {
      const payload: CNDetailsInfo = {
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
      const action = new actions.GetCreditNoteDetailsByIdSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.creditNoteDetails).toBeTruthy();
    });
    it('CREDIT_NOTE_DETAILS_BY_ID_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.GetCreditNoteDetailsByIdFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Raise request reducers', () => {
    it('RAISE_TRANSFER_REQUEST should be called', () => {
      const payload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const action = new actions.RaiseTransferRequest(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('RAISE_TRANSFER_REQUEST_SUCCESS should be called', () => {
      const payload = { requestNo: '333' };
      const action = new actions.RaiseTransferRequestSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.raisedRequestNo).toBeTruthy();
    });
    it('RAISE_TRANSFER_REQUEST_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.RaiseTransferRequestFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Outbound transfer reducers', () => {
    it('LEGACY_CN_OUTWARD_TRANSFER should be called', () => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: "ABL"
      };
      const action = new actions.LegacyCNOutwardTransfer(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LEGACY_CN_OUTWARD_TRANSFER_SUCCESS should be called', () => {
      const payload  : LegacyOutwardTransferResponsePayload = {
        status: true,
        errorMessage: ''
      }
      const action = new actions.LegacyCNOutwardTransferSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.legacyOutwardTransferResponsePayload).toBeTruthy();
    });
    it('LEGACY_CN_OUTWARD_TRANSFER_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LegacyCNOutwardTransferFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Inbound transfer reducers', () => {
    it('LEGACY_CN_INWARD_TRANSFER should be called', () => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: "ABL"
      };
      const action = new actions.LegacyCNInwardTransfer(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LEGACY_CN_INWARD_TRANSFER_SUCCESS should be called', () => {
      const payload  : LegacyInwardTransferResponsePayload = {
        docNo: 23
      }
      const action = new actions.LegacyCNInwardTransferSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.legacyInwardTransferResponsePayload).toBeTruthy();
    });
    it('LEGACY_CN_INWARD_TRANSFER_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LegacyCNInwardTransferFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing  Load transfer requests reducers', () => {
    it('LOAD_TRANSFER_REQUESTS should be called', () => {
      const payload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const action = new actions.LoadTransferRequests(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LOAD_TRANSFER_REQUESTS_SUCCESS should be called', () => {
      const payload: SendRequestResponsePayload = {
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
      const action = new actions.LoadTransferRequestsSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.requestsCount).toBe(1);
      expect(result.raisedRequests).toBeTruthy();
    });
    it('LOAD_TRANSFER_REQUESTS_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadTransferRequestsFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Inward CN reducers', () => {
    it('INWARD_CN should be called', () => {
      const payload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CN_TRANSFER'
      };
      const action = new actions.InwardCreditNote(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.creditNoteUpdateResponse).toBe(null);
      expect(result.hasCnUpdateRequestStatus).toBe(null);
      expect(result.error).toBe(null);
    });
    it('INWARD_CN_SUCCESS should be called', () => {
      const payload: CNDetailsInfo = {
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
      const action = new actions.InwardCreditNoteSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.creditNoteUpdateResponse).toBeTruthy();
      expect(result.hasCnUpdateRequestStatus).toBe(true);
    });
    it('INWARD_CN_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.InwardCreditNoteFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing ApproveOrRejectCnTransfer reducers', () => {
    it('APPROVE_OR_REJECT_CN_TRANSFER should be called', () => {
      const payload: ApproveOrRejectCnTransferPayaload = {
        id: '1234',
        remarksDto: { remarks: 'test' },
        status: 'APPROVE',
        workflowType: 'CN_TRANSFER'
      };
      const action = new actions.ApproveOrRejectCnTransfer(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );

      expect(result.isApprovedOrRejected).toBe(false);
      expect(result.error).toBe(null);
    });
    it('APPROVE_OR_REJECT_CN_TRANSFER_SUCCESS should be called', () => {
      const payload = true;

      const action = new actions.ApproveOrRejectCnTransferSuccess(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isApprovedOrRejected).toBe(true);
    });
    it('APPROVE_OR_REJECT_CN_TRANSFER_FAILURE should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.ApproveOrRejectCnTransferFailure(payload);
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing reset reducers', () => {
    it('RESET_LIST_PAGE should be called', () => {
      const action = new actions.ResetListPage();
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );

      expect(result.raisedRequests.ids.length).toBe(0);
      expect(result.requestsCount).toBe(0);
    });
    it('RESET_SEARCH should be called', () => {
      const action = new actions.ResetSearch();
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );

      expect(result.creditNoteSearchResult.length).toBe(0);
      expect(result.searchCount).toBe(0);
    });

    it('RESET_CN_TRANSFER_DETAILS should be called', () => {
      const action = new actions.ResetCnTransfer();
      const result: CreditNoteTransferState = CreditNoteTransferReducer(
        initialState,
        action
      );
      expect(result.locationCodes.length).toBe(0);
      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.creditNoteSearchResult.length).toBe(0);
      expect(result.searchCount).toBe(0);
      expect(result.creditNoteDetails).toBe(null);
      expect(result.raisedRequestNo).toBe(null);
      expect(result.requestsCount).toBe(0);
      expect(result.hasCnUpdateRequestStatus).toBe(null);
      expect(result.creditNoteUpdateResponse).toBe(null);
      expect(result.isApprovedOrRejected).toBe(false);
    });
  });
});
