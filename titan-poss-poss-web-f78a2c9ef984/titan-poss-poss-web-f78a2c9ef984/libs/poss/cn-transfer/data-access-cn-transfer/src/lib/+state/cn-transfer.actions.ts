import { Action } from '@ngrx/store';
import {
  CnTransferSearchPayload,
  CnTransferSearchResponsePayload,
  CNDetailsInfo,
  CustomErrors,
  LocationSummaryList,
  RequestTransferPayload,
  SendRequestResponsePayload,
  LoadCnTransferRequestsPayload,
  LoadSelectedCnDetailsReqPayload,
  InwardCnPayload,
  ApproveOrRejectCnTransferPayaload,
  LegacyCNTransferPayload,
  LegacyOutwardTransferResponsePayload,
  LegacyInwardTransferResponsePayload
} from '@poss-web/shared/models';
export enum CreditNotetransferActionTypes {
  GET_LOCATION_CODES = '[Credit Note Transfer] Get Location Codes',
  GET_LOCATION_CODES_SUCCESS = '[Credit Note Transfer] Get Location Codes Success',
  GET_LOCATION_CODES_FAILURE = '[Credit Note Transfer] Get Location Codes Failure',

  GET_LEGACY_LOCATION_CODES = '[Credit Note Transfer] Get Legacy Location Codes',
  GET_LEGACY_LOCATION_CODES_SUCCESS = '[Credit Note Transfer] Get Legacy Location Codes Success',
  GET_LEGACY_LOCATION_CODES_FAILURE = '[Credit Note Transfer] Get Legacy Location Codes Failure',

  SEARCH_CREDIT_NOTES = '[Credit Note Transfer]Search Credit Notes',
  SEARCH_CREDIT_NOTES_SUCCESS = '[Credit Note Transfer]Search Credit Notes Success',
  SEARCH_CREDIT_NOTES_FAILURE = '[Credit Note Transfer]Search Credit Notes Failure',

  GET_CREDIT_NOTE_DETAILS_BY_ID = '[Credit Note Transfer]Get Credit Note Details By Id',
  GET_CREDIT_NOTE_DETAILS_BY_ID_SUCCESS = '[Credit Note Transfer]Get Credit Note Details By Id Success',
  GET_CREDIT_NOTE_DETAILS_BY_ID_FAILURE = '[Credit Note Transfer]Get Credit Note Details By Id Failure',

  RAISE_TRANSFER_REQUEST = '[Credit Note Transfer]Raise Transfer Request',
  RAISE_TRANSFER_REQUEST_SUCCESS = '[Credit Note Transfer]Raise Transfer Request Success',
  RAISE_TRANSFER_REQUEST_FAILURE = '[Credit Note Transfer]Raise Transfer Request Failure',

  LEGACY_CN_OUTWARD_TRANSFER = '[Credit Note Transfer]Legacy Outward Transfer',
  LEGACY_CN_OUTWARD_TRANSFER_SUCCESS = '[Credit Note Transfer]Legacy Outward Transfer Success',
  LEGACY_CN_OUTWARD_TRANSFER_FAILURE = '[Credit Note Transfer]Legacy Outward Transfer Failure',

  LEGACY_CN_INWARD_TRANSFER = '[Credit Note Transfer]Legacy Inward Transfer',
  LEGACY_CN_INWARD_TRANSFER_SUCCESS = '[Credit Note Transfer]Legacy Inward Transfer Success',
  LEGACY_CN_INWARD_TRANSFER_FAILURE = '[Credit Note Transfer]Legacy Inward Transfer Failure',

  LOAD_TRANSFER_REQUESTS = '[Credit Note Transfer]Load Transfer Requests',
  LOAD_TRANSFER_REQUESTS_SUCCESS = '[Credit Note Transfer]Load Transfer Requests Success',
  LOAD_TRANSFER_REQUESTS_FAILURE = '[Credit Note Transfer]Load Transfer Requests Failure',

  INWARD_CN = '[Credit Note Transfer]Inward Credit Note',
  INWARD_CN_SUCCESS = '[Credit Note Transfer]Inward Credit Note Success',
  INWARD_CN_FAILURE = '[Credit Note Transfer]Inward Credit Note Failure',

  APPROVE_OR_REJECT_CN_TRANSFER = '[Credit Note Transfer]Approve or Reject CN Transfer',
  APPROVE_OR_REJECT_CN_TRANSFER_SUCCESS = '[Credit Note Transfer]Approve or Reject CN Transfer Success',
  APPROVE_OR_REJECT_CN_TRANSFER_FAILURE = '[Credit Note Transfer]Approve or Reject CN Transfer Failure',

  CANCEL_CN_TRANSFER_REQUEST = '[Credit Note Transfer] Cancel CN Transfer Request',
  CANCEL_CN_TRANSFER_REQUEST_SUCCESS = '[Credit Note Transfer] Cancel CN Transfer Request Success',
  CANCEL_CN_TRANSFER_REQUEST_FAILURE = '[Credit Note Transfer] Cancel CN Transfer Request Failure',

  RESET_LIST_PAGE = '[Credit Note Transfer]Reset List Page',
  RESET_SEARCH = '[Credit Note Transfer]Reset Search Results',

  // STORE_SEARCH = '[Credit Note Transfer]Store Search',

  RESET_DETAILS_PAGE = '[Credit Note Transfer] Reset Detail Page',

  RESET_CN_TRANSFER_DETAILS = '[Credit Note Transsfer] Reset CN Transfer'
}

export class GetLocationCodes implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LOCATION_CODES;
}

export class GetLocationCodesSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LOCATION_CODES_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}

export class GetLocationCodesFailure implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LOCATION_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetLegacyLocationCodes implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES;
}

export class GetLegacyLocationCodesSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}

export class GetLegacyLocationCodesFailure implements Action {
  readonly type = CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchCreditNotes implements Action {
  readonly type = CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES;
  constructor(public payload: CnTransferSearchPayload) {}
}
export class SearchCreditNotesSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_SUCCESS;
  constructor(public payload: CnTransferSearchResponsePayload) {}
}
export class SearchCreditNotesFailure implements Action {
  readonly type = CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetCreditNoteDetailsById implements Action {
  readonly type = CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID;
  constructor(public payload: LoadSelectedCnDetailsReqPayload) {}
}
export class GetCreditNoteDetailsByIdSuccess implements Action {
  readonly type =
    CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: CNDetailsInfo) {}
}
export class GetCreditNoteDetailsByIdFailure implements Action {
  readonly type =
    CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RaiseTransferRequest implements Action {
  readonly type = CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST;
  constructor(public payload: RequestTransferPayload) {}
}
export class RaiseTransferRequestSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_SUCCESS;
  constructor(public payload: { requestNo: string }) {}
}
export class RaiseTransferRequestFailure implements Action {
  readonly type = CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LegacyCNOutwardTransfer implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER;
  constructor(public payload: LegacyCNTransferPayload) {}
}
export class LegacyCNOutwardTransferSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_SUCCESS;
  constructor(public payload: LegacyOutwardTransferResponsePayload) {}
}
export class LegacyCNOutwardTransferFailure implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LegacyCNInwardTransfer implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER;
  constructor(public payload: LegacyCNTransferPayload) {}
}
export class LegacyCNInwardTransferSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_SUCCESS;
  constructor(public payload: LegacyInwardTransferResponsePayload) {}
}
export class LegacyCNInwardTransferFailure implements Action {
  readonly type = CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadTransferRequests implements Action {
  readonly type = CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS;
  constructor(public payload: LoadCnTransferRequestsPayload) {}
}
export class LoadTransferRequestsSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_SUCCESS;
  constructor(public payload: SendRequestResponsePayload) {}
}
export class LoadTransferRequestsFailure implements Action {
  readonly type = CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class InwardCreditNote implements Action {
  readonly type = CreditNotetransferActionTypes.INWARD_CN;
  constructor(public payload: InwardCnPayload) {}
}
export class InwardCreditNoteSuccess implements Action {
  readonly type = CreditNotetransferActionTypes.INWARD_CN_SUCCESS;
  constructor(public payload: CNDetailsInfo) {}
}
export class InwardCreditNoteFailure implements Action {
  readonly type = CreditNotetransferActionTypes.INWARD_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ApproveOrRejectCnTransfer implements Action {
  readonly type = CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER;
  constructor(public payload: ApproveOrRejectCnTransferPayaload) {}
}
export class ApproveOrRejectCnTransferSuccess implements Action {
  readonly type =
    CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_SUCCESS;
  constructor(public payload: boolean) {}
}
export class ApproveOrRejectCnTransferFailure implements Action {
  readonly type =
    CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CancelCnTransferRequest implements Action {
  readonly type = CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST;
  constructor(public payload: InwardCnPayload) {}
}
export class CancelCnTransferRequestSuccess implements Action {
  readonly type =
    CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST_SUCCESS;
  constructor(public payload: boolean) {}
}
export class CancelCnTransferRequestFailure implements Action {
  readonly type =
    CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetListPage implements Action {
  readonly type = CreditNotetransferActionTypes.RESET_LIST_PAGE;
}
export class ResetSearch implements Action {
  readonly type = CreditNotetransferActionTypes.RESET_SEARCH;
}

export class ResetCnTransfer implements Action {
  readonly type = CreditNotetransferActionTypes.RESET_CN_TRANSFER_DETAILS;
}

export type CreditNoteTransferActions =
  | GetLocationCodes
  | GetLocationCodesSuccess
  | GetLocationCodesFailure
  | GetLegacyLocationCodes
  | GetLegacyLocationCodesSuccess
  | GetLegacyLocationCodesFailure
  | SearchCreditNotes
  | SearchCreditNotesSuccess
  | SearchCreditNotesFailure
  | GetCreditNoteDetailsById
  | GetCreditNoteDetailsByIdSuccess
  | GetCreditNoteDetailsByIdFailure
  | RaiseTransferRequest
  | RaiseTransferRequestSuccess
  | RaiseTransferRequestFailure
  | LegacyCNOutwardTransfer
  | LegacyCNOutwardTransferSuccess
  | LegacyCNOutwardTransferFailure
  | LegacyCNInwardTransfer
  | LegacyCNInwardTransferSuccess
  | LegacyCNInwardTransferFailure
  | LoadTransferRequests
  | LoadTransferRequestsSuccess
  | LoadTransferRequestsFailure
  | InwardCreditNote
  | InwardCreditNoteSuccess
  | InwardCreditNoteFailure
  | ApproveOrRejectCnTransfer
  | ApproveOrRejectCnTransferSuccess
  | ApproveOrRejectCnTransferFailure
  | CancelCnTransferRequest
  | CancelCnTransferRequestSuccess
  | CancelCnTransferRequestFailure
  | ResetSearch
  | ResetListPage
  | ResetCnTransfer;
