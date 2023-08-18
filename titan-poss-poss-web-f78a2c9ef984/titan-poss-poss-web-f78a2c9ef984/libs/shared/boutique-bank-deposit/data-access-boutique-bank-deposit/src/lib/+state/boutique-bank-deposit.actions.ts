import { Action } from '@ngrx/store';
import {
  BankDepositDetails,
  BankDetailsReqPayload,
  BoutiqueBankDepositResponse,
  CashDenomition,
  CustomErrors,
  PendingDatesPayload,
  PendingDatesResponse,
  PifNoPayload,
  PifNoResponse
} from '@poss-web/shared/models';

export enum BoutiqueBankDepositActionTypes {
  LOAD_BANK_DEPOSIT_DETAILS = '[Boutique Bank Deposit] Load Bank Deposit Details',
  LOAD_BANK_DEPOSIT_DETAILS_SUCCESS = '[Boutique Bank Deposit] Load Bank Deposit Details Success',
  LOAD_BANK_DEPOSIT_DETAILS_FAILURE = '[Boutique Bank Deposit] Load Bank Deposit Details Failure',

  SAVE_BANK_DEPOSIT_DETAILS = '[Boutique Bank Deposit] Save Bank Deposit Details',
  SAVE_BANK_DEPOSIT_DETAILS_SUCCESS = '[Boutique Bank Deposit] Save Bank Deposit Details Success',
  SAVE_BANK_DEPOSIT_DETAILS_FAILURE = '[Boutique Bank Deposit] Save Bank Deposit Details Failure',

  RESET_BOUTIQUE_BANK_DETAILS = '[Boutique Bank Deposit]Reset Boutique Bank Details',

  SAVE_CASH_DENOMITION = '[Boutique Bank Deposit] Save Cash Denomition',
  SAVE_CASH_DENOMITION_SUCCESS = '[Boutique Bank Deposit] Save Cash Denomition Success',
  SAVE_CASH_DENOMITION_FAILURE = '[Boutique Bank Deposit] Save Cash Denomition Failure',

  LOAD_PENDING_DATES = '[Boutique Bank Deposit] Loading Pending Dates',
  LOAD_PENDING_DATES_SUCCESS = '[Boutique Bank Deposit] Loading Pending Dates Success',
  LOAD_PENDING_DATES_FAILURE = '[Boutique Bank Deposit] Loading Pending Dates Failure',

  LOAD_DEPOSIT_AMOUNT_BY_PIFNO = '[Boutique Bank Deposit] Load Deposit Amount By PIF No',
  LOAD_DEPOSIT_AMOUNT_BY_PIFNO_SUCCESS = '[Boutique Bank Deposit] Load Deposit Amount By PIF No Success',
  LOAD_DEPOSIT_AMOUNT_BY_PIFNO_FAILURE = '[Boutique Bank Deposit] Load Deposit Amount By PIF No Failure'
}
export class LoadBankDepositDetails implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS;
  constructor(public payload: BankDetailsReqPayload) {}
}
export class LoadBankDepositDetailsSuccess implements Action {
  readonly type =
    BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_SUCCESS;
  constructor(public payload: BoutiqueBankDepositResponse) {}
}
export class LoadBankDepositDetailsFailure implements Action {
  readonly type =
    BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveBankDepositDetails implements Action {
  readonly type = BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS;
  constructor(public payload: any) {}
}
export class SaveBankDepositDetailsSuccess implements Action {
  readonly type =
    BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_SUCCESS;
  constructor(
    public payload: { data: BankDepositDetails[]; totalDepositAmount: number }
  ) {}
}
export class SaveBankDepositDetailsFailure implements Action {
  readonly type =
    BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetBoutiqueBankDepositDetails implements Action {
  readonly type = BoutiqueBankDepositActionTypes.RESET_BOUTIQUE_BANK_DETAILS;
}

export class SaveCashDenomition implements Action {
  readonly type = BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION;
  constructor(public payload: CashDenomition) {}
}
export class SaveCashDenomitionSuccess implements Action {
  readonly type = BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_SUCCESS;
  //constructor(public payload: CashDenomition) {}
}
export class SaveCashDenomitionFailure implements Action {
  readonly type = BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPendingDates implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES;
  constructor(public payload: PendingDatesPayload) {}
}
export class LoadPendingDatesSuccess implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_SUCCESS;
  constructor(public payload: PendingDatesResponse) {}
}
export class LoadPendingDatesFailure implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDepositAmountByPifNo implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO;
  constructor(public payload: PifNoPayload) {}
}
export class LoadDepositAmountByPifNoSuccess implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO_SUCCESS;
  constructor(public payload: PifNoResponse) {}
}
export class LoadDepositAmountByPifNoFailure implements Action {
  readonly type = BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type BoutiqueBankDepositActions =
  | LoadBankDepositDetails
  | LoadBankDepositDetailsSuccess
  | LoadBankDepositDetailsFailure
  | SaveBankDepositDetails
  | SaveBankDepositDetailsSuccess
  | SaveBankDepositDetailsFailure
  | ResetBoutiqueBankDepositDetails
  | SaveCashDenomition
  | SaveCashDenomitionSuccess
  | SaveCashDenomitionFailure
  | LoadPendingDates
  | LoadPendingDatesSuccess
  | LoadPendingDatesFailure
  | LoadDepositAmountByPifNo
  | LoadDepositAmountByPifNoSuccess
  | LoadDepositAmountByPifNoFailure;
