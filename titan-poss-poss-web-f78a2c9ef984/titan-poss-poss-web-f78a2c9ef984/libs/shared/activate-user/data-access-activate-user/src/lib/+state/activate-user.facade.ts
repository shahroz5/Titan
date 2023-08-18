import { OtpDetails } from '@poss-web/shared/models';
import * as ActivateUserAction from './activate-user.actions';
import { ActivateUserSelectors } from './activate-user.selectors';
import { ActivateUserState } from './activate-user.state';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class ActivateUserFacade {
  private verifiedOtp$ = this.store.select(ActivateUserSelectors.verifiedOtp);

  private generatedOtp$ = this.store.select(ActivateUserSelectors.generatedOtp);

  private fetchUsername$ = this.store.select(
    ActivateUserSelectors.fetchUsername
  );

  private isLoading$ = this.store.select(ActivateUserSelectors.isLoading);

  private selectError$ = this.store.select(ActivateUserSelectors.selectError);

  constructor(private store: Store<ActivateUserState>) {}

  getOtpGenerated() {
    return this.generatedOtp$;
  }

  fetchUsername() {
    return this.fetchUsername$;
  }

  getOtpVerified() {
    return this.verifiedOtp$;
  }

  isLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.selectError$;
  }

  generateOtp = (username: string) =>
    this.store.dispatch(new ActivateUserAction.GenerateOtp(username));

  verifyOtp = (otpdetails: OtpDetails) =>
    this.store.dispatch(new ActivateUserAction.VerifyOtp(otpdetails));

  resetOtpVerification = () =>
    this.store.dispatch(new ActivateUserAction.ResetOtpVeification());
}
