import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CashPaymentConfigurationFacade } from '@poss-web/eposs/cash-payment-config/data-access-cash-payment-config';
import { Observable, Subject } from 'rxjs';
import {
  CustomErrors,
  CashPaymentConfiguration,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cash-payment-configuration-feature',
  templateUrl: './cash-payment-configuration-feature.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashPaymentConfigurationFeatureComponent
  implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  cashPaymentConfigurationDetails$: Observable<CashPaymentConfiguration>;
  destroy$ = new Subject<null>();

  constructor(
    public router: Router,
    private cashPaymentConfigurationFacade: CashPaymentConfigurationFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit() {
    this.isLoading$ = this.cashPaymentConfigurationFacade.getIsLoading();
    this.cashPaymentConfigurationFacade.loadCashPaymentConfigurationDetails(1);
    this.cashPaymentConfigurationFacade
      .editCashPaymentConfigurationResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => {
        if (d) {
          this.showNotification(
            'pw.cashPaymentConfiguration.save_notification'
          );
        }
      });

    this.cashPaymentConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.cashPaymentConfigurationDetails$ = this.cashPaymentConfigurationFacade.getCashPaymentConfigurationDetails();
  }

  cashPaymentConfigurationDetailsForm(formData: {
    form: CashPaymentConfiguration;
    mode: boolean;
  }) {
    if (formData.mode) {
      this.cashPaymentConfigurationFacade.addNewCashPaymentConfigurationDetails(
        formData.form
      );
    } else {
      this.cashPaymentConfigurationFacade.editCashPaymentConfigurationDetails(
        formData.form.ruleId,
        formData.form
      );
    }
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.PAYMENT_CONFIGURATIONS_MENU_KEY
      }
    });
  }
}
