import { Action } from '@ngrx/store';
import { CustomErrors, NewFileUploadResponse } from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum DataUploadActionTypes {
  FIR_FILE_UPLOAD = '[data-upload] FIR File Upload',
  FIR_FILE_UPLOAD_SUCCESS = '[data-upload] FIR File Upload Success',
  FIR_FILE_UPLOAD_FAILURE = '[data-upload] FIR File Upload Failure',

  MER_FILE_UPLOAD = '[data-upload] MER File Upload',
  MER_FILE_UPLOAD_SUCCESS = '[data-upload] MER File Upload Success',
  MER_FILE_UPLOAD_FAILURE = '[data-upload] MER File Upload Failure',

  INVOICE_UPLOAD = '[data-upload] Invoice Upload',
  INVOICE_UPLOAD_SUCCESS = '[data-upload] Invoice Upload Success',
  INVOICE_UPLOAD_FAILURE = '[data-upload] Invoice Upload Failure',

  STN_UPLOAD = '[data-upload] STN Upload',
  STN_UPLOAD_SUCCESS = '[data-upload] STN Upload Success',
  STN_UPLOAD_FAILURE = '[data-upload] STN Upload Failure',

  RESET_RESPONSE = '[data-upload] Reset Response'
}

/**
 * Data upload Actions
 */
export class FIRFileUpload implements Action {
  readonly type = DataUploadActionTypes.FIR_FILE_UPLOAD;
  constructor(public payload: FormData) {}
}
export class FIRFileUploadSuccess implements Action {
  readonly type = DataUploadActionTypes.FIR_FILE_UPLOAD_SUCCESS;
  constructor(public payload: NewFileUploadResponse) {}
}
export class FIRFileUploadFailure implements Action {
  readonly type = DataUploadActionTypes.FIR_FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class MERFileUpload implements Action {
  readonly type = DataUploadActionTypes.MER_FILE_UPLOAD;
  constructor(public payload: FormData) {}
}
export class MERFileUploadSuccess implements Action {
  readonly type = DataUploadActionTypes.MER_FILE_UPLOAD_SUCCESS;
  constructor(public payload: NewFileUploadResponse) {}
}
export class MERFileUploadFailure implements Action {
  readonly type = DataUploadActionTypes.MER_FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class InvoiceUpload implements Action {
  readonly type = DataUploadActionTypes.INVOICE_UPLOAD;
}
export class InvoiceUploadSuccess implements Action {
  readonly type = DataUploadActionTypes.INVOICE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}
export class InvoiceUploadFailure implements Action {
  readonly type = DataUploadActionTypes.INVOICE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class STNUpload implements Action {
  readonly type = DataUploadActionTypes.STN_UPLOAD;
}
export class STNUploadSuccess implements Action {
  readonly type = DataUploadActionTypes.STN_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}
export class STNUploadFailure implements Action {
  readonly type = DataUploadActionTypes.STN_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = DataUploadActionTypes.RESET_RESPONSE;
}

/**
 *  Data Upload Action types
 */
export type DataUploadActions =
  | FIRFileUpload
  | FIRFileUploadSuccess
  | FIRFileUploadFailure
  | MERFileUpload
  | MERFileUploadSuccess
  | MERFileUploadFailure
  | InvoiceUpload
  | InvoiceUploadSuccess
  | InvoiceUploadFailure
  | STNUpload
  | STNUploadSuccess
  | STNUploadFailure
  | ResetResponse;
