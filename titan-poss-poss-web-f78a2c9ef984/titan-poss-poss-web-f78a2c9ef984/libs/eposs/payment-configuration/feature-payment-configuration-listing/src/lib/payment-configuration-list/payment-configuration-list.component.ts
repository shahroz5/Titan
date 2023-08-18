import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  PaymentConfiguration,
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  PaymentConfigurationListPayLoad
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { PaymentConfigurationFacade } from '@poss-web/eposs/payment-configuration/data-access-payment-configuration';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getPaymentConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
@Component({
  selector: 'poss-web-payment-configuration-list',
  templateUrl: './payment-configuration-list.component.html'
})
export class PaymentConfigurationListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  paymentConfigurationList$: Observable<PaymentConfiguration[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  searchErrorCode: string;
  invalidSearch: boolean;
  noDataFoundMessage: any;

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private paymentConfigurationFacade: PaymentConfigurationFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        this.initialPageEvent.pageIndex = 0;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit() {
    this.paymentConfigurationFacade.loadReset();
    this.isLoading$ = this.paymentConfigurationFacade.getIsloading();
    this.error$ = this.paymentConfigurationFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadPaymentConfigurationList();
        this.paymentConfigurationList$ = this.paymentConfigurationFacade.getPaymentConfigurationList();
        this.totalElements$ = this.paymentConfigurationFacade.getTotalElements();
      });

    this.paymentConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.paymentConfiguration.updateMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadPaymentConfigurationList();
        } else this.overlayNotification.close();
      });

    this.paymentConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.translate
      .get(['pw.global.noDataFoundMessage'], {
        entityName: 'Payment config'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.noDataFoundMessage =
          translatedMessages['pw.global.noDataFoundMessage'];
      });
  }
  search(searchValue) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.loadPaymentConfigurationList(searchValue);
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadPaymentConfigurationList();
  }
  loadPaymentConfigurationById(configId) {
    this.router.navigate([getPaymentConfigDetailRouteUrl(configId)]);
  }
  openViewPage(configId) {
    this.router.navigate([getPaymentConfigDetailRouteUrl(configId)], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }

  updateIsActive(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = data.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.paymentConfigurationFacade.updatePaymentConfiguration(data);
        } else {
          this.loadPaymentConfigurationList();
        }
      });
  }
  loadPaymentConfigurationList(searchParam?: string) {
    let payload: PaymentConfigurationListPayLoad =  {
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      description: searchParam
    }
    this.paymentConfigurationFacade.loadPaymentConfigurationList(
      payload
    );
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    const searchValue = this.searchForm.value.searchValue;
    if (searchValue) {
      this.search(searchValue);
    } else {
      this.loadPaymentConfigurationList();
    }
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
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  back() {
    this.paymentConfigurationFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.PAYMENT_CONFIGURATIONS_MENU_KEY
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
