import { Action } from '@ngrx/store';
import { CustomErrors, FileResponse } from '@poss-web/shared/models';
export enum UploadServicePossActionTypes {
  UPLOAD_SERVICE_POSS_BANK_DEPOSIT = '[upload-service-poss-Bank-Deposit] Upload Service Poss Bank Deposit',
  UPLOAD_SERVICE_POSS_BANK_DEPOSIT_SUCCESS = '[upload-service-poss-Bank-Deposit] Upload Service Poss Bank Deposit Success',
  UPLOAD_SERVICE_POSS_BANK_DEPOSIT_FAILURE = '[upload-service-poss-Bank-Deposit] Upload Service Poss Bank Deposit Failure',
  RESET_UPLOAD_SERVICE_POSS = '[upload-service-poss-Bank-Deposit] Reset Upload Service Poss'
}
export class UploadServicePossBankDeposit implements Action {
  readonly type = UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT;
  constructor(public payload: FormData) {}
}
export class UploadServicePossBankDepositSuccess implements Action {
  readonly type = UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT_SUCCESS;
  constructor(public payload: FileResponse) {}
}
export class UploadServicePossBankDepositFailure implements Action {
  readonly type = UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetUploadServicePoss implements Action {
  readonly type = UploadServicePossActionTypes.RESET_UPLOAD_SERVICE_POSS;
}
export type UploadServicePossActions =
  | UploadServicePossBankDeposit
  | UploadServicePossBankDepositSuccess
  | UploadServicePossBankDepositFailure
  | ResetUploadServicePoss;