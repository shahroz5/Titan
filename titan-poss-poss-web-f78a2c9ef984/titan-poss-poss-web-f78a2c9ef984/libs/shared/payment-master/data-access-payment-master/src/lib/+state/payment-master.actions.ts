import { Action } from '@ngrx/store';
import {
  CustomErrors,

  PaymentMasterListPayload,
  PaymentMasterList,
  PaymentMaster,
  UpdatePaymentMasterPayload,
  SavePaymentMasterPayload
} from '@poss-web/shared/models';

export enum PaymentMasterActionTypes {
  LOAD_PAYMENT_MASTER_LISTING = '[Paymeny-master]Load Payment master Listing',
  LOAD_PAYMENT_MASTER_LISTING_SUCCESS = '[Paymeny-master]Load Payment master Listing Success',
  LOAD_PAYMENT_MASTER_LISTING_FAILURE = '[Paymeny-master] Load Payment master Listing Failure',

  SAVE_PAYMENT_MASTER = '[Paymeny-master]Save Payment master ',
  SAVE_PAYMENT_MASTER_SUCCESS = '[Paymeny-master]Save Payment master Success',
  SAVE_PAYMENT_MASTER_FAILURE = '[Paymeny-master] Save Payment master Failure',

  UPDATE_PAYMENT_MASTER = '[Paymeny-master]Update Payment master ',
  UPDATE_PAYMENT_MASTER_SUCCESS = '[Paymeny-master]Update Payment master Success',
  UPDATE_PAYMENT_MASTER_FAILURE = '[Paymeny-master] Update  Payment master Failure',

  LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE = '[Paymeny-master]Load Payment master By Payment Code ',
  LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_SUCCESS = '[Paymeny-master]Load Payment master By Payment Code Success',
  LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_FAILURE = '[Paymeny-master] Load Payment master By Payment Code Failure',

  SEARCH_PAYMENT_MASTER = '[Paymeny-master]Search Payment master ',
  SEARCH_PAYMENT_MASTER_SUCCESS = '[Paymeny-master]Search Payment master Success',
  SEARCH_PAYMENT_MASTER_FAILURE = '[Paymeny-master] Search Payment master Failure',


  LOAD_RESET = '[Paymeny-master] Load Reset'



}


export class LoadPaymentMasterList implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING;
  constructor(public payload: PaymentMasterListPayload) { }
}

export class LoadPaymentMasterListSuccess implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_SUCCESS;
  constructor(public payload: PaymentMasterList) { }
}
export class LoadPaymentMasterListFailure implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}




export class SavePaymentMaster implements Action {
  readonly type = PaymentMasterActionTypes.SAVE_PAYMENT_MASTER;
  constructor(public payload: SavePaymentMasterPayload) { }
}

export class SavePaymentMasterSuccess implements Action {
  readonly type = PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_SUCCESS;

}
export class SavePaymentMasterFailure implements Action {
  readonly type = PaymentMasterActionTypes.SAVE_PAYMENT_MASTER_FAILURE;
  constructor(public payload: CustomErrors) { }
}


export class UpdatePaymentMaster implements Action {
  readonly type = PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER;
  constructor(public payload: UpdatePaymentMasterPayload) { }
}

export class UpdatePaymentMasterSuccess implements Action {
  readonly type = PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_SUCCESS;

}
export class UpdatePaymentMasterFailure implements Action {
  readonly type = PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER_FAILURE;
  constructor(public payload: CustomErrors) { }
}


export class LoadPaymentMasterByPaymentCode implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE;
  constructor(public payload: string) { }
}

export class LoadPaymentMasterByPaymentCodeSuccess implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_SUCCESS;
  constructor(public payload: PaymentMaster) { }
}
export class LoadPaymentMasterByPaymentCodeFailure implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE_FAILURE;
  constructor(public payload: CustomErrors) { }
}


export class SearchPaymentMaster implements Action {
  readonly type = PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER;
  constructor(public payload: string) { }
}

export class SearchPaymentMasterSuccess implements Action {
  readonly type = PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_SUCCESS;
  constructor(public payload: PaymentMasterList) { }
}
export class SearchPaymentMasterFailure implements Action {
  readonly type = PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadReset implements Action {
  readonly type = PaymentMasterActionTypes.LOAD_RESET;
}
export type PaymentMasterActions =
  | LoadPaymentMasterList
  | LoadPaymentMasterListSuccess
  | LoadPaymentMasterListFailure
  | SavePaymentMaster
  | SavePaymentMasterSuccess
  | SavePaymentMasterFailure
  | UpdatePaymentMaster
  | UpdatePaymentMasterSuccess
  | UpdatePaymentMasterFailure
  | LoadPaymentMasterByPaymentCode
  | LoadPaymentMasterByPaymentCodeSuccess
  | LoadPaymentMasterByPaymentCodeFailure
  | SearchPaymentMaster
  | SearchPaymentMasterSuccess
  | SearchPaymentMasterFailure
  | LoadReset


