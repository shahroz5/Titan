import { Action } from '@ngrx/store';
import {
  CustomErrors,
  FileData,
  InvoiceListPayload,
  InvoiceListResponse
} from '@poss-web/shared/models';

export enum DocumentsSearchActionTypes {
  LOAD_INVOICE_LIST = '[documents-search] Load Invoice List',
  LOAD_INVOICE_LIST_SUCCESS = '[documents-search] Load Invoice List Success',
  LOAD_INVOICE_LIST_FAILURE = '[documents-search] Load Invoice List Failure',
  DOCUMENT_DOWNLOAD = '[documents-search] Load Document Download',
  DOCUMENT_DOWNLOAD_SUCCESS = '[documents-search] Load Document Download Success',
  DOCUMENT_DOWNLOAD_FAILURE = '[documents-search] Load Document Download Failure',
  RESET_DOCUMENTS_SEARCH = '[documents-search] Load Documents Search'
}

export class LoadInvoiceList implements Action {
  readonly type = DocumentsSearchActionTypes.LOAD_INVOICE_LIST;
  constructor(
    public payload: InvoiceListPayload,
    public txnType: string,
    public page: number,
    public size: number
  ) {}
}

export class LoadInvoiceListSuccess implements Action {
  readonly type = DocumentsSearchActionTypes.LOAD_INVOICE_LIST_SUCCESS;
  constructor(public payload: InvoiceListResponse) {}
}

export class LoadInvoiceListFailure implements Action {
  readonly type = DocumentsSearchActionTypes.LOAD_INVOICE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DownloadDocument implements Action {
  readonly type = DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD;
  constructor(public payload: FileData) {}
}
export class DownloadDocumentSuccess implements Action {
  readonly type = DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_SUCCESS;
}
export class DownloadDocumentFailure implements Action {
  readonly type = DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetDocumentsSearch implements Action {
  readonly type = DocumentsSearchActionTypes.RESET_DOCUMENTS_SEARCH;

}

export type DocumentsSearchActions =
  | LoadInvoiceList
  | LoadInvoiceListSuccess
  | LoadInvoiceListFailure
  | DownloadDocument
  | DownloadDocumentSuccess
  | DownloadDocumentFailure
  | ResetDocumentsSearch;
