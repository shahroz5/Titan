import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as ActivateUserActions from './activate-user.actions';
import { CustomErrors } from '@poss-web/shared/models';
import { ActivateUserActionTypes } from './activate-user.actions';
import { OneTimePasswordService } from '@poss-web/shared/one-time-password/data-access-one-time-password';
import { ActivateUserState } from './activate-user.state';

@Injectable()
export class ActivateUserEffect {
  constructor(
    private service: OneTimePasswordService,
    private dataPersistence: DataPersistence<ActivateUserState>,
    private loggerService: LoggerService
  ) {}

  @Effect() generateOtp$ = this.dataPersistence.fetch(
    ActivateUserActionTypes.GENERATE_OTP,
    {
      run: (action: ActivateUserActions.GenerateOtp) => {
        return this.service
          .generateForgotPasswordOTP(action.payload)
          .pipe(
            map(
              (otpgenerated: boolean) =>
                new ActivateUserActions.GenerateOtpSuccess(otpgenerated)
            )
          );
      },

      onError: (
        action: ActivateUserActions.GenerateOtp,
        error: HttpErrorResponse
      ) => {
        return new ActivateUserActions.GenerateOtpFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() verifyOtp$ = this.dataPersistence.fetch(
    ActivateUserActionTypes.VERIFY_OTP,
    {
      run: (action: ActivateUserActions.VerifyOtp) => {
        return this.service
          .verifyGuestUserOTP(action.payload)
          .pipe(
            map(
              (otpverified: boolean) =>
                new ActivateUserActions.VerifyOtpSuccess(otpverified)
            )
          );
      },

      onError: (
        action: ActivateUserActions.VerifyOtp,
        error: HttpErrorResponse
      ) => {
        return new ActivateUserActions.VerifyOtpFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
