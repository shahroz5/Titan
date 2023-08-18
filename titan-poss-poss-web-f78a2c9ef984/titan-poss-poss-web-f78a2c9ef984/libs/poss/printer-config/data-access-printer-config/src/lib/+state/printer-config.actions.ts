import { Action } from '@ngrx/store';
import {
  CustomErrors,
  ConfigListingPayload,
  SortItem,
  Lov,
  PrinterConfigList,
  PrinterConfigDetails
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum PrinterConfigActionTypes {
  GET_PRINTER_LIST = '[printer-config] Get Printer List',
  GET_PRINTER_LIST_SUCCESS = '[printer-config] Get Printer List Success',
  GET_PRINTER_LIST_FAILURE = '[printer-config] Get Printer List Failure',

  GET_PRINTER_NAME_LIST = '[printer-config] Get Printer Name List',
  GET_PRINTER_NAME_LIST_SUCCESS = '[printer-config] Get Printer Name List Success',
  GET_PRINTER_NAME_LIST_FAILURE = '[printer-config] Get Printer Name List Failure',

  ADD_PRINTER = '[printer-config] Add Printer',
  ADD_PRINTER_SUCCESS = '[printer-config] Add Printer Success',
  ADD_PRINTER_FAILURE = '[printer-config] Add Printer Failure',

  DELETE_PRINTER = '[printer-config] Delete Printer',
  DELETE_PRINTER_SUCCESS = '[printer-config] Delete Printer Success',
  DELETE_PRINTER_FAILURE = '[printer-config] Delete Printer Failure',

  GET_DOC_TYPE = '[printer-config] Get Doc Type',
  GET_DOC_TYPE_SUCCESS = '[printer-config] Get Doc Type Success',
  GET_DOC_TYPE_FAILURE = '[printer-config] Get Doc Type Failure',

  RESET_RESPONSE = '[printer-config] Reset Response'
}

export class GetPrinterList implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_LIST;
  constructor(
    public payload: ConfigListingPayload,
    public sortField?: SortItem
  ) {}
}
export class GetPrinterListSuccess implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_LIST_SUCCESS;
  constructor(public payload: PrinterConfigList) {}
}
export class GetPrinterListFailure implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = PrinterConfigActionTypes.RESET_RESPONSE;
}

export class GetPrinterNameList implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_NAME_LIST;
}
export class GetPrinterNameListSuccess implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_SUCCESS;
  constructor(public payload: string[]) {}
}
export class GetPrinterNameListFailure implements Action {
  readonly type = PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddPrinter implements Action {
  readonly type = PrinterConfigActionTypes.ADD_PRINTER;
  constructor(public payload: PrinterConfigDetails) {}
}
export class AddPrinterSuccess implements Action {
  readonly type = PrinterConfigActionTypes.ADD_PRINTER_SUCCESS;
  constructor(public payload: PrinterConfigDetails) {}
}
export class AddPrinterFailure implements Action {
  readonly type = PrinterConfigActionTypes.ADD_PRINTER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeletePrinter implements Action {
  readonly type = PrinterConfigActionTypes.DELETE_PRINTER;
  constructor(public payload: PrinterConfigDetails) {}
}
export class DeletePrinterSuccess implements Action {
  readonly type = PrinterConfigActionTypes.DELETE_PRINTER_SUCCESS;
  constructor(public payload: PrinterConfigDetails) {}
}
export class DeletePrinterFailure implements Action {
  readonly type = PrinterConfigActionTypes.DELETE_PRINTER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetDocType implements Action {
  readonly type = PrinterConfigActionTypes.GET_DOC_TYPE;
}
export class GetDocTypeSuccess implements Action {
  readonly type = PrinterConfigActionTypes.GET_DOC_TYPE_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class GetDocTypeFailure implements Action {
  readonly type = PrinterConfigActionTypes.GET_DOC_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

/**
 *  Data Upload Action types
 */
export type PrinterConfigActions =
  | ResetResponse
  | GetDocType
  | GetDocTypeFailure
  | GetDocTypeSuccess
  | GetPrinterList
  | GetPrinterNameList
  | GetPrinterNameListSuccess
  | GetPrinterNameListFailure
  | AddPrinter
  | DeletePrinter
  | DeletePrinterSuccess
  | DeletePrinterFailure
  | AddPrinterSuccess
  | AddPrinterFailure
  | GetPrinterListFailure
  | GetPrinterListSuccess;
