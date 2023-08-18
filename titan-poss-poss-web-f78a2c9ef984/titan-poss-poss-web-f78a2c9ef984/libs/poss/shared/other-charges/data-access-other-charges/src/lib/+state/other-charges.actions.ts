import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  TaxDetailsPayload,
  CashMemoTaxDetails,
  Lov
} from '@poss-web/shared/models';

export enum OtherChargesActionTypes {
  PARTIAL_UPDATE_CASH_MEMO = '[Other Charges] Partial Update Other Charges',
  PARTIAL_UPDATE_CASH_MEMO_SUCCESS = '[Other Charges] Partial Update Other Charges Success',
  PARTIAL_UPDATE_CASH_MEMO_FAILURE = '[Other Charges] Partial Update Other Charges Failure',

  LOAD_TAX_DETAILS = '[Other Charges] Load Tax Details',
  LOAD_TAX_DETAILS_SUCCESS = '[Other Charges] Load Tax Details Success',
  LOAD_TAX_DETAILS_FAILURE = '[Other Charges] Load Tax Details Failure',

  LOAD_REASONS = '[Other Charges] Load Reasons',
  LOAD_REASONS_SUCCESS = '[Other Charges] Load Reasons Success',
  LOAD_REASONS_FAILURE = '[Other Charges] Load Reasons Failure',

  RESET_VALUES = '[Other Charges] Reset Values'
}

export class PartialUpdateCashMemo implements Action {
  readonly type = OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class PartialUpdateCashMemoSuccess implements Action {
  readonly type = OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class PartialUpdateCashMemoFailure implements Action {
  readonly type = OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadTaxDetails implements Action {
  readonly type = OtherChargesActionTypes.LOAD_TAX_DETAILS;
  constructor(public payload: TaxDetailsPayload) {}
}

export class LoadTaxDetailsSuccess implements Action {
  readonly type = OtherChargesActionTypes.LOAD_TAX_DETAILS_SUCCESS;
  constructor(public payload: CashMemoTaxDetails) {}
}

export class LoadTaxDetailsFailure implements Action {
  readonly type = OtherChargesActionTypes.LOAD_TAX_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadReasons implements Action {
  readonly type = OtherChargesActionTypes.LOAD_REASONS;
  constructor(public payload: string) {}
}

export class LoadReasonsSuccess implements Action {
  readonly type = OtherChargesActionTypes.LOAD_REASONS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadReasonsFailure implements Action {
  readonly type = OtherChargesActionTypes.LOAD_REASONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetValues implements Action {
  readonly type = OtherChargesActionTypes.RESET_VALUES;
}

export type OtherChargesActions =
  | PartialUpdateCashMemo
  | PartialUpdateCashMemoSuccess
  | PartialUpdateCashMemoFailure
  | LoadTaxDetails
  | LoadTaxDetailsSuccess
  | LoadTaxDetailsFailure
  | LoadReasons
  | LoadReasonsSuccess
  | LoadReasonsFailure
  | ResetValues;
