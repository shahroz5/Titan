import {
  BankDepositRequest,
  BankDepositResponse,
  CustomErrors,
  DepositDatePayload,
  DepositDateResponse,
  PaginatePayload
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum BankDepositActionTypes {
  LOAD_BANK_DEPOSIT_LIST = '[ Bank-Deposit ] Load Bank Deposit List',
  LOAD_BANK_DEPOSIT_LIST_SUCCESS = '[ Bank-Deposit ] Load Bank Deposit List Success',
  LOAD_BANK_DEPOSIT_LIST_FAILURE = '[ Bank-Deposit ] Load Bank Deposit List Failure',
  
  GET_TRANSACTION_DETAILS = '[ Bank-Deposit ] Get Cheque & Cash Transaction Details',
  GET_TRANSACTION_DETAILS_SUCCESS = '[ Bank-Deposit ] Get Cheque & Cash Transaction Details Success',
  GET_TRANSACTION_DETAILS_FAILURE = '[ Bank-Deposit ] Get Cheque & Cash Transaction Details Failure',

  RESET_ERROR = '[ Bank-Deposit ] Reset Error',
  RESET_VALUES = '[ Bank-Deposit ] Reset Values'
}

export class LoadBankDepositList implements Action {
  readonly type = BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST;
  constructor(
    public paginatePayload: PaginatePayload,
    public readonly payload: BankDepositRequest
  ) {}
}

export class LoadBankDepositListSuccess implements Action {
  readonly type = BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_SUCCESS;
  constructor(public readonly payload: BankDepositResponse) {}
}

export class LoadBankDepositListFailure implements Action {
  readonly type = BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = BankDepositActionTypes.RESET_ERROR;
}

export class GetTransactionDetails implements Action {
  readonly type = BankDepositActionTypes.GET_TRANSACTION_DETAILS;
  constructor(public payload: DepositDatePayload) {}
}
export class GetTransactionDetailsSuccess implements Action {
  readonly type = BankDepositActionTypes.GET_TRANSACTION_DETAILS_SUCCESS;
  constructor(public readonly payload: DepositDateResponse) {}
}
export class GetTransactionDetailsFailure implements Action {
  readonly type = BankDepositActionTypes.GET_TRANSACTION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetValues implements Action {
  readonly type = BankDepositActionTypes.RESET_VALUES;
}

export type BankDepositActions =
  | LoadBankDepositList
  | LoadBankDepositListSuccess
  | LoadBankDepositListFailure
  | GetTransactionDetails
  | GetTransactionDetailsSuccess
  | GetTransactionDetailsFailure
  | ResetError
  | ResetValues;
