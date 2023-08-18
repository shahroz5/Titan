import { Action } from '@ngrx/store';

import { OtpDetails, CustomErrors } from '@poss-web/shared/models';

export enum ActivateUserActionTypes {
  GENERATE_OTP = '[ otp - management ] Generate Otp',
  GENERATE_OTP_SUCCESS = '[ otp - management ] Generate Otp Success',
  GENERATE_OTP_FAILURE = '[ otp - management ] Generate Otp Failure',

  VERIFY_OTP = '[ otp - management ] Verify Otp',
  VERIFY_OTP_SUCCESS = '[ otp - management ] Verify Otp Success',
  VERIFY_OTP_FAILURE = '[ otp - management ] Verify Otp Failure',

  RESET_OTP_VERIFICATION = '[ otp - management ] Reset Otp Verification'
}

export class ResetOtpVeification implements Action {
  readonly type = ActivateUserActionTypes.RESET_OTP_VERIFICATION;
}

export class GenerateOtp implements Action {
  readonly type = ActivateUserActionTypes.GENERATE_OTP;
  constructor(public readonly payload: string) {}
}

export class GenerateOtpSuccess implements Action {
  readonly type = ActivateUserActionTypes.GENERATE_OTP_SUCCESS;
  constructor(public readonly payload: boolean) {}
}

export class GenerateOtpFailure implements Action {
  readonly type = ActivateUserActionTypes.GENERATE_OTP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class VerifyOtp implements Action {
  readonly type = ActivateUserActionTypes.VERIFY_OTP;
  constructor(public readonly payload: OtpDetails) {}
}

export class VerifyOtpSuccess implements Action {
  readonly type = ActivateUserActionTypes.VERIFY_OTP_SUCCESS;
  constructor(public readonly payload: boolean) {}
}

export class VerifyOtpFailure implements Action {
  readonly type = ActivateUserActionTypes.VERIFY_OTP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ActivateUserActions =
  | GenerateOtp
  | GenerateOtpSuccess
  | GenerateOtpFailure
  | VerifyOtp
  | VerifyOtpSuccess
  | VerifyOtpFailure
  | ResetOtpVeification;
