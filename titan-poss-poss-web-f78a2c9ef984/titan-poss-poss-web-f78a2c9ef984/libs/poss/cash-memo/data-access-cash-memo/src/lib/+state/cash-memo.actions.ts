import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CreateCashMemoResponse,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoHistoryRequestPayload,
  CashMemoHistoryResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetails,
  MetalRatesPayload,
  MetalRates,
  FileUploadDownloadPayload,
  FileUploadLists,
  TcsDataResponse,
  ValidateMetalRatePayload
} from '@poss-web/shared/models';

export enum CashMemoActionTypes {
  CREATE_CASH_MEMO = '[  Cash Memo] Create  Cash Memo',
  CREATE_CASH_MEMO_SUCCESS = '[  Cash Memo] Create  Cash Memo Success',
  CREATE_CASH_MEMO_FAILURE = '[  Cash Memo] Create  Cash Memo Failure',

  VIEW_CASH_MEMO = '[ Cash Memo] View  Cash Memo',
  VIEW_CASH_MEMO_SUCCESS = '[ Cash Memo] View  Cash Memo Success',
  VIEW_CASH_MEMO_FAILURE = '[ Cash Memo] View  Cash Memo Failure',

  PARTIAL_UPDATE_CASH_MEMO = '[ Cash Memo] Partial Update  Cash Memo',
  PARTIAL_UPDATE_CASH_MEMO_SUCCESS = '[ Cash Memo] Partial Update  Cash Memo Success',
  PARTIAL_UPDATE_CASH_MEMO_FAILURE = '[ Cash Memo] Partial Update  Cash Memo Failure',

  UPDATE_CASH_MEMO = '[ Cash Memo] Update  Cash Memo',
  UPDATE_CASH_MEMO_SUCCESS = '[ Cash Memo] Update  Cash Memo Success',
  UPDATE_CASH_MEMO_FAILURE = '[ Cash Memo] Update  Cash Memo Failure',

  DELETE_CASH_MEMO = '[ Cash Memo] Delete  Cash Memo',
  DELETE_CASH_MEMO_SUCCESS = '[ Cash Memo] Delete  Cash Memo Success',
  DELETE_CASH_MEMO_FAILURE = '[ Cash Memo] Delete  Cash Memo Failure',

  UPDATE_PRICE_DETAILS = '[ Cash Memo]  Update Price Details',
  UPDATE_PRICE_DETAILS_SUCCESS = '[ Cash Memo]  Update Price Details Success',
  UPDATE_PRICE_DETAILS_FAILURE = '[ Cash Memo]  Update Price Details Failure',

  INVOKE_ORDER_DETAILS = '[ Cash Memo]  Invoke Order Details',
  INVOKE_ORDER_DETAILS_SUCCESS = '[ Cash Memo]  Invoke Order Details Success',
  INVOKE_ORDER_DETAILS_FAILURE = '[ Cash Memo]  Invoke Order Details Failure',

  LOAD_CASH_MEMO_HISTORY = '[ Cash Memo]  Load Cash Memo History',
  LOAD_CASH_MEMO_HISTORY_SUCCESS = '[ Cash Memo]  Load Cash Memo History Success',
  LOAD_CASH_MEMO_HISTORY_FAILURE = '[ Cash Memo]  Load Cash Memo History Failure',

  LOAD_ITEM_FROM_CASH_MEMO_HISTORY = '[ Cash Memo]  Load Item From Cash Memo History',
  LOAD_ITEM_FROM_CASH_MEMO_HISTORY_SUCCESS = '[ Cash Memo]  Load Item From Cash Memo History Success',
  LOAD_ITEM_FROM_CASH_MEMO_HISTORY_FAILURE = '[ Cash Memo]  Load Item From Cash Memo History Failure',

  SET_AB_INVOKED = '[ Cash Memo] Set AB Invoked',

  RESET_VALUES = '[ Cash Memo] Reset Values',

  RESET_HISTORY = '[ Cash Memo] Reset History',

  UPDATE_HISTORY_SEARCH_PARAMETER = '[ Cash Memo] Update history search parameter',

  SET_FOCUS = '[ Cash Memo] Set Focus',

  LOAD_TCS_DETAIL = '[Regular Cash Memo]  Load TCS Detail',
  LOAD_TCS_DETAIL_SUCCESS = '[Regular Cash Memo]  Load TCS Detail Success',
  LOAD_TCS_DETAIL_FAILURE = '[Regular Cash Memo]  Load TCS Detail Failure',

  // Manual CM
  GET_MATERIAL_PRICES = '[ Cash Memo] Get Material Prices',
  GET_MATERIAL_PRICES_SUCCESS = '[ Cash Memo] Get Material Prices Success',
  GET_MATERIAL_PRICES_FAILURE = '[ Cash Memo] Get Material Prices Failure',

  FILE_UPLOAD = '[ Cash Memo] File Upload',
  FILE_UPLOAD_SUCCESS = '[ Cash Memo] File Upload Success',
  FILE_UPLOAD_FAILURE = '[ Cash Memo] File Upload Failure',

  FILE_UPLOAD_LIST = '[ Cash Memo] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[ Cash Memo] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[ Cash Memo] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[ Cash Memo] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[ Cash Memo] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[ Cash Memo] File Download Url Failure',

  VALIDATE_METAL_RATE = '[Cash Memo]  Validate Metal Rate',
  VALIDATE_METAL_RATE_SUCCESS = '[Cash Memo]  Validate Metal Rate Success',
  VALIDATE_METAL_RATE_FAILURE = '[Cash Memo]  Validate Metal Rate Failure',
}

export class LoadItemFromCashMemoHistory implements Action {
  readonly type = CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class LoadItemFromCashMemoHistorySuccess implements Action {
  readonly type = CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_SUCCESS;
  constructor(readonly payload: CashMemoItemDetails) {}
}

export class LoadItemFromCashMemoHistoryFailure implements Action {
  readonly type = CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadCashMemoHistory implements Action {
  readonly type = CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY;
  constructor(readonly payload: CashMemoHistoryRequestPayload) {}
}

export class LoadCashMemoHistorySuccess implements Action {
  readonly type = CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_SUCCESS;
  constructor(readonly payload: CashMemoHistoryResponse) {}
}

export class LoadCashMemoHistoryFailure implements Action {
  readonly type = CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class CreateCashMemo implements Action {
  readonly type = CashMemoActionTypes.CREATE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class CreateCashMemoSuccess implements Action {
  readonly type = CashMemoActionTypes.CREATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CreateCashMemoResponse) {}
}

export class CreateCashMemoFailure implements Action {
  readonly type = CashMemoActionTypes.CREATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ViewCashMemo implements Action {
  readonly type = CashMemoActionTypes.VIEW_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ViewCashMemoSuccess implements Action {
  readonly type = CashMemoActionTypes.VIEW_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ViewCashMemoFailure implements Action {
  readonly type = CashMemoActionTypes.VIEW_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartialUpdateCashMemo implements Action {
  readonly type = CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class PartialUpdateCashMemoSuccess implements Action {
  readonly type = CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class PartialUpdateCashMemoFailure implements Action {
  readonly type = CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: CashMemoDetailsResponse;
      isIGST: boolean;
    }
  ) {}
}

export class UpdateCashMemo implements Action {
  readonly type = CashMemoActionTypes.UPDATE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class UpdateCashMemoSuccess implements Action {
  readonly type = CashMemoActionTypes.UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class UpdateCashMemoFailure implements Action {
  readonly type = CashMemoActionTypes.UPDATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteCashMemo implements Action {
  readonly type = CashMemoActionTypes.DELETE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class DeleteCashMemoSuccess implements Action {
  readonly type = CashMemoActionTypes.DELETE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: boolean) {}
}

export class DeleteCashMemoFailure implements Action {
  readonly type = CashMemoActionTypes.DELETE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdatePriceDetails implements Action {
  readonly type = CashMemoActionTypes.UPDATE_PRICE_DETAILS;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class UpdatePriceDetailsSuccess implements Action {
  readonly type = CashMemoActionTypes.UPDATE_PRICE_DETAILS_SUCCESS;
  constructor(
    readonly payload: { data: CashMemoDetailsResponse; requestDetails: boolean }
  ) {}
}

export class UpdatePriceDetailsFailure implements Action {
  readonly type = CashMemoActionTypes.UPDATE_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetValues implements Action {
  readonly type = CashMemoActionTypes.RESET_VALUES;
}

export class InvokeOrderDetails implements Action {
  readonly type = CashMemoActionTypes.INVOKE_ORDER_DETAILS;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class InvokeOrderDetailsSuccess implements Action {
  readonly type = CashMemoActionTypes.INVOKE_ORDER_DETAILS_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class InvokeOrderDetailsFailure implements Action {
  readonly type = CashMemoActionTypes.INVOKE_ORDER_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetABInvoked implements Action {
  readonly type = CashMemoActionTypes.SET_AB_INVOKED;
  constructor(readonly payload: boolean) {}
}

export class ResetHistory implements Action {
  readonly type = CashMemoActionTypes.RESET_HISTORY;
}

export class UpdateHistorySearchParameter implements Action {
  readonly type = CashMemoActionTypes.UPDATE_HISTORY_SEARCH_PARAMETER;
  constructor(readonly payload: CashMemoHistoryRequestPayload) {}
}

export class SetFocus implements Action {
  readonly type = CashMemoActionTypes.SET_FOCUS;
  constructor(readonly payload: number) {}
}

// Manual CM

export class GetMaterialPrices implements Action {
  readonly type = CashMemoActionTypes.GET_MATERIAL_PRICES;
  constructor(public payload: MetalRatesPayload) {}
}

export class GetMaterialPricesSuccess implements Action {
  readonly type = CashMemoActionTypes.GET_MATERIAL_PRICES_SUCCESS;
  constructor(public payload: MetalRates[]) {}
}

export class GetMaterialPricesFailure implements Action {
  readonly type = CashMemoActionTypes.GET_MATERIAL_PRICES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUpload implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadSuccess implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}

export class FileUploadFailure implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = CashMemoActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = CashMemoActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = CashMemoActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = CashMemoActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTcsDetail implements Action {
  readonly type = CashMemoActionTypes.LOAD_TCS_DETAIL;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class LoadTcsDetailSuccess implements Action {
  readonly type = CashMemoActionTypes.LOAD_TCS_DETAIL_SUCCESS;
  constructor(readonly payload: TcsDataResponse) {}
}

export class LoadTcsDetailFailure implements Action {
  readonly type = CashMemoActionTypes.LOAD_TCS_DETAIL_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ValidateMetalRate implements Action {
  readonly type = CashMemoActionTypes.VALIDATE_METAL_RATE;
  constructor(readonly payload: ValidateMetalRatePayload) {}
}

export class ValidateMetalRateSuccess implements Action {
  readonly type = CashMemoActionTypes.VALIDATE_METAL_RATE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ValidateMetalRateFailure implements Action {
  readonly type = CashMemoActionTypes.VALIDATE_METAL_RATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type CashMemoActions =
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
  | DeleteCashMemo
  | DeleteCashMemoSuccess
  | DeleteCashMemoFailure
  | UpdatePriceDetails
  | UpdatePriceDetailsSuccess
  | UpdatePriceDetailsFailure
  | ResetValues
  | InvokeOrderDetails
  | InvokeOrderDetailsSuccess
  | InvokeOrderDetailsFailure
  | LoadCashMemoHistory
  | LoadCashMemoHistorySuccess
  | LoadCashMemoHistoryFailure
  | LoadItemFromCashMemoHistory
  | LoadItemFromCashMemoHistorySuccess
  | LoadItemFromCashMemoHistoryFailure
  | SetABInvoked
  | ResetHistory
  | UpdateHistorySearchParameter
  | SetFocus
  | GetMaterialPrices
  | GetMaterialPricesSuccess
  | GetMaterialPricesFailure
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | LoadTcsDetail
  | LoadTcsDetailSuccess
  | LoadTcsDetailFailure
  | ValidateMetalRate
  | ValidateMetalRateSuccess
  | ValidateMetalRateFailure;
