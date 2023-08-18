import { Action } from '@ngrx/store';
import {
  CustomErrors,
  PayerBankDetails,
  PayerBanksPayload,
  FileResponse,
  PayerBankMasterResponse
} from '@poss-web/shared/models';
export enum PayerBankActionTypes {
  LOAD_PAYER_BANKS = '[payer-bank]Load Payer anks',
  LOAD_PAYER_BANKS_SUCCESS = '[payer-bank]Load Payer Banks Success',
  LOAD_PAYER_BANKS_FAILURE = '[payer-bank]Load Payer Banks Failure',

  RESET_FILE_DATA = '[payer-bank]Reset File Data',

  FILE_UPLOAD = '[payer-bank]  File Upload',
  FILE_UPLOAD_SUCCESS = '[payer-bank]  File Upload Success',
  FILE_UPLOAD_FAILURE = '[payer-bank]  File Upload Failure',

  SEARCH_PAYER_BANK = '[payer-bank]Search Payer Bank',
  SEARCH_PAYER_BANK_SUCCESS = '[payer-bank]Search Payer Bank Success',
  SEARCH_PAYER_BANK_FAILURE = '[payer-bank]Search Payer Bank Failure',

  ERROR_LOG_DOWNLOAD = '[payer-bank] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[payer-bank] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[payer-bank] Download Error Log Failure'
}

export class LoadPayerBanks implements Action {
  readonly type = PayerBankActionTypes.LOAD_PAYER_BANKS;
  constructor(public payload: PayerBanksPayload) {}
}
export class LoadPayerBanksSuccess implements Action {
  readonly type = PayerBankActionTypes.LOAD_PAYER_BANKS_SUCCESS;
  constructor(public payload: PayerBankMasterResponse) {}
}
export class LoadPayerBanksFailure implements Action {
  readonly type = PayerBankActionTypes.LOAD_PAYER_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetFileData implements Action {
  readonly type = PayerBankActionTypes.RESET_FILE_DATA;
}
export class FileUpload implements Action {
  readonly type = PayerBankActionTypes.FILE_UPLOAD;
  constructor(public payload: FormData) {}
}
export class FileUploadSuccess implements Action {
  readonly type = PayerBankActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: FileResponse) {}
}
export class FileUploadFailure implements Action {
  readonly type = PayerBankActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchPayerBank implements Action {
  readonly type = PayerBankActionTypes.SEARCH_PAYER_BANK;
  constructor(public payload: string) {}
}
export class SearchPayerBankSuccess implements Action {
  readonly type = PayerBankActionTypes.SEARCH_PAYER_BANK_SUCCESS;
  constructor(public payload: PayerBankDetails[]) {}
}
export class SearchPayerBankFailure implements Action {
  readonly type = PayerBankActionTypes.SEARCH_PAYER_BANK_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ErrorLogDownload implements Action {
  readonly type = PayerBankActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public payload: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type = PayerBankActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ErrorLogDownloadFailure implements Action {
  readonly type = PayerBankActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type PayerBankActions =
  | ResetFileData
  | LoadPayerBanks
  | LoadPayerBanksSuccess
  | LoadPayerBanksFailure
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | SearchPayerBank
  | SearchPayerBankSuccess
  | SearchPayerBankFailure
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure;
