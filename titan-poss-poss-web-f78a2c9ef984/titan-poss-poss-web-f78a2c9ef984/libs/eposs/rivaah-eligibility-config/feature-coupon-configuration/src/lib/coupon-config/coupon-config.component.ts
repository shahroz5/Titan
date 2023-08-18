import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RivaahConfigurationFacade } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  DiscountTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RivaahConfigurationResponse
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-coupon-config',
  templateUrl: './coupon-config.component.html'
})
export class CouponConfigComponent implements OnInit, OnDestroy {
  couponDetails$: Observable<any>;
  isLoading$: Observable<boolean>;

  destroy$ = new Subject<null>();
  isCouponSaved = false;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public rivaahConfigurationFacade: RivaahConfigurationFacade,
    private alertPopupService: AlertPopupServiceAbstraction

  ) {}

  ngOnInit(): void {
    this.rivaahConfigurationFacade.loadReset();
    this.isLoading$ = this.rivaahConfigurationFacade.getIsloading();

    this.couponDetails$ = this.rivaahConfigurationFacade.getCouponConfiguration();
    this.rivaahConfigurationFacade.loadCouponConfiguration({
      configId: '1',
      ruleType: DiscountTypeEnum.RIVAAH_CARD_ELIGIBILITY
    });

    this.rivaahConfigurationFacade
      .getIsCouponSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCouponSaved => {
        if (isCouponSaved) {
          this.isCouponSaved = isCouponSaved;
          this.showNotifications(
            'pw.rivaahEligibilityConfig.couponSaveMessage'
          );
        }else this.overlayNotification.close();
      });

    this.rivaahConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  saveCouponConfiguration(config: RivaahConfigurationResponse) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.rivaahConfigurationFacade.updateCouponConfiguration(config);
        }
      });
  }

  showNotifications(key) {
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
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
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
