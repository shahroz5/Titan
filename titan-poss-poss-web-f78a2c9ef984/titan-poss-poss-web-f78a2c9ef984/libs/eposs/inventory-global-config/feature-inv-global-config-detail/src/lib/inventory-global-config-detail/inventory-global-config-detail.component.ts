import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { InventoryGlobalConfigFacade } from '@poss-web/eposs/inventory-global-config/data-access-inv-global-config';
import {
  InvglobalConfigurationFiledValue,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  UpdateFieldValuePayload,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  getGlobalConfigRouteUrl,
  getConfigurationHomeRouteUrl
} from '@poss-web/shared/util-site-routes';


import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-inventory-global-config-detail',
  templateUrl: './inventory-global-config-detail.component.html'
})
export class InventoryGlobalConfigDetailComponent implements OnInit, OnDestroy {
  configId: string;
  isValueChanged: boolean;
  destroy$ = new Subject();
  isLoading$: Observable<boolean>;
  invglobalConfigurationFiledValue$: Observable<
    InvglobalConfigurationFiledValue
  >;
  constructor(
    public router: Router,
    public inventoryGlobalConfigFacade: InventoryGlobalConfigFacade,
    public acivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.isLoading$ = this.inventoryGlobalConfigFacade.getIsloading();
    this.inventoryGlobalConfigFacade.loadInvGlobalConfigurationList();
    this.inventoryGlobalConfigFacade
      .getInvGlobalConfigurationList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configuration => {
        if (configuration !== null && configuration.length) {
          this.inventoryGlobalConfigFacade.loadInvGlobalConfigurationFieldValue(
            configuration[0].configId
          );
          this.configId = configuration[0].configId;
          this.router.navigate([
            getGlobalConfigRouteUrl() + '/' + this.configId
          ]);
          this.invglobalConfigurationFiledValue$ = this.inventoryGlobalConfigFacade.getInvGlobalConfigurationFieldValue();
        } else if (configuration !== null && !configuration.length) {
          this.inventoryGlobalConfigFacade.saveGlobalConfiguration();
        }
      });
    this.inventoryGlobalConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.showSuccessMessageNotification(
            'pw.invGlobalConfiguration.saveSuccessMsg'
          );
        } else this.overlayNotification.close();
      });
    this.inventoryGlobalConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  UpdateFieldValue(updateFieldValuePayload: UpdateFieldValuePayload) {
    this.isValueChanged = null;
    const configId = this.acivatedRoute.snapshot.params['_configId'];
    updateFieldValuePayload.configId = configId;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.inventoryGlobalConfigFacade.updateInvGlobalConfigurationFiledValue(
            updateFieldValuePayload
          );
        }
      });
  }

  back() {
    this.inventoryGlobalConfigFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.INVENTORY_CONFIGURATION_MENU_KEY
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
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

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
