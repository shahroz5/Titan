import { Action } from '@ngrx/store';
import {
  CustomErrors,
  InitiateAdvanceResponse,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse,
  PartialUpdateAdvanceRequestPayload,
  AdvanceHistoryItemsRequestPayload,
  AdvanceHistoryResponse,
  HistorySearchParamDetails,
  RsoNameObject
} from '@poss-web/shared/models';

export enum CtAcceptAdvanceActionTypes {
  SET_SELECTED_RSO_NAME = '[Accept Advance] Selected Rso Name',
  SET_TOTAL_AMOUNT = '[Accept Advance] Set Total Amount',
  INITIATE_ADVANCE = '[Accept Advance] Initiate Advance',
  INITIATE_ADVANCE_SUCCESS = '[Accept Advance] Initiate Advance Success',
  INITIATE_ADVANCE_FAILURE = '[Accept Advance] Initiate Advance Failure',
  UPDATE_ADVANCE = '[Accept Advance] Update Advance',
  UPDATE_ADVANCE_SUCCESS = '[Accept Advance] Update Advance Success',
  UPDATE_ADVANCE_FAILURE = '[Accept Advance] Update Advance Failure',
  PARTIALLY_UPDATE_ADVANCE = '[Accept Advance] Partially Update Advance',
  PARTIALLY_UPDATE_ADVANCE_SUCCESS = '[Accept Advance] Partially Update Advance Success',
  PARTIALLY_UPDATE_ADVANCE_FAILURE = '[Accept Advance] Partially Update Advance Failure',
  RESET_ACCEPT_ADVANCE = '[Accept Advance] Reset Accept Advance',
  LOAD_RSO_DETAILS = '[Accept Advance] Load Rso Details',
  LOAD_RSO_DETAILS_SUCCESS = '[Accept Advance] Load Rso Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[Accept Advance] Load Rso Details Failure',
  SET_REMARKS = '[Accept Advance] Set Remarks',
  VIEW_ADVANCE = '[Accept Advance] View Advance',
  VIEW_ADVANCE_SUCCESS = '[Accept Advance] View Advance Success',
  VIEW_ADVANCE_FAILURE = '[Accept Advance] View Advance Failure',
  LOAD_ADVANCE_HISTORY = '[Accept Advance] Load Advance History',
  LOAD_ADVANCE_HISTORY_SUCCESS = '[Accept Advance] Load Advance History Success',
  LOAD_ADVANCE_HISTORY_FAILURE = '[Accept Advance] Load Advance History Failure',
  SET_HISTORY_SEARCH_PARAM_DETAILS = '[Accept Advance] Set History Advance Search Param Details',
  SET_ORDER_NUMBER = '[Accept Advance] Set Order Number',
  DELETE_ADVANCE_TRANSACTION_DETAILS = '[TEP] Delete Advance Transaction Details',
  DELETE_ADVANCE_TRANSACTION_DETAILS_SUCCESS = '[TEP] Delete Advance Transaction Details Success',
  DELETE_ADVANCE_TRANSACTION_DETAILS_FAILURE = '[TEP] Delete Advance Transaction Details Failure'
}

export class SetSelectedRsoName implements Action {
  readonly type = CtAcceptAdvanceActionTypes.SET_SELECTED_RSO_NAME;
  constructor(readonly payload: { value: string; description: string }) {}
}

export class SetTotalAmount implements Action {
  readonly type = CtAcceptAdvanceActionTypes.SET_TOTAL_AMOUNT;
  constructor(readonly payload: number) {}
}

export class LoadRSODetails implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS;
  constructor(public payload: string) {}
}

export class LoadRSODetailsSuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(public payload: RsoNameObject[]) {}
}

export class LoadRSODetailsFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class InitiateAdvance implements Action {
  readonly type = CtAcceptAdvanceActionTypes.INITIATE_ADVANCE;
}

export class InitiateAdvancesSuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_SUCCESS;
  constructor(readonly payload: InitiateAdvanceResponse) {}
}

export class InitiateAdvancesFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateAdvance implements Action {
  readonly type = CtAcceptAdvanceActionTypes.UPDATE_ADVANCE;
  constructor(
    readonly id: string,
    readonly requestPayload: UpdateAdvanceRequestPayload
  ) {}
}

export class UpdateAdvanceSuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_SUCCESS;
  constructor(readonly payload: UpdateAdvanceTransactionResponse) {}
}

export class UpdateAdvanceFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartiallyUpdateAdvance implements Action {
  readonly type = CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE;
  constructor(
    readonly id: string,
    readonly requestPayload: PartialUpdateAdvanceRequestPayload
  ) {}
}

export class PartiallyUpdateAdvanceSuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class PartiallyUpdateAdvanceFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetAcceptAdvance implements Action {
  readonly type = CtAcceptAdvanceActionTypes.RESET_ACCEPT_ADVANCE;
}

export class SetRemarks implements Action {
  readonly type = CtAcceptAdvanceActionTypes.SET_REMARKS;
  constructor(readonly payload: string) {}
}

export class ViewAdvance implements Action {
  readonly type = CtAcceptAdvanceActionTypes.VIEW_ADVANCE;
  constructor(readonly payload: string) {}
}

export class ViewAdvanceSuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.VIEW_ADVANCE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ViewAdvanceFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.VIEW_ADVANCE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadAdvanceHistory implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY;
  constructor(
    readonly payload: AdvanceHistoryItemsRequestPayload,
    readonly searchField: string,
    readonly searchType: string,
    readonly status: string,
    readonly page?: number,
    readonly size?: number
  ) {}
}

export class LoadAdvanceHistorySuccess implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY_SUCCESS;
  constructor(readonly payload: AdvanceHistoryResponse) {}
}

export class LoadAdvanceHistoryFailure implements Action {
  readonly type = CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetHistoryAdvanceSearchParamDetails implements Action {
  readonly type = CtAcceptAdvanceActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: HistorySearchParamDetails) {}
}

export class SetOrderNumber implements Action {
  readonly type = CtAcceptAdvanceActionTypes.SET_ORDER_NUMBER;
  constructor(public payload: number, public status: string) {}
}

export class DeleteAdvanceTransactionDetails implements Action {
  readonly type = CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS;
  constructor(readonly id: string) {}
}

export class DeleteAdvanceTransactionDetailsSuccess implements Action {
  readonly type =
    CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class DeleteAdvanceTransactionDetailsFailure implements Action {
  readonly type =
    CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type CtAcceptAdvanceActions =
  | SetSelectedRsoName
  | SetTotalAmount
  | InitiateAdvance
  | InitiateAdvancesSuccess
  | InitiateAdvancesFailure
  | UpdateAdvance
  | UpdateAdvanceSuccess
  | UpdateAdvanceFailure
  | PartiallyUpdateAdvance
  | PartiallyUpdateAdvanceSuccess
  | PartiallyUpdateAdvanceFailure
  | ResetAcceptAdvance
  | LoadRSODetails
  | LoadRSODetailsSuccess
  | LoadRSODetailsFailure
  | SetRemarks
  | ViewAdvance
  | ViewAdvanceSuccess
  | ViewAdvanceFailure
  | LoadAdvanceHistory
  | LoadAdvanceHistorySuccess
  | LoadAdvanceHistoryFailure
  | SetHistoryAdvanceSearchParamDetails
  | SetOrderNumber
  | DeleteAdvanceTransactionDetails
  | DeleteAdvanceTransactionDetailsSuccess
  | DeleteAdvanceTransactionDetailsFailure;
