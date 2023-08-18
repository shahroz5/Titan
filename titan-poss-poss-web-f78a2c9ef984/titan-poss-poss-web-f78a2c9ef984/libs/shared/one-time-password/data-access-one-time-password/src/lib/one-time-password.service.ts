import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import {
  ApiService,
  resendActivateAccountOTPUrl,
  generateForgotPasswordOTPUrl,
  verifyGuestUserOTPUrl,
  verifyUserMobileNoOTPUrl,
  getActiveAccessTokenEndpointUrl
} from '@poss-web/shared/util-api-service';
import { ActivateAccountPayLoad, OTPTypes } from '@poss-web/shared/models';
import { POSS_WEB_ENCRYPT_PASSWORD } from '@poss-web/shared/util-config';
import { CryptoService } from '@poss-web/shared/auth/data-access-auth';

@Injectable()
export class OneTimePasswordService {
  constructor(
    private apiService: ApiService,
    private cryptoService: CryptoService,
    @Inject(POSS_WEB_ENCRYPT_PASSWORD) private encryptPassword,
    @Inject('env') private env
  ) {}

  generateForgotPasswordOTP(empCode: string): Observable<boolean> {
    return this.apiService
      .post(generateForgotPasswordOTPUrl(), { empCode })
      .pipe(map((data: any) => !!data));
  }

  verifyGuestUserOTP(otpDetails: any): Observable<boolean> {
    if (!this.encryptPassword) {
      return this.apiService.patch(verifyGuestUserOTPUrl(), {
        ...otpDetails,
        newPassword: window.btoa(otpDetails.newPassword)
      });
    } else {
      return this.apiService
        .get(getActiveAccessTokenEndpointUrl(this.env))
        .pipe(
          concatMap(key => {
            const encryptedPassword = this.cryptoService.encryptPassword(
              key.publicKey,
              otpDetails.newPassword
            );
            return this.apiService.patch(verifyGuestUserOTPUrl(), {
              ...otpDetails,
              newPassword: encryptedPassword
            });
          })
        );
    }
  }

  verifyUserMobileNoOtp(otp: string): Observable<boolean> {
    return this.apiService.patch(verifyUserMobileNoOTPUrl(), {
      otp
    });
  }

  resendActivateAccountOtp(
    userData: ActivateAccountPayLoad
  ): Observable<boolean> {
    return this.apiService.post(
      resendActivateAccountOTPUrl(userData.isBTQUser),
      {
        empCode: userData.empCode,
        otpType: OTPTypes.Invited
      }
    );
  }
}
