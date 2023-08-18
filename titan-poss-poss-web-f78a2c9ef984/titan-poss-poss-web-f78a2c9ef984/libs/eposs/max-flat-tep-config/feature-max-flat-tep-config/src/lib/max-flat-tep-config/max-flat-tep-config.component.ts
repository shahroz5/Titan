import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MaxFlatTepConfigFacade } from '@poss-web/eposs/max-flat-tep-config/data-access-max-flat-tep-config';
import {
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  MaxFlatTepConfigDetails,
  MaxFlatTepConfigTypeEnum,
  MaxFlatValuePatchPayload,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-max-flat-tep-config',
  templateUrl: './max-flat-tep-config.component.html'
})
export class MaxFlatTepConfigComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  destroy$ = new Subject();
  configId = '';
  maxFlatTepConfigValue = '';
  constructor(
    private translate: TranslateService,
    private maxFlatTepConfigFacade: MaxFlatTepConfigFacade,
    private overlayNotificationService: OverlayNotificationServiceAbstraction,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('I AM HERE !!!');
    this.isLoading$ = this.maxFlatTepConfigFacade.getIsLoading();
    this.maxFlatTepConfigFacade.loadMaxFlatTepConfig();
    this.getMaxFlatTepConfig();
    this.getUpdatedMaxFlatDetailsResponse();
    this.getError();
  }

  getError() {
    this.maxFlatTepConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotificationService
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  showNotification(key: string) {
    this.overlayNotificationService.close();
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotificationService
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  showErrorNotification(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotificationService
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  getMaxFlatTepConfig() {
    this.maxFlatTepConfigFacade
      .getLoadMaxFlatTepConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe((maxFlatTepConfigDetails: MaxFlatTepConfigDetails) => {
        console.log('maxFlatTepConfigDetails :', maxFlatTepConfigDetails);
        if (maxFlatTepConfigDetails){
          if(maxFlatTepConfigDetails.configId) {
            this.configId = maxFlatTepConfigDetails.configId;
            this.maxFlatTepConfigValue =
              maxFlatTepConfigDetails.data.maxFlatTepExchangeValue;
          } else{
            this.showErrorNotification('Missing Configuration for configType: [TEP_GLOBAL]');
          }
        }
      });
  }

  getUpdatedMaxFlatDetailsResponse() {
    this.maxFlatTepConfigFacade
      .getUpdateMaxFlatTepConfigResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedResponse: MaxFlatTepConfigDetails) => {
        if (updatedResponse) {
          this.showNotification('pw.maxFlatTepConfiguration.successMessage');
        }
      });
  }

  updateMaxFlatTepExchangeValue(event) {
    console.log('Event update :', event);
    const updatedMaxFlatConfigDetails: MaxFlatTepConfigDetails = {
      type: MaxFlatTepConfigTypeEnum.TEP_GLOBAL_CONFIG,
      data: {
        maxFlatTepExchangeValue: event
      }
    };
    const payload: MaxFlatValuePatchPayload = {
      configDetails: updatedMaxFlatConfigDetails
    };
    this.maxFlatTepConfigFacade.updateMaxFlatTepConfig(this.configId, payload);
  }

  back() {
    this.maxFlatTepConfigFacade.resetData();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.maxFlatTepConfigFacade.resetData();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
