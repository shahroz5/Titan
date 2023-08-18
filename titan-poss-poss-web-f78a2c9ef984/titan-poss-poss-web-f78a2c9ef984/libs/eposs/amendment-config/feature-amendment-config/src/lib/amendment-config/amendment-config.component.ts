import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AmendmentConfigFacade } from '@poss-web/eposs/amendment-config/data-access-amendment-config';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  UpdateFieldValuePayload
} from '@poss-web/shared/models';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-amendment-config',
  templateUrl: './amendment-config.component.html'
})
export class AmendmentConfigComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  isLoading$: Observable<boolean>;
  amendmentConfigValue = 0;
  constructor(
    public router: Router,
    public amendmentConfigFacade: AmendmentConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.componentInit();
  }

  componentInit() {
    this.isLoading$ = this.amendmentConfigFacade.getIsloading();
    this.amendmentConfigFacade.loadAmendmentConfigFieldValue();

    this.amendmentConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showSuccessMessageNotification(
            'pw.amendmentConfig.saveSuccessMsg'
          );
        }
      });

    this.amendmentConfigFacade
      .getAmendmentConfigValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.amendmentConfigValue = value;
        }
      });
    this.amendmentConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  UpdateFieldValue(updateFieldValuePayload: UpdateFieldValuePayload) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.amendmentConfigFacade.saveGlobalConfiguration(
            updateFieldValuePayload
          );
        }
      });
  }

  back() {
    this.amendmentConfigFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.GLOBAL_CONFIGURATIONS_MENU_KEY
      }
    });
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
