import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  PayerBankConfiguration,
  ToggleButtonPayload,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { PayerBankConfigFacade } from '@poss-web/eposs/payer-bank-config/data-access-payer-bank-config';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { Router } from '@angular/router';
import {
  getConfigurationHomeRouteUrl,
  getPayerBankConfigurationDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-payer-bank-config-list',
  templateUrl: './payer-bank-config-list.component.html'
})
export class PayerBankConfigListComponent implements OnInit, OnDestroy {
  payerBankConfigurationListing$: Observable<PayerBankConfiguration[]>;
  hasSearched$: Observable<boolean>;
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  payerBankConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  invalidSearch = false;
  constructor(
    private payerBankConfigFacade: PayerBankConfigFacade,
    private appSettingFacade: AppsettingFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.payerBankConfigurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.payerBankConfigurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.payerBankConfigFacade.resetPayerBankConfigDetails();
    this.hasSearched$ = this.payerBankConfigFacade.getHasSearched();
    this.isLoading$ = this.payerBankConfigFacade.getIsLoading();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.payerBankConfigPageEvent.pageSize = pageSize;
        this.loadPayerBankConfigurations();
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.payerBankConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpdated: boolean) => {
        if (hasUpdated) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.payerBankConfiguration.updateMessage');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadPayerBankConfigurations();
        }
      });

    this.payerBankConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.payerBankConfigurationListing$ = this.payerBankConfigFacade.getPayerBankConfigurations();

    this.totalElements$ = this.payerBankConfigFacade.getTotalElements();
  }
  paginate(pageEvent: PageEvent) {
    this.payerBankConfigPageEvent = pageEvent;
    this.loadPayerBankConfigurations();
  }
  getPayerBankConfigNameView(configId: string) {
    this.router.navigate([getPayerBankConfigurationDetailsRouteUrl(configId)], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }
  getPayerBankConfigName(configId: string) {
    this.router.navigate([getPayerBankConfigurationDetailsRouteUrl(configId)]);
  }
  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  loadPayerBankConfigurations() {
    this.payerBankConfigFacade.loadPayerBankConfigurations({
      pageIndex: this.payerBankConfigPageEvent.pageIndex,
      pageSize: this.payerBankConfigPageEvent.pageSize
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

  isActive(isActivePayload: ToggleButtonPayload) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = isActivePayload.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.payerBankConfigFacade.updateToggleButton(isActivePayload);
        } else this.loadPayerBankConfigurations();
      });
  }
  search(searchValue) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.payerBankConfigFacade.searchConfigName(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else this.invalidSearch = true;
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }
  clearSearch() {
    this.invalidSearch = false;
    this.loadPayerBankConfigurations();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
