import { Action } from '@ngrx/store';
import {
  CreditNoteSearchResult,
  CreditNoteSearch,
  CustomErrors,
  CreditNoteDetails,
  SentRequestPayload,
  SentRequestResponse,
  LoadRequestsPayload,
  ConfirmRequestTypePayload,
  TransferEghsPayload,
  TransferedCNS,
  TransferToEghs,
  CancelCnRequestPayload,
  CnRefundAmountDetails
} from '@poss-web/shared/models';
export enum CreditNoteActionTypes {
  SEARCH_CREDIT_NOTES = '[CreditNote]Search Credit Notes',
  SEARCH_CREDIT_NOTES_SUCCESS = '[CreditNote]Search Credit Notes Success',
  SEARCH_CREDIT_NOTES_FAILURE = '[CreditNote]Search Credit Notes Failure',

  CREDIT_NOTE_DETAILS_BY_ID = '[CreditNote]Credit Note Details By Id',
  CREDIT_NOTE_DETAILS_BY_ID_SUCCESS = '[CreditNote]Credit Note Details By Id Success',
  CREDIT_NOTE_DETAILS_BY_ID_FAILURE = '[CreditNote]Credit Note Details By Id Failure',

  RAISE_REQUEST = '[CreditNote]Raise Request',
  RAISE_REQUEST_SUCCESS = '[CreditNote]Raise Request Success',
  RAISE_REQUEST_FAILURE = '[CreditNote]Raise Request Failure',

  RESET_LIST_PAGE = '[CreditNote]Reset List Page',

  STORE_SEARCH = '[CreditNote]Store Search',

  LOAD_SENT_REQUESTS = '[CreditNote]Load Sent Requests',
  LOAD_SENT_REQUESTS_SUCCESS = '[CreditNote]Load Sent Requests Success',
  LOAD_SENT_REQUESTS_FAILURE = '[CreditNote]Load Sent Requests Failure',

  RESET_DETAILS_PAGE = '[CreditNote] Reset Detail Page',

  RESET_REQUESTS = '[CreditNote] Reset Requests',

  CLEAR_SEARCH_LIST = '[CreditNote] Clear Search List',

  SEARCH_REQUEST = '[CreditNote]Search Request',
  SEARCH_REQUEST_SUCCESS = '[CreditNote]Search Request Success',
  SEARCH_REQUEST_FAILURE = '[CreditNote]Search Request Failure',

  CONFIGRM_REQUEST_TYPE = '[CreditNote]Confirm Request Type',
  CONFIGRM_REQUEST_TYPE_SUCCESS = '[CreditNote]Confirm Request Type Success',
  CONFIGRM_REQUEST_TYPE_FAILURE = '[CreditNote]Confirm Request Type Failure',

  LOAD_REQUEST_BY_ID = '[CreditNote]Load Request By Id',
  LOAD_REQUEST_BY_ID_SUCCESS = '[CreditNote]Load Request By Id Success',
  LOAD_REQUEST_BY_ID_FAILURE = '[CreditNote]Load Request By Id Failure',

  STORE_REQUEST_TYPE = '[CreditNote]STORE_REQUEST_TYPE',

  TRANSFER_TO_EGHS = '[CreditNote]Transfer to Eghs',
  TRANSFER_TO_EGHS_SUCCESS = '[CreditNote]Transfer to Eghs Success',
  TRANSFER_TO_EGHS_FAILURE = '[CreditNote]Transfer to Eghs Failure',

  LOAD_TRANSFERED_CNS = '[CreditNote]Load Transfered CNS',
  LOAD_TRANSFERED_CNS_SUCCESS = '[CreditNote]Load Transfered CNS Success',
  LOAD_TRANSFERED_CNS_FAILURE = '[CreditNote]Load Transfered CNS Failure',

  DOWNLOAD_CN = '[CreditNote]Download CN',
  DOWNLOAD_CN_SUCCESS = '[CreditNote]Download CN Success',
  DOWNLOAD_CN_FAILURE = '[CreditNote]Download CN Failure',

  RESET_SEARCH = '[CreditNote]Reset Search',

  CANCEL_REQUEST = '[CreditNote]Cancel Request',
  CANCEL_REQUEST_SUCCESS = '[CreditNote]Cancel Request Success',
  CANCEL_REQUEST_FAILURE = '[CreditNote]Cancel Request Failure',

  SEARCH_TRANSFERED_CNS = '[CreditNote]Search Transfered CNS',
  SEARCH_TRANSFERED_CNS_SUCCESS = '[CreditNote]Search Transfered CNS Success',
  SEARCH_TRANSFERED_CNS_FAILURE = '[CreditNote]Search Transfered CNS Failure',

  RESET_ERROR = '[CreditNote] Reset Error',

  CALCULATE_CN_REFUND_AMOUNT = '[CreditNote] Calculate CN Refund Amount',
  CALCULATE_CN_REFUND_AMOUNT_SUCCESS = '[CreditNote] Calculate CN Refund Amount Success',
  CALCULATE_CN_REFUND_AMOUNT_FAILURE = '[CreditNote] Calculate CN Refund Amount Failure',

  CANCEL_AUTO_APPROVED_CN = '[CreditNote] Cancel Auto Approved CN',
  CANCEL_AUTO_APPROVED_CN_SUCCESS = '[CreditNote] Cancel Auto Approved CN Success',
  CANCEL_AUTO_APPROVED_CN_FAILURE = '[CreditNote] Cancel Auto Approved CN Failure',

  CANCEL_REQUEST_APPROVED_CN = '[CreditNote] Cancel Request Approved CN',
  CANCEL_REQUEST_APPROVED_CN_SUCCESS = '[CreditNote] Cancel Request Approved CN Success',
  CANCEL_REQUEST_APPROVED_CN_FAILURE = '[CreditNote] Cancel Request Approved CN Failure'
}
export class SearchCreditNotes implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_CREDIT_NOTES;
  constructor(public payload: CreditNoteSearch) {}
}
export class SearchCreditNotesSuccess implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_CREDIT_NOTES_SUCCESS;
  constructor(
    public payload: { searchResult: CreditNoteSearchResult[]; count: number }
  ) {}
}
export class SearchCreditNotesFailure implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_CREDIT_NOTES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class CreditNoteDetailsById implements Action {
  readonly type = CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID;
  constructor(public payload: string) {}
}
export class CreditNoteDetailsByIdSuccess implements Action {
  readonly type = CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: CreditNoteDetails) {}
}
export class CreditNoteDetailsByIdFailure implements Action {
  readonly type = CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RaiseRequest implements Action {
  readonly type = CreditNoteActionTypes.RAISE_REQUEST;
  constructor(public payload: SentRequestPayload) {}
}
export class RaiseRequestSuccess implements Action {
  readonly type = CreditNoteActionTypes.RAISE_REQUEST_SUCCESS;
  constructor(public payload: string) {}
}
export class RaiseRequestFailure implements Action {
  readonly type = CreditNoteActionTypes.RAISE_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetListPage implements Action {
  readonly type = CreditNoteActionTypes.RESET_LIST_PAGE;
}

export class StoreSearch implements Action {
  readonly type = CreditNoteActionTypes.STORE_SEARCH;
  constructor(public payload: CreditNoteSearch) {}
}
export class LoadSentRequests implements Action {
  readonly type = CreditNoteActionTypes.LOAD_SENT_REQUESTS;
  constructor(public payload: LoadRequestsPayload) {}
}
export class LoadSentRequestsSuccess implements Action {
  readonly type = CreditNoteActionTypes.LOAD_SENT_REQUESTS_SUCCESS;
  constructor(
    public payload: {
      requestSentResponse: SentRequestResponse[];
      count: number;
    }
  ) {}
}
export class LoadSentRequestsFailure implements Action {
  readonly type = CreditNoteActionTypes.LOAD_SENT_REQUESTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetDetailPage implements Action {
  readonly type = CreditNoteActionTypes.RESET_DETAILS_PAGE;
}

export class ResetRequests implements Action {
  readonly type = CreditNoteActionTypes.RESET_REQUESTS;
}

export class ClearSearchList implements Action {
  readonly type = CreditNoteActionTypes.CLEAR_SEARCH_LIST;
}
export class SearchRequst implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_REQUEST;
  constructor(public payload: LoadRequestsPayload) {}
}
export class SearchRequstSuccess implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_REQUEST_SUCCESS;
  constructor(
    public payload: {
      requestSentResponse: SentRequestResponse[];
      count: number;
    }
  ) {}
}
export class SearchRequstFailure implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmRequestType implements Action {
  readonly type = CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE;
  constructor(public payload: ConfirmRequestTypePayload) {}
}
export class ConfirmRequestTypeSuccess implements Action {
  readonly type = CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_SUCCESS;
  constructor(public payload: number) {}
}
export class ConfirmRequestTypeFailure implements Action {
  readonly type = CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRequestById implements Action {
  readonly type = CreditNoteActionTypes.LOAD_REQUEST_BY_ID;
  constructor(public payload: { processId: string; workFlowType: string }) {}
}
export class LoadRequestByIdSuccess implements Action {
  readonly type = CreditNoteActionTypes.LOAD_REQUEST_BY_ID_SUCCESS;
  constructor(public payload: SentRequestResponse) {}
}
export class LoadRequestByIdFailure implements Action {
  readonly type = CreditNoteActionTypes.LOAD_REQUEST_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StoreRequestType implements Action {
  readonly type = CreditNoteActionTypes.STORE_REQUEST_TYPE;
  constructor(public payload: string) {}
}

export class TransfetToEghs implements Action {
  readonly type = CreditNoteActionTypes.TRANSFER_TO_EGHS;
  constructor(public payload: TransferEghsPayload) {}
}
export class TransfetToEghsSuccess implements Action {
  readonly type = CreditNoteActionTypes.TRANSFER_TO_EGHS_SUCCESS;
  constructor(public payload: TransferToEghs) {}
}
export class TransfetToEghsFailure implements Action {
  readonly type = CreditNoteActionTypes.TRANSFER_TO_EGHS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTransferedCNS implements Action {
  readonly type = CreditNoteActionTypes.LOAD_TRANSFERED_CNS;
}
export class LoadTransferedCNSSuccess implements Action {
  readonly type = CreditNoteActionTypes.LOAD_TRANSFERED_CNS_SUCCESS;
  constructor(
    public payload: {
      transferedCNs: TransferedCNS[];
      totalCount: number;
    }
  ) {}
}
export class LoadTransferedCNSFailure implements Action {
  readonly type = CreditNoteActionTypes.LOAD_TRANSFERED_CNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DownloadCN implements Action {
  readonly type = CreditNoteActionTypes.DOWNLOAD_CN;
  constructor(public payload: { id: string; ghsDocNo: number }) {}
}
export class DownloadCNSuccess implements Action {
  readonly type = CreditNoteActionTypes.DOWNLOAD_CN_SUCCESS;
}
export class DownloadCNFailure implements Action {
  readonly type = CreditNoteActionTypes.DOWNLOAD_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetSearch implements Action {
  readonly type = CreditNoteActionTypes.RESET_SEARCH;
}

export class CancelRequest implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST;
  constructor(
    public payload: { remarks: string; id: string; workFlowType: string }
  ) {}
}

export class CancelRequestSuccess implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST_SUCCESS;
}
export class CancelRequestFailure implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTrasnferedCN implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_TRANSFERED_CNS;
  constructor(public payload: { cnNumber: string; fiscalYear: string }) {}
}
export class SearchTrasnferedCNSuccess implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_TRANSFERED_CNS_SUCCESS;
  constructor(
    public payload: {
      searchResult: CreditNoteSearchResult[];
      count: number;
    }
  ) {}
}
export class SearchTransferedCNFailure implements Action {
  readonly type = CreditNoteActionTypes.SEARCH_TRANSFERED_CNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetError implements Action {
  readonly type = CreditNoteActionTypes.RESET_ERROR;
}

export class CalculateCnRefundAmount implements Action {
  readonly type = CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT;
  constructor(public payload: string) {}
}
export class CalculateCnRefundAmountSuccess implements Action {
  readonly type = CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_SUCCESS;
  constructor(public payload: CnRefundAmountDetails) {}
}
export class CalculateCnRefundAmountFailure implements Action {
  readonly type = CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CancelAutoApprovedCn implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN;
  constructor(public payload: CancelCnRequestPayload) {}
}
export class CancelAutoApprovedCnSuccess implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_SUCCESS;
  constructor(public payload: number) {}
}
export class CancelAutoApprovedCnFailure implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CancelRequestApprovedCn implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN;
  constructor(public payload: CancelCnRequestPayload) {}
}
export class CancelRequestApprovedCnSuccess implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_SUCCESS;
  constructor(public payload: number) {}
}
export class CancelRequestApprovedCnFailure implements Action {
  readonly type = CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CreditNoteActions =
  | SearchCreditNotes
  | SearchCreditNotesSuccess
  | SearchCreditNotesFailure
  | CreditNoteDetailsById
  | CreditNoteDetailsByIdSuccess
  | CreditNoteDetailsByIdFailure
  | RaiseRequest
  | RaiseRequestSuccess
  | RaiseRequestFailure
  | ResetListPage
  | StoreSearch
  | LoadSentRequests
  | LoadSentRequestsSuccess
  | LoadSentRequestsFailure
  | ResetDetailPage
  | ResetRequests
  | SearchRequst
  | SearchRequstSuccess
  | SearchRequstFailure
  | ConfirmRequestType
  | ConfirmRequestTypeSuccess
  | ConfirmRequestTypeFailure
  | LoadRequestById
  | LoadRequestByIdSuccess
  | LoadRequestByIdFailure
  | StoreRequestType
  | TransfetToEghs
  | TransfetToEghsSuccess
  | TransfetToEghsFailure
  | LoadTransferedCNS
  | LoadTransferedCNSSuccess
  | LoadTransferedCNSFailure
  | DownloadCN
  | DownloadCNSuccess
  | DownloadCNFailure
  | ResetSearch
  | CancelRequest
  | CancelRequestSuccess
  | CancelRequestFailure
  | SearchTrasnferedCN
  | SearchTrasnferedCNSuccess
  | SearchTransferedCNFailure
  | ResetError
  | CalculateCnRefundAmount
  | CalculateCnRefundAmountSuccess
  | CalculateCnRefundAmountFailure
  | CancelAutoApprovedCn
  | CancelAutoApprovedCnSuccess
  | CancelAutoApprovedCnFailure
  | CancelRequestApprovedCn
  | CancelRequestApprovedCnSuccess
  | CancelRequestApprovedCnFailure
  | ClearSearchList;
