import { Action } from '@ngrx/store';
import {
  CustomErrors,
  InitiateAdvanceResponse,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse,
  PartialUpdateAdvanceRequestPayload,
  FrozenCNs,
  CreditNote,
  MergeCNPayload,
  MergeCNResponse,
  AdvanceHistoryItemsRequestPayload,
  AdvanceHistoryResponse,
  HistorySearchParamDetails,
  RsoNameObject,
  FileUploadDownloadPayload,
  FileUploadLists
} from '@poss-web/shared/models';

export enum CtGrfActionTypes {
  SET_SELECTED_RSO_NAME = '[GRF] Selected Rso Name',
  SET_TOTAL_AMOUNT = '[GRF] Set Total Amount',
  INITIATE_GRF = '[GRF] Initiate Grf',
  INITIATE_GRF_SUCCESS = '[GRF] Initiate Grf Success',
  INITIATE_GRF_FAILURE = '[GRF] Initiate Grf Failure',
  UPDATE_GRF = '[GRF] Update Grf',
  UPDATE_GRF_SUCCESS = '[GRF] Update Grf Success',
  UPDATE_GRF_FAILURE = '[GRF] Update Grf Failure',
  PARTIALLY_UPDATE_GRF = '[GRF] Partially Update Grf',
  PARTIALLY_UPDATE_GRF_SUCCESS = '[GRF] Partially Update Grf Success',
  PARTIALLY_UPDATE_GRF_FAILURE = '[GRF] Partially Update Grf Failure',
  RESET_GRF = '[GRF] Reset Grf',
  SET_GOLD_WEIGHT = '[GRF] Set Gold Weight',
  LOAD_RSO_DETAILS = '[GRF] Load Rso Details',
  LOAD_RSO_DETAILS_SUCCESS = '[GRF] Load Rso Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[GRF] Load Rso Details Failure',
  SET_REMARKS = '[GRF] Set Remarks',
  VIEW_GRF = '[GRF] View GRF',
  VIEW_GRF_SUCCESS = '[GRF] View GRF Success',
  VIEW_GRF_FAILURE = '[GRF] View GRF Failure',
  //merging CN'S
  LOAD_FROZEN_CNS = '[GRF] Load Frozen CNs',
  LOAD_FROZEN_CNS_SUCCESS = '[GRF] Load Frozen CNs Success',
  LOAD_FROZEN_CNS_FAILURE = '[GRF] Load Frozen CNs Failure',

  SEARCH_GRF = '[GRF] Search GRF',
  SEARCH_GRF_SUCCESS = '[GRF]Search GRF Success',
  SEARCH_GRF_FAILURE = '[GRF] Search GRF Failure',

  MERGE_CNS = '[GRF] Merge CNs',
  MERGE_CNS_SUCCESS = '[GRF]Merge CNs Success',
  MERGE_CNS_FAILURE = '[GRF]Merge CNs Failure',

  GENERATE_OTP = '[GRF] Generate OTP',
  GENERATE_OTP_SUCCESS = '[GRF] Generate OTP Success',
  GENERATE_OTP_FAILURE = '[GRF] Generate OTP Failure',

  VALIDATE_OTP = '[GRF] Validate OTP',
  VALIDATE_OTP_SUCCESS = '[GRF] Validate OTP Success',
  VALIDATE_OTP_FAILURE = '[GRF] Validate OTP Failure',

  REMOVE_GRF_CN = '[GRF] Remove GRF CN',

  REMOVE_ALL_GRF_CNS = '[GRF] Remove ALL GRF CN',

  LOAD_GRF_HISTORY = '[GRF] Load Grf History',
  LOAD_GRF_HISTORY_SUCCESS = '[GRF] Load Grf History Success',
  LOAD_GRF_HISTORY_FAILURE = '[GRF] Load Grf History Failure',
  SET_HISTORY_SEARCH_PARAM_DETAILS = '[GRF] Set History Grf Search Param Details',
  SET_ORDER_NUMBER = '[Accept Advance] Set Order Number',

  LOAD_CN_VALIDATION_DETAILS = '[GRF] Load CN Validation Details',
  LOAD_CN_VALIDATION_DETAILS_SUCCESS = '[GRF] Load CN Validation Details Success',
  LOAD_CN_VALIDATION_DETAILS_FAILURE = '[GRF] Load CN Validation Details Failure',

  FILE_UPLOAD = '[ GRF] File Upload',
  FILE_UPLOAD_SUCCESS = '[ GRF] File Upload Success',
  FILE_UPLOAD_FAILURE = '[ GRF] File Upload Failure',

  FILE_UPLOAD_LIST = '[ GRF] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[ GRF] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[ GRF] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[ GRF] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[ GRF] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[ GRF] File Download Url Failure'
}

export class SetSelectedRsoName implements Action {
  readonly type = CtGrfActionTypes.SET_SELECTED_RSO_NAME;
  constructor(readonly payload: { value: string; description: string }) {}
}

export class SetTotalAmount implements Action {
  readonly type = CtGrfActionTypes.SET_TOTAL_AMOUNT;
  constructor(readonly payload: number) {}
}

export class InitiateGrf implements Action {
  readonly type = CtGrfActionTypes.INITIATE_GRF;
  constructor(readonly subTransactionType: string, readonly requestBody: any) {}
}

export class InitiateGrfSuccess implements Action {
  readonly type = CtGrfActionTypes.INITIATE_GRF_SUCCESS;
  constructor(readonly payload: InitiateAdvanceResponse) {}
}

export class InitiateGrfFailure implements Action {
  readonly type = CtGrfActionTypes.INITIATE_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateGrf implements Action {
  readonly type = CtGrfActionTypes.UPDATE_GRF;
  constructor(
    readonly subTransactionType: string,
    readonly id: string,
    readonly requestPayload: UpdateAdvanceRequestPayload
  ) {}
}

export class UpdateGrfSuccess implements Action {
  readonly type = CtGrfActionTypes.UPDATE_GRF_SUCCESS;
  constructor(readonly payload: UpdateAdvanceTransactionResponse) {}
}

export class UpdateGrfFailure implements Action {
  readonly type = CtGrfActionTypes.UPDATE_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartiallyUpdateGrf implements Action {
  readonly type = CtGrfActionTypes.PARTIALLY_UPDATE_GRF;
  constructor(
    readonly subTransactionType: string,
    readonly id: string,
    readonly requestPayload: PartialUpdateAdvanceRequestPayload
  ) {}
}

export class PartiallyUpdateGrfSuccess implements Action {
  readonly type = CtGrfActionTypes.PARTIALLY_UPDATE_GRF_SUCCESS;
  constructor(readonly payload: any) {}
}

export class PartiallyUpdateGrfFailure implements Action {
  readonly type = CtGrfActionTypes.PARTIALLY_UPDATE_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetGrf implements Action {
  readonly type = CtGrfActionTypes.RESET_GRF;
}

export class SetGoldWeight implements Action {
  readonly type = CtGrfActionTypes.SET_GOLD_WEIGHT;
  constructor(readonly goldWeight: number) {}
}

export class LoadRsoDetails implements Action {
  readonly type = CtGrfActionTypes.LOAD_RSO_DETAILS;
  constructor(readonly payload: string) {}
}

export class LoadRsoDetailsSuccess implements Action {
  readonly type = CtGrfActionTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(readonly payload: RsoNameObject[]) {}
}

export class LoadRsoDetailsFailure implements Action {
  readonly type = CtGrfActionTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetRemarks implements Action {
  readonly type = CtGrfActionTypes.SET_REMARKS;
  constructor(readonly payload: string) {}
}

export class ViewGrf implements Action {
  readonly type = CtGrfActionTypes.VIEW_GRF;
  constructor(readonly subTransactionType: string, readonly payload: string) {}
}

export class ViewGrfSuccess implements Action {
  readonly type = CtGrfActionTypes.VIEW_GRF_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ViewGrfFailure implements Action {
  readonly type = CtGrfActionTypes.VIEW_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

//megrging CN'S
export class LoadFrozenCNs implements Action {
  readonly type = CtGrfActionTypes.LOAD_FROZEN_CNS;
  constructor(readonly payload: string) {}
}
export class LoadFrozenCNsSuccess implements Action {
  readonly type = CtGrfActionTypes.LOAD_FROZEN_CNS_SUCCESS;
  constructor(readonly payload: FrozenCNs[]) {}
}
export class LoadFrozenCNsFailure implements Action {
  readonly type = CtGrfActionTypes.LOAD_FROZEN_CNS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SearchGRF implements Action {
  readonly type = CtGrfActionTypes.SEARCH_GRF;
  constructor(readonly payload: { docNo: string; fiscalYear: string }) {}
}
export class SearchGRFSuccess implements Action {
  readonly type = CtGrfActionTypes.SEARCH_GRF_SUCCESS;
  constructor(readonly payload: CreditNote) {}
}
export class SearchGRFFailure implements Action {
  readonly type = CtGrfActionTypes.SEARCH_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class MergeCNs implements Action {
  readonly type = CtGrfActionTypes.MERGE_CNS;
  constructor(readonly payload: MergeCNPayload) {}
}
export class MergeCNsSuccess implements Action {
  readonly type = CtGrfActionTypes.MERGE_CNS_SUCCESS;
  constructor(readonly payload: MergeCNResponse) {}
}
export class MergeCNsFailure implements Action {
  readonly type = CtGrfActionTypes.MERGE_CNS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GenerateOTP implements Action {
  readonly type = CtGrfActionTypes.GENERATE_OTP;
  constructor(readonly payload: string) {}
}
export class GenerateOTPSuccess implements Action {
  readonly type = CtGrfActionTypes.GENERATE_OTP_SUCCESS;
}
export class GenerateOTPFailure implements Action {
  readonly type = CtGrfActionTypes.GENERATE_OTP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ValidateOTP implements Action {
  readonly type = CtGrfActionTypes.VALIDATE_OTP;
  constructor(readonly payload: { token: string; id: string }) {}
}
export class ValidateOTPSuccess implements Action {
  readonly type = CtGrfActionTypes.VALIDATE_OTP_SUCCESS;
}
export class ValidateOTPFailure implements Action {
  readonly type = CtGrfActionTypes.VALIDATE_OTP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class RemoveGRFCN implements Action {
  readonly type = CtGrfActionTypes.REMOVE_GRF_CN;
  constructor(readonly payload: string) {}
}
export class RemoveALLGRFCNs implements Action {
  readonly type = CtGrfActionTypes.REMOVE_ALL_GRF_CNS;
}

export class SetOrderNumber implements Action {
  readonly type = CtGrfActionTypes.SET_ORDER_NUMBER;
  constructor(public payload: number, public status: string) {}
}

export class LoadGrfHistory implements Action {
  readonly type = CtGrfActionTypes.LOAD_GRF_HISTORY;
  constructor(
    readonly subTransactionType: string,
    readonly payload: AdvanceHistoryItemsRequestPayload,
    readonly searchField: string,
    readonly searchType: string,
    readonly status: string,
    readonly page?: number,
    readonly size?: number
  ) {}
}

export class LoadGrfHistorySuccess implements Action {
  readonly type = CtGrfActionTypes.LOAD_GRF_HISTORY_SUCCESS;
  constructor(readonly payload: AdvanceHistoryResponse) {}
}

export class LoadGrfHistoryFailure implements Action {
  readonly type = CtGrfActionTypes.LOAD_GRF_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetHistoryGrfSearchParamDetails implements Action {
  readonly type = CtGrfActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: HistorySearchParamDetails) {}
}

export class LoadCNValidation implements Action {
  readonly type = CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS;
  constructor(readonly payload: { ruleType: string; requestBody: any }) {}
}
export class LoadCNValidationSuccess implements Action {
  readonly type = CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadCNValidationFailure implements Action {
  readonly type = CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class FileUpload implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadSuccess implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}

export class FileUploadFailure implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = CtGrfActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = CtGrfActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = CtGrfActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = CtGrfActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CtGrfActions =
  | SetSelectedRsoName
  | SetTotalAmount
  | InitiateGrf
  | InitiateGrfSuccess
  | InitiateGrfFailure
  | UpdateGrf
  | UpdateGrfSuccess
  | UpdateGrfFailure
  | PartiallyUpdateGrf
  | PartiallyUpdateGrfSuccess
  | PartiallyUpdateGrfFailure
  | ResetGrf
  | SetGoldWeight
  | LoadRsoDetails
  | LoadRsoDetailsSuccess
  | LoadRsoDetailsFailure
  | SetRemarks
  | ViewGrf
  | ViewGrfSuccess
  | ViewGrfFailure
  | LoadFrozenCNs
  | LoadFrozenCNsSuccess
  | LoadFrozenCNsFailure
  | SearchGRF
  | SearchGRFSuccess
  | SearchGRFFailure
  | MergeCNs
  | MergeCNsSuccess
  | MergeCNsFailure
  | GenerateOTP
  | GenerateOTPSuccess
  | GenerateOTPFailure
  | ValidateOTP
  | ValidateOTPSuccess
  | ValidateOTPFailure
  | RemoveGRFCN
  | RemoveALLGRFCNs
  | LoadGrfHistory
  | LoadGrfHistorySuccess
  | LoadGrfHistoryFailure
  | SetHistoryGrfSearchParamDetails
  | SetOrderNumber
  | LoadCNValidation
  | LoadCNValidationSuccess
  | LoadCNValidationFailure
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure;
