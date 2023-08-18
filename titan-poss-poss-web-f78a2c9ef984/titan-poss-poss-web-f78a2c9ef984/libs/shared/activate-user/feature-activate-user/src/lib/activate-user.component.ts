import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, take, tap, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OtpDetails,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { ActivateUserFacade } from '@poss-web/shared/activate-user/data-access-activate-user';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';

@Component({
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit, OnDestroy {
  otpLoader$: Observable<boolean>;
  otpVerified$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  isLightTheme = true

  constructor(
    private router: Router,
    private notification: OverlayNotificationServiceAbstraction,
    private authfacade: AuthFacade,
    private loginfacade: ActivateUserFacade,
    private translate: TranslateService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.otpLoader$ = this.loginfacade.isLoading();
    this.otpVerified$ = this.loginfacade.getOtpVerified();
    this.loginfacade.resetOtpVerification();

    this.loginfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(val => !!val)
      )
      .subscribe(error => this.showNotification(error));
      if(document.body.classList.contains('pw-light-theme')
      ) {
        this.isLightTheme = true;
      }else {
        this.isLightTheme = false;
      }
  }

  // validateOtp = (event: OtpDetails) => this.loginfacade.verifyOtp(event);
  validateOtp(event: OtpDetails) {
    this.permissionService.clearPermissions();
    this.loginfacade.verifyOtp(event);
  }

  validateNewUserOtp(event: OtpDetails) {
    this.permissionService.clearPermissions();
    this.loginfacade.verifyOtp(event);
    this.otpVerified$
      .pipe(
        filter(val => !!val),
        tap(otpverified =>
          this.authfacade.login({
            userName: event.empCode,
            authorizationCode: event.newPassword
          })
        ),
        take(1)
      )
      .subscribe(val =>
        this.translate
          .get('pw.otpNotificationMessages.newuseractivatedsuccessfullMessage')
          .pipe(take(1))
          .subscribe(message =>
            this.showNotification(undefined, message, 'user-profile')
          )
      );
  }

  showNotification(
    error?: CustomErrors,
    message?: string,
    navigationUrl?: string
  ) {
    this.notification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        message: message,
        error: error,
        hasBackdrop: !!message,
        hasClose: true
      })
      .events.pipe(take(1))
      .subscribe(() => {
        if (message) {
          this.router.navigate([navigationUrl]);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
