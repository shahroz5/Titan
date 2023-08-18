import { Action } from '@ngrx/store';

import {
  CustomErrors,
  SaveBankPriorityFormDetailsPayload,
  LoadBankPriorityListingSuccessPayload
} from '@poss-web/shared/models';

export enum BankPriorityActionTypes {
  LOAD_BANK_PRIORITY_LISTING = '[Load-Bank-Priority] Load Bank Priority Details',
  LOAD_BANK_PRIORITY_LISTING_SUCCESS = '[Load-Bank-Priority] Load Bank Priority Details Success',
  LOAD_BANK_PRIORITY_LISTING_FAILURE = '[Load-Bank-Priority] Load Bank Priority Details Failure',


  SAVE_BANK_PRIORITY = '[Load-Bank-Priority] Save Bank Priority Details',
  SAVE_BANK_PRIORITY_SUCCESS = '[Load-Bank-Priority] Save Bank Priority Details Success',
  SAVE_BANK_PRIORITY_FAILURE = '[Load-Bank-Priority] Save Bank Priority Details Failure',

  RESET_BANK_PRIORITY_DIALOG_DATA = '[Load-Bank-Priority-Details] Reset Bank Priority Dialog Data',
}




export class SaveBankPriority implements Action {
  readonly type = BankPriorityActionTypes.SAVE_BANK_PRIORITY;
  constructor(public payload: SaveBankPriorityFormDetailsPayload) { }
}
export class SaveBankPrioritySuccess implements Action {
  readonly type = BankPriorityActionTypes.SAVE_BANK_PRIORITY_SUCCESS;

}
export class SaveBankPriorityFailure implements Action {
  readonly type = BankPriorityActionTypes.SAVE_BANK_PRIORITY_FAILURE;
  constructor(public payload: CustomErrors) { }
}


export class LoadBankPriority implements Action {
  readonly type = BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING;

}
export class LoadBankPrioritySuccess implements Action {
  readonly type = BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_SUCCESS;
  constructor(public payload: LoadBankPriorityListingSuccessPayload) { }
}
export class LoadBankPriorityFailure implements Action {
  readonly type = BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class ResetBankPriorityDialog implements Action {
  readonly type = BankPriorityActionTypes.RESET_BANK_PRIORITY_DIALOG_DATA;
}
export type BankPriorityActions =
  | LoadBankPriority
  | LoadBankPrioritySuccess
  | LoadBankPriorityFailure
  | SaveBankPriority
  | SaveBankPrioritySuccess
  | SaveBankPriorityFailure
  | ResetBankPriorityDialog

