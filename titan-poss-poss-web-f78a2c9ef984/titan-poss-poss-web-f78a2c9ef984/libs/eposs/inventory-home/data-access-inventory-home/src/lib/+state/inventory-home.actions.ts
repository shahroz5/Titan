import { CustomErrors } from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export interface LoadSTNCountPayload {
  pendingFactorySTNCount: number;
  pendingBoutiqueSTNCount: number;
  pendingMerchandiseSTNcount: number;
}

export interface LoadReceiveInvoicePayload {
  pendingCFASTNCount: number;
}
export interface LoadIssueSTNCountsPayload {
  pendingIssueBTQ_BTQ_STNCount: number;
  pendingIssueBTQ_FAC_STNCount: number;
  pendingIssueBTQ_MER_STNCount: number;
}

export enum InventoryHomeActionTypes {
  LOAD_STN_COUNT = '[Inventory-Home] Load STNCount',
  LOAD_STN_COUNT_SUCCESS = '[Inventory-Home] Load STNCount Success',
  LOAD_STN_COUNT_FAILURE = '[Inventory-Home] Load STNCount Failure',

  LOAD_INVOICE_COUNT = '[Inventory-Home] Load InvoiceCount',
  LOAD_INVOICE_COUNT_SUCCESS = '[Inventory-Home] Load  InvoiceCount Success',
  LOAD_INVOICE_COUNT_FAILURE = '[Inventory-Home] Load  InvoiceCount Failure',

  LOAD_ISSUES_COUNT = '[Inventory-Home] Load IssueSTNCount',
  LOAD_ISSUES_COUNT_SUCCESS = '[Inventory-Home] Load IssueSTNCount Success',
  LOAD_ISSUES_COUNT_FAILURE = '[Inventory-Home] Load IssueSTNCount Failure',

  RESET_ERROR = '[InventoryHome] Reset Error'
}

export class LoadSTNCount implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_STN_COUNT;
}

export class LoadSTNCountSuccess implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_STN_COUNT_SUCCESS;
  constructor(public payload: LoadSTNCountPayload) {}
}

export class LoadSTNCountFailure implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_STN_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadInvoiceCount implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_INVOICE_COUNT;
}

export class LoadInvoiceCountSuccess implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_INVOICE_COUNT_SUCCESS;
  constructor(public payload: LoadReceiveInvoicePayload) {}
}

export class LoadInvoiceCountFailure implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_INVOICE_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssueSTNCount implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_ISSUES_COUNT;
}
export class LoadIssueSTNCountSuccess implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_ISSUES_COUNT_SUCCESS;
  constructor(public payload: LoadIssueSTNCountsPayload) {}
}
export class LoadIssueSTNCountFailure implements Action {
  readonly type = InventoryHomeActionTypes.LOAD_ISSUES_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = InventoryHomeActionTypes.RESET_ERROR;
}

export type InventoryHomeActions =
  | LoadSTNCount
  | LoadSTNCountSuccess
  | LoadSTNCountFailure
  | LoadInvoiceCount
  | LoadInvoiceCountSuccess
  | LoadInvoiceCountFailure
  | LoadIssueSTNCount
  | LoadIssueSTNCountSuccess
  | LoadIssueSTNCountFailure
  | ResetError;
