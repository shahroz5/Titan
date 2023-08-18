import { Action } from '@ngrx/store';

import {
  CashMemoDetailsResponse,
  CustomErrors,
  UpdateOrderDetails
} from '@poss-web/shared/models';

export enum OrderConfirmationActionTypes {
  CONFIRM_CASH_MEMO = '[OrderConfirmation] Confirm Cash Memo',
  CONFIRM_CASH_MEMO_SUCCES = '[OrderConfirmation] Confirm Cash Memo Success',
  CONFIRM_CASH_MEMO_FAILURE = '[OrderConfirmation] Confirm Cash Memo Failure',
  RESET_VALUES = '[OrderConfirmation] Reset Values'
}

export class ConfirmCashMemo implements Action {
  readonly type = OrderConfirmationActionTypes.CONFIRM_CASH_MEMO;
  constructor(public payload: UpdateOrderDetails) {}
}

export class ResetValues implements Action {
  readonly type = OrderConfirmationActionTypes.RESET_VALUES;

}
export class ConfirmCashMemoSuccess implements Action {
  readonly type = OrderConfirmationActionTypes.CONFIRM_CASH_MEMO_SUCCES;
  constructor(public payload: CashMemoDetailsResponse) {}
}

export class ConfirmCashMemoFailure implements Action {
  readonly type = OrderConfirmationActionTypes.CONFIRM_CASH_MEMO_FAILURE;
  constructor(public error: CustomErrors) {}
}

export type OrderConfirmationActions =
  | ConfirmCashMemo
  | ResetValues
  | ConfirmCashMemoSuccess
  | ConfirmCashMemoFailure;
