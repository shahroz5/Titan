import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ActivateUserFacade } from '@poss-web/shared/activate-user/data-access-activate-user';
import {
  CustomErrors,
  OtpDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { getForgotPasswordUrl } from '@poss-web/shared/util-site-routes';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  otpLoader$: Observable<boolean>;
  otpVerified$: Observable<boolean>;
  username$: Observable<string>;
  pageUrl = 'login';
  destroy$: Subject<null> = new Subject<null>();
  isLightTheme = true;

  constructor(
    private router: Router,
    private notification: OverlayNotificationServiceAbstraction,
    private loginfacade: ActivateUserFacade,
    private translate: TranslateService
  ) {
    this.pageUrl = this.router.url;
    this.loginfacade
      .getOtpGenerated()
      .pipe(take(1))
      .subscribe(val => {
        if (this.pageUrl.includes('verify-otp') && !val) {
          this.router.navigate([getForgotPasswordUrl()]);
        }
      });
  }

  ngOnInit() {
    this.otpLoader$ = this.loginfacade.isLoading();
    this.otpVerified$ = this.loginfacade.getOtpVerified();
    this.username$ = this.loginfacade.fetchUsername();
    this.loginfacade.resetOtpVerification();

    this.loginfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(val => !!val)
      )
      .subscribe(error => this.showNotification(error));

    if (document.body.classList.contains('pw-light-theme')) {
      this.isLightTheme = true;
    } else {
      this.isLightTheme = false;
    }
  }

  generateOtp(event: string) {
    this.loginfacade.generateOtp(event);
    this.loginfacade
      .getOtpGenerated()
      .pipe(
        filter(val => !!val),
        take(1)
      )
      .subscribe(val =>
        this.translate
          .get('pw.otpNotificationMessages.otpgenerationsuccessfullMessage')
          .pipe(take(1))
          .subscribe(message =>
            this.showNotification(
              undefined,
              message,
              'forgot-password/verify-otp',
              true
            )
          )
      );
  }

  validateOtp = (event: OtpDetails) => this.loginfacade.verifyOtp(event);

  showNotification(
    error?: CustomErrors,
    message?: string,
    navigationUrl?: string,
    backDrop?: boolean
  ) {
    this.notification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        message: message,
        error: error,
        hasBackdrop: backDrop,
        hasClose: true
      })
      .events.pipe(take(1))
      .subscribe(() => {
        if (backDrop) {
          this.router.navigate([navigationUrl]);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
