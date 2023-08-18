import { Action } from '@ngrx/store';
import { CustomErrors, FileResponse } from '@poss-web/shared/models';
export enum UploadEGHSActionTypes {
  UPLOAD_EGHS_BANK_DEPOSIT = '[upload-eGHS-Bank-Deposit] Upload EGHS Bank Deposit',
  UPLOAD_EGHS_BANK_DEPOSIT_SUCCESS = '[upload-eGHS-Bank-Deposit] Upload EGHS Bank Deposit Success',
  UPLOAD_EGHS_BANK_DEPOSIT_FAILURE = '[upload-eGHS-Bank-Deposit] Upload EGHS Bank Deposit Failure',
  RESET_UPLOAD_EGHS = '[upload-eGHS-Bank-Deposit] Reset UploadEghs'
}
export class UploadeGHSBankDeposit implements Action {
  readonly type = UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT;
  constructor(public payload: FormData) {}
}
export class UploadeGHSBankDepositSuccess implements Action {
  readonly type = UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT_SUCCESS;
  constructor(public payload: FileResponse) {}
}
export class UploadeGHSBankDepositFailure implements Action {
  readonly type = UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetUploadEghs implements Action {
  readonly type = UploadEGHSActionTypes.RESET_UPLOAD_EGHS;
}
export type UploadeGHSActions =
  | UploadeGHSBankDeposit
  | UploadeGHSBankDepositSuccess
  | UploadeGHSBankDepositFailure
  | ResetUploadEghs;
