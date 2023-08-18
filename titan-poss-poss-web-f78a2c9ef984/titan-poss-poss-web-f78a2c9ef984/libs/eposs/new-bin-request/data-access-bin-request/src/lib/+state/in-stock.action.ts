import { Action } from '@ngrx/store';

import {
  BinCodes,
  BinRequestDto,
  BinRequestResponse,
  LoadBinHistoryResponse,
  HistoryFiltersData,
  CustomErrors
} from '@poss-web/shared/models';

export interface LoadBinCodesPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadBinHistoryPayload {
  historyRequestBinDto: {
    binGroupCode: string;
    binName: string;
    dateRangeType: string;
    endDate?: number;

    reqDocNo?: number;
    reqFiscalYear?: number;

    startDate?: number;
    statuses: string[];
  };
  page: number;
  size: number;
  sort?: string[];
}

export enum InStockActionTypes {
  LOAD_BINCODES = '[BinCodes] Load BinCode',
  LOAD_BINCODES_SUCCESS = '[BinCodes] Load BinCode Success',
  LOAD_BINCODES_FAILURE = '[BinCodes] Load BinCode Failure',

  LOAD_BIN_HISTORY = '[BinCodes] Load BinHistory',
  LOAD_BIN_HISTORY_SUCCESS = '[BinCodes] Load BinHistory Success',
  LOAD_BIN_HISTORY_FAILURE = '[BinCodes] Load BinHistory Failure',

  RESET_BINCODES = '[ BinCodes ] Reset BinCodes',
  RESET_BINHISTORY = '[ BinCodes ] Reset BinHistory',
  RESET_DOCUMENT_NO = '[ BinCodes ] Reset Document Number',
  RESET_ERROR = '[BinCodes ] Reset Error',
  RESET_FILTER = '[BinCodes ] Reset FILTER',

  LOAD_COUNT = '[BinCodes ] Load Count',
  LOAD_COUNT_SUCCESS = '[BinCodes ] Load Count Success',
  LOAD_COUNT_FAILURE = '[BinCodes ] Load Count Failure',

  REQUESTED_BIN = '[ BinCodes ] Requested Bin',
  REQUESTED_BIN_SUCCESS = '[ BinCodes] Requested Bin success',
  REQUESTED_BIN_FAILURE = '[ BinCodes ] Requested Bin Failure',

  LOAD_HISTORY_FILTER_DATA = '[  BinCodes] Load History Dates '
}

export class LoadBinCodes implements Action {
  readonly type = InStockActionTypes.LOAD_BINCODES;

}

export class LoadBinCodesSuccess implements Action {
  readonly type = InStockActionTypes.LOAD_BINCODES_SUCCESS;
  constructor(public payload: BinCodes[]) {}
}

export class LoadBinCodesFailure implements Action {
  readonly type = InStockActionTypes.LOAD_BINCODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinHistory implements Action {
  readonly type = InStockActionTypes.LOAD_BIN_HISTORY;
  constructor(public payload: LoadBinHistoryPayload) {}
}

export class LoadBinHistorySuccess implements Action {
  readonly type = InStockActionTypes.LOAD_BIN_HISTORY_SUCCESS;
  constructor(public payload: LoadBinHistoryResponse) {}
}

export class LoadBinHistoryFailure implements Action {
  readonly type = InStockActionTypes.LOAD_BIN_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetBinCodes implements Action {
  readonly type = InStockActionTypes.RESET_BINCODES;
}

export class ResetDocNo implements Action {
  readonly type = InStockActionTypes.RESET_DOCUMENT_NO;
}

export class LoadCount implements Action {
  readonly type = InStockActionTypes.LOAD_COUNT;
}

export class LoadCountSuccess implements Action {
  readonly type = InStockActionTypes.LOAD_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCountFailure implements Action {
  readonly type = InStockActionTypes.LOAD_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RequestedBin implements Action {
  readonly type = InStockActionTypes.REQUESTED_BIN;
  constructor(public payload: BinRequestDto) {}
}
export class RequestedBinSuccess implements Action {
  readonly type = InStockActionTypes.REQUESTED_BIN_SUCCESS;
  constructor(public payload: BinRequestResponse) {}
}
export class RequestedBinFailure implements Action {
  readonly type = InStockActionTypes.REQUESTED_BIN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = InStockActionTypes.RESET_ERROR;
}

export class RESETBINHISTORY implements Action {
  readonly type = InStockActionTypes.RESET_BINHISTORY;
}

export class RESETFILTER implements Action {
  readonly type = InStockActionTypes.RESET_FILTER;
  constructor(public payload: number) {}
}

export class LoadHistoryFilterData implements Action {
  readonly type = InStockActionTypes.LOAD_HISTORY_FILTER_DATA;
  constructor(public payload: HistoryFiltersData) {}
}

export type InStockAction =
  | LoadBinCodes
  | RESETFILTER
  | LoadHistoryFilterData
  | RESETBINHISTORY
  | LoadBinCodesSuccess
  | LoadBinCodesFailure
  | LoadBinHistory
  | LoadBinHistorySuccess
  | LoadBinHistoryFailure
  | ResetBinCodes
  | ResetDocNo
  | LoadCount
  | LoadCountSuccess
  | LoadCountFailure
  | RequestedBin
  | RequestedBinSuccess
  | RequestedBinFailure;
