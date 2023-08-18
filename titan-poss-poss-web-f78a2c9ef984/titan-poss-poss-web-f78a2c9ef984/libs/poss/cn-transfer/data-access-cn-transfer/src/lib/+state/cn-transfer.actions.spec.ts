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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  GetLocationCodes,
  CreditNotetransferActionTypes,
  GetLocationCodesSuccess,
  GetLocationCodesFailure,
  SearchCreditNotes,
  SearchCreditNotesSuccess,
  SearchCreditNotesFailure,
  GetCreditNoteDetailsById,
  GetCreditNoteDetailsByIdSuccess,
  GetCreditNoteDetailsByIdFailure,
  RaiseTransferRequest,
  RaiseTransferRequestSuccess,
  RaiseTransferRequestFailure,
  LoadTransferRequests,
  LoadTransferRequestsSuccess,
  LoadTransferRequestsFailure,
  InwardCreditNote,
  InwardCreditNoteSuccess,
  InwardCreditNoteFailure,
  ApproveOrRejectCnTransferSuccess,
  ApproveOrRejectCnTransferFailure,
  ResetListPage,
  ResetSearch,
  ResetCnTransfer,
  ApproveOrRejectCnTransfer,
  LegacyCNInwardTransfer,
  LegacyCNOutwardTransfer,
  LegacyCNOutwardTransferSuccess,
  LegacyCNInwardTransferFailure,
  LegacyCNOutwardTransferFailure,
  LegacyCNInwardTransferSuccess
} from './cn-transfer.actions';
describe('Credit Note Action Tetsing Suite', () => {
  describe('GetLocationCodes Action Test Cases', () => {
    it('should check correct type is used for GetLocationCodes action', () => {
      const action = new GetLocationCodes();
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_LOCATION_CODES
      });
    });
    it('should check correct type is used for GetLocationCodesSuccess action', () => {
      const payload: LocationSummaryList[] = [
        { description: 'CPD', locationCode: 'CPD' }
      ];
      const action = new GetLocationCodesSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_LOCATION_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetLocationCodesSuccess action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetLocationCodesFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_LOCATION_CODES_FAILURE,
        payload
      });
    });
  });
  describe('SearchCreditNotes Action Test Cases', () => {
    it('should check correct type is used for SearchCreditNotes action', () => {
      const payload: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const action = new SearchCreditNotes(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES,
        payload
      });
    });
    it('should check correct type is used for SearchCreditNotesSuccess action', () => {
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
      const action = new SearchCreditNotesSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCreditNotesFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCreditNotesFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_FAILURE,
        payload
      });
    });
  });
  describe('CreditNoteDetailsById Action Test Cases', () => {
    it('should check correct type is used for CreditNoteDetailsById action', () => {
      const payload: LoadSelectedCnDetailsReqPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        id: '123456',
        srcBtqCode: 'PTU',
        taskId: '1234567'
      };
      const action = new GetCreditNoteDetailsById(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for CreditNoteDetailsByIdSuccess action', () => {
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
      const action = new GetCreditNoteDetailsByIdSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for CreditNoteDetailsByIdFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetCreditNoteDetailsByIdFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });
  describe('RaiseTransferRequest Action Test Cases', () => {
    it('should check correct type is used for RaiseTransferRequest action', () => {
      const payload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const action = new RaiseTransferRequest(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST,
        payload
      });
    });
    it('should check correct type is used for RaiseTransferRequestSuccess action', () => {
      const payload = { requestNo: '333' };
      const action = new RaiseTransferRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RaiseTransferRequestFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RaiseTransferRequestFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_FAILURE,
        payload
      });
    });
  });
  describe('LegacyCNOutwardTransfer Action Test Cases', () => {
    it('should check correct type is used for LegacyCNOutwardTransfer action', () => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'CPD'
      };
      const action = new LegacyCNOutwardTransfer(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER,
        payload
      });
    })
    it('should check correct type is used for LegacyCNOutwardTransferSuccess action', () => {
      const payload: LegacyOutwardTransferResponsePayload = {
        status: true,
        errorMessage: ''
      };
      const action = new LegacyCNOutwardTransferSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_SUCCESS,
        payload
      });
    })
    it('should check correct type is used for LegacyCNOutwardTransferFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LegacyCNOutwardTransferFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_FAILURE,
        payload
      });
    })
  });
  describe('LegacyCNInwardTransfer Action Test Cases', () => {
    it('should check correct type is used for LegacyCNInwardTransfer action', () => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'CPD'
      };
      const action = new LegacyCNInwardTransfer(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER,
        payload
      });
    })
    it('should check correct type is used for LegacyCNInwardTransferSuccess action', () => {
      const payload: LegacyInwardTransferResponsePayload = {
        docNo: 1
      };
      const action = new LegacyCNInwardTransferSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_SUCCESS,
        payload
      });
    })
    it('should check correct type is used for LegacyCNInwardTransferFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LegacyCNInwardTransferFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_FAILURE,
        payload
      });
    })
  });
  describe('LoadTransferRequests Action Test Cases', () => {
    it('should check correct type is used for LoadTransferRequests action', () => {
      const payload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const action = new LoadTransferRequests(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS,
        payload
      });
    });
    it('should check correct type is used for LoadTransferRequestsSuccess action', () => {
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
      const action = new LoadTransferRequestsSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTransferRequestsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransferRequestsFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_FAILURE,
        payload
      });
    });
  });

  describe('InwardCreditNote Action Test Cases', () => {
    it('should check correct type is used for InwardCreditNote action', () => {
      const payload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CN_TRANSFER'
      };
      const action = new InwardCreditNote(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.INWARD_CN,
        payload
      });
    });
    it('should check correct type is used for InwardCreditNoteSuccess action', () => {
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
      const action = new InwardCreditNoteSuccess(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.INWARD_CN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for InwardCreditNoteFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new InwardCreditNoteFailure(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.INWARD_CN_FAILURE,
        payload
      });
    });
  });
  describe('ApproveOrRejectCnTransfer Action Test Cases', () => {
    it('should check correct type is used for ApproveOrRejectCnTransfer action', () => {
      const payload: ApproveOrRejectCnTransferPayaload = {
        id: '1234',
        remarksDto: { remarks: 'test' },
        status: 'APPROVE',
        workflowType: 'CN_TRANSFER'
      };
      const action = new ApproveOrRejectCnTransfer(payload);
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER,
        payload
      });
    });
    it('should check correct type is used for ApproveOrRejectCnTransferSuccess action', () => {
      const payload = true;

      const action = new ApproveOrRejectCnTransferSuccess(true);
      expect({ ...action }).toEqual({
        type:
          CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ApproveOrRejectCnTransferFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ApproveOrRejectCnTransferFailure(payload);
      expect({ ...action }).toEqual({
        type:
          CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_FAILURE,
        payload
      });
    });
  });
  describe('RESET Action Test Cases', () => {
    it('should check correct type is used for ResetListPage action', () => {
      const action = new ResetListPage();
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RESET_LIST_PAGE
      });
    });
    it('should check correct type is used for ResetSearch action', () => {
      const action = new ResetSearch();
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RESET_SEARCH
      });
    });
    it('should check correct type is used for ResetCnTransfer action', () => {
      const action = new ResetCnTransfer();
      expect({ ...action }).toEqual({
        type: CreditNotetransferActionTypes.RESET_CN_TRANSFER_DETAILS
      });
    });
  });
});
