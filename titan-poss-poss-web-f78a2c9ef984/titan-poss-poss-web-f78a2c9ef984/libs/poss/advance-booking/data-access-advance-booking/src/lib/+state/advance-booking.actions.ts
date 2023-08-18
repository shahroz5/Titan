import { Action } from '@ngrx/store';
import {
  CustomErrors,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingDetailsResponse,
  AdvanceBookingSearchPayload,
  ABSearchResponse,
  RequestPayload,
  ABRequestStatusList,
  ABRequestStatusDownValues,
  ABSearchValues,
  workflowPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  ValidateABMetalRatePayload
} from '@poss-web/shared/models';

export enum AdvanceBookingActionTypes {
  SEARCH_AB = '[Advance Booking] Search Advance Booking',
  SEARCH_AB_SUCCESS = '[Advance Booking] Search Advance Booking Success',
  SEARCH_AB_FAILURE = '[Advance Booking] Search Advance Booking Failure',

  CREATE_CASH_MEMO = '[Advance Booking] Create Advance Booking',
  CREATE_CASH_MEMO_SUCCESS = '[Advance Booking] Create Advance Booking Success',
  CREATE_CASH_MEMO_FAILURE = '[Advance Booking] Create Advance Booking Failure',

  VIEW_CASH_MEMO = '[Advance Booking] View Advance Booking',
  VIEW_CASH_MEMO_SUCCESS = '[Advance Booking] View Advance Booking Success',
  VIEW_CASH_MEMO_FAILURE = '[Advance Booking] View Advance Booking Failure',

  PARTIAL_UPDATE_CASH_MEMO = '[Advance Booking] Partial Update Advance Booking',
  PARTIAL_UPDATE_CASH_MEMO_SUCCESS = '[Advance Booking] Partial Update Advance Booking Success',
  PARTIAL_UPDATE_CASH_MEMO_FAILURE = '[Advance Booking] Partial Update Advance Booking Failure',

  FREEZE_ADVANCE_BOOKING = '[Advance Booking] Freeeze Advance Booking',
  FREEZE_ADVANCE_BOOKING_SUCCESS = '[Advance Booking] Freeeze Advance Booking Success',
  FREEZE_ADVANCE_BOOKING_FAILURE = '[Advance Booking] Freeeze Advance Booking Failure',

  UPDATE_CASH_MEMO = '[Advance Booking] Update Advance Booking',
  UPDATE_CASH_MEMO_SUCCESS = '[Advance Booking] Update Advance Booking Success',
  UPDATE_CASH_MEMO_FAILURE = '[Advance Booking] Update Advance Booking Failure',

  DELETE_CASH_MEMO = '[Advance Booking] Delete Advance Booking',
  DELETE_CASH_MEMO_SUCCESS = '[Advance Booking] Delete Advance Booking Success',
  DELETE_CASH_MEMO_FAILURE = '[Advance Booking] Delete Advance Booking Failure',

  UPDATE_PRICE_DETAILS = '[Advance Booking]  Update Price Details',
  UPDATE_PRICE_DETAILS_SUCCESS = '[Advance Booking]  Update Price Details Success',
  UPDATE_PRICE_DETAILS_FAILURE = '[Advance Booking]  Update Price Details Failure',

  LOAD_SELECTED_LOTNUMBER_DETAILS = '[Advance Booking] Load Selected LotNumber Details',

  RESET_VALUES = '[Advance Booking] Reset Values',
  RESET_LOTNUMBER_VALUES = '[Advance Booking] Reset LotNumber Values',
  RESET_PRODUCT_VALUES = '[Advance Booking] Reset Product Values',

  CLEAR_SEARCH_PRODUCT_LIST = '[ Advance Booking ]  Clear Search Product List',
  CLEAR_PRODUCT_DETAILS = '[ Advance Booking ]  Clear Product Details',
  CLEAR_PRODUCT_RELATED_DETAILS = '[ Advance Booking ]  Clear Product Related Details',

  LOAD_REQUESTS = '[Advance Booking] LOAD REQUESTS LIST',
  LOAD_REQUESTS_SUCCESS = '[Advance Booking] LOAD REQUESTS LIST Success',
  LOAD_REQUESTS_FAILURE = '[Advance Booking] LOAD REQUESTS LIST Failure',

  SET_TOTAL_PRODUCT_VALUES = '[Advance Booking] Set Total Product Values',

  LOAD_SELECTED = '[Advance Booking] Load Selected Data',
  CLEAR_SEARCH_LIST = '[Advance Booking] Clear Search List',
  SET_DROPDOWN_VALUE = '[Advance Booking] Set Dropdown Values',
  SET_SEARCH_VALUES = '[Advance Booking] Set Search Values',
  RESET_SEARCH_VALUES = '[Advance Booking] Reset Search Values',
  SET_ORDER_NUMBER = '[Advance Booking] Set Order Number',

  LOAD_WORKFLOW_DETAILS = '[Advance Booking] Load Workflow Details',
  LOAD_WORKFLOW_DETAILS_SUCCESS = '[Advance Booking] Load Workflow Details Success',
  LOAD_WORKFLOW_DETAILS_FAILURE = '[Advance Booking] Load Workflow Details Failure',

  FILE_UPLOAD = '[Advance Booking] File Upload',
  FILE_UPLOAD_SUCCESS = '[Advance Booking] File Upload Success',
  FILE_UPLOAD_FAILURE = '[Advance Booking] File Upload Failure',

  FILE_UPLOAD_LIST = '[Advance Booking] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[Advance Booking] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[Advance Booking] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[Advance Booking] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[Advance Booking] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[Advance Booking] File Download Url Failure',

  VALIDATE_METAL_RATE = '[Advance Booking]  Validate Metal Rate',
  VALIDATE_METAL_RATE_SUCCESS = '[Advance Booking]  Validate Metal Rate Success',
  VALIDATE_METAL_RATE_FAILURE = '[Advance Booking]  Validate Metal Rate Failure',
  
  RESET_SEARCH_AB_DETAILS = '[Advance Booking] Reset Search Advance Booking Details'
}

export class CreateCashMemo implements Action {
  readonly type = AdvanceBookingActionTypes.CREATE_CASH_MEMO;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class CreateCashMemoSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.CREATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class CreateCashMemoFailure implements Action {
  readonly type = AdvanceBookingActionTypes.CREATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SearchAB implements Action {
  readonly type = AdvanceBookingActionTypes.SEARCH_AB;
  constructor(readonly payload: AdvanceBookingSearchPayload) {}
}

export class SearchABSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.SEARCH_AB_SUCCESS;
  constructor(readonly payload: ABSearchResponse) {}
}

export class SearchABFailure implements Action {
  readonly type = AdvanceBookingActionTypes.SEARCH_AB_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ViewCashMemo implements Action {
  readonly type = AdvanceBookingActionTypes.VIEW_CASH_MEMO;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class ViewCashMemoSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.VIEW_CASH_MEMO_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class ViewCashMemoFailure implements Action {
  readonly type = AdvanceBookingActionTypes.VIEW_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadSelectedData implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_SELECTED;
  constructor(public payload: any) {}
}

export class LoadRequests implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_REQUESTS;

  constructor(readonly payload: RequestPayload) {}
}

export class LoadRequestsSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_REQUESTS_SUCCESS;
  constructor(readonly payload: ABRequestStatusList) {}
}
export class LoadRequestsFailure implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadWorkflowDeatils implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS;

  constructor(readonly payload: workflowPayload) {}
}

export class LoadWorkflowDeatilsSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadWorkflowDeatilsFailure implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartialUpdateCashMemo implements Action {
  readonly type = AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class PartialUpdateCashMemoSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class PartialUpdateCashMemoFailure implements Action {
  readonly type = AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: AdvanceBookingDetailsResponse;
    }
  ) {}
}
export class FreezeAdvanceBooking implements Action {
  readonly type = AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class FreezeAdvanceBookingSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class FreezeAdvanceBookingFailure implements Action {
  readonly type = AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class UpdateCashMemo implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_CASH_MEMO;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class UpdateCashMemoSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class UpdateCashMemoFailure implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteCashMemo implements Action {
  readonly type = AdvanceBookingActionTypes.DELETE_CASH_MEMO;
  constructor(readonly payload: AdvanceBookingDetailsRequestPayload) {}
}

export class DeleteCashMemoSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.DELETE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: boolean) {}
}

export class DeleteCashMemoFailure implements Action {
  readonly type = AdvanceBookingActionTypes.DELETE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdatePriceDetails implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS;
  constructor(
    readonly payload: AdvanceBookingDetailsRequestPayload,
    readonly action?: string
  ) {}
}

export class UpdatePriceDetailsSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_SUCCESS;
  constructor(readonly payload: AdvanceBookingDetailsResponse) {}
}

export class UpdatePriceDetailsFailure implements Action {
  readonly type = AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadSelectedLotNumberDetails implements Action {
  readonly type = AdvanceBookingActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS;
  constructor(public payload: string) {}
}

export class ResetValues implements Action {
  readonly type = AdvanceBookingActionTypes.RESET_VALUES;
}

export class ResetLotNumberValues implements Action {
  readonly type = AdvanceBookingActionTypes.RESET_LOTNUMBER_VALUES;
}

export class ResetProductValues implements Action {
  readonly type = AdvanceBookingActionTypes.RESET_PRODUCT_VALUES;
}

export class ClearSearchProductList implements Action {
  readonly type = AdvanceBookingActionTypes.CLEAR_SEARCH_PRODUCT_LIST;
}

export class ClearProductDetails implements Action {
  readonly type = AdvanceBookingActionTypes.CLEAR_PRODUCT_DETAILS;
}

export class ClearProductRelatedDetails implements Action {
  readonly type = AdvanceBookingActionTypes.CLEAR_PRODUCT_RELATED_DETAILS;
}

export class ClearSearchList implements Action {
  readonly type = AdvanceBookingActionTypes.CLEAR_SEARCH_LIST;
}

export class SetDropownValues implements Action {
  readonly type = AdvanceBookingActionTypes.SET_DROPDOWN_VALUE;
  constructor(public payload: ABRequestStatusDownValues) {}
}

export class SetSearchValues implements Action {
  readonly type = AdvanceBookingActionTypes.SET_SEARCH_VALUES;
  constructor(public payload: ABSearchValues) {}
}

export class ResetSearchValues implements Action {
  readonly type = AdvanceBookingActionTypes.RESET_SEARCH_VALUES;
}

export class SetOrderNumber implements Action {
  readonly type = AdvanceBookingActionTypes.SET_ORDER_NUMBER;
  constructor(public payload: number, public status: string) {}
}
export class FileUpload implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}

export class FileUploadFailure implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = AdvanceBookingActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ValidateMetalRate implements Action {
  readonly type = AdvanceBookingActionTypes.VALIDATE_METAL_RATE;
  constructor(readonly payload: ValidateABMetalRatePayload) {}
}

export class ValidateMetalRateSuccess implements Action {
  readonly type = AdvanceBookingActionTypes.VALIDATE_METAL_RATE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ValidateMetalRateFailure implements Action {
  readonly type = AdvanceBookingActionTypes.VALIDATE_METAL_RATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetSearchABDetails implements Action {
  readonly type = AdvanceBookingActionTypes.RESET_SEARCH_AB_DETAILS;
}

export type AdvanceBookingActions =
  | CreateCashMemo
  | CreateCashMemoSuccess
  | CreateCashMemoFailure
  | ViewCashMemo
  | ViewCashMemoSuccess
  | ViewCashMemoFailure
  | PartialUpdateCashMemo
  | PartialUpdateCashMemoSuccess
  | PartialUpdateCashMemoFailure
  | UpdateCashMemo
  | UpdateCashMemoSuccess
  | UpdateCashMemoFailure
  | SetSearchValues
  | DeleteCashMemo
  | LoadWorkflowDeatils
  | LoadWorkflowDeatilsFailure
  | LoadWorkflowDeatilsSuccess
  | DeleteCashMemoSuccess
  | DeleteCashMemoFailure
  | SetOrderNumber
  | UpdatePriceDetails
  | UpdatePriceDetailsSuccess
  | UpdatePriceDetailsFailure
  | FreezeAdvanceBooking
  | FreezeAdvanceBookingSuccess
  | ClearSearchList
  | SearchAB
  | SearchABSuccess
  | SearchABFailure
  | SetDropownValues
  | FreezeAdvanceBookingFailure
  | LoadSelectedLotNumberDetails
  | ResetValues
  | ResetSearchValues
  | LoadRequests
  | LoadRequestsSuccess
  | LoadRequestsFailure
  | ResetLotNumberValues
  | ResetProductValues
  | ClearSearchProductList
  | ClearProductDetails
  | LoadSelectedData
  | ClearProductRelatedDetails
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | ValidateMetalRate
  | ValidateMetalRateSuccess
  | ValidateMetalRateFailure
  | ResetSearchABDetails;
