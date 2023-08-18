import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  PermissionService
} from '@poss-web/shared/permission/ui-permission';
import { UAFacade } from '@poss-web/shared/user-agent/data-access-user-agent';
import { TranslateService } from '@ngx-translate/core';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginLoader$: Observable<boolean>;
  hostNameLoader$: Observable<boolean>;
  returnUrl = 'home';
  destroy$: Subject<null> = new Subject<null>();
  isLightTheme = true;
  authError$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private authFacade: AuthFacade,
    private permissionService: PermissionService,
    private userAgentFacade: UAFacade,
    private translate: TranslateService
  ) {
    const hostNameError = {
      code: ErrorEnums.ERR_USERAGENT,
      message: null,
      error: null,
      traceId: null,
      timeStamp: null
    };

    this.userAgentFacade.loadEncryptedHostName();

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;

    this.authFacade
      .getAccessToken()
      .pipe(
        takeUntil(this.destroy$),
        filter(token => !!token)
      )
      .subscribe(__ => {
        // console.log('return url redirection in login component');
        this.router.navigate([this.returnUrl]);
      });

    this.authFacade
      .getLoginError()
      .pipe(
        takeUntil(this.destroy$),
        filter(error => !!error)
      )
      .subscribe(error => this.showNotification(error));

    this.authError$ = this.authFacade.getLoginError();

    this.userAgentFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(error => !!error),
        tap(data => {
          // console.log('errorData', data);
        })
      )
      .subscribe(error => this.showNotification(hostNameError));
  }

  ngOnInit() {
    this.loginLoader$ = this.authFacade.isLoading();
    this.hostNameLoader$ = this.userAgentFacade.getIsLoading();
    if (document.body.classList.contains('pw-light-theme')) {
      this.isLightTheme = true;
    } else {
      this.isLightTheme = false;
    }
  }

  login(event: any) {
    this.permissionService.clearPermissions();
    this.authFacade.login({
      userName: event.name,
      authorizationCode: event.password
    });
  }

  // login = (event: any) =>
  //   this.authFacade.login({
  //     userName: event.name,
  //     authorizationCode: event.password
  //   });

  showNotification(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        error: error,
        hasClose: !!error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
