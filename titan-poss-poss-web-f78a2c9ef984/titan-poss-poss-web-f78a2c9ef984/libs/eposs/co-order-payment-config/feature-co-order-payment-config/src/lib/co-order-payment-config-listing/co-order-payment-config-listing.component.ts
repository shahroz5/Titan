import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CoOrderPaymentFacade } from '@poss-web/eposs/co-order-payment-config/data-access-co-order-payment-config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  CoOrderPaymentConfigPayload,
  OverlayNotificationType,
  OverlayNotificationEventType,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';

import {
  getConfigurationHomeRouteUrl,
  getCustomerOrderPaymentConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject, fromEvent } from 'rxjs';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-co-order-payment-config-listing',
  templateUrl: './co-order-payment-config-listing.component.html'
})
export class CoOrderPaymentConfigListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];
  isSearching$: Observable<boolean>;
  totalElements$: Observable<number>;
  configDetailsListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  searchedData$: Observable<CoOrderPaymentConfigPayload>;
  configList$: Observable<CoOrderPaymentConfigPayload[]>;
  invalidSearch: boolean;
  noDataFoundMessage;
  configurationUpdateMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  searchData = '';

  constructor(
    private appSettingFacade: AppsettingFacade,
    private coOrderPaymentFacade: CoOrderPaymentFacade,
    private router: Router,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.configurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.configurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    this.hasError$ = this.coOrderPaymentFacade.getError();

    this.translate
      .get(['pw.coOrderPaymentConfig.configurationUpdateMessage'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configurationUpdateMessage =
          translatedMessages[
            'pw.coOrderPaymentConfig.configurationUpdateMessage'
          ];
      });

    this.searchErrorCode = ErrorEnums.ERR_INV_002;
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.configDetailsListingPageEvent.pageSize = data;
        this.loadConfigDetails();
      });
    this.configList$ = this.coOrderPaymentFacade.getConfigurationList();
    this.totalElements$ = this.coOrderPaymentFacade.getTotalElement();
    this.isLoading$ = this.coOrderPaymentFacade.getIsloading();
    this.coOrderPaymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.coOrderPaymentFacade
      .getIsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadConfigDetails();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(this.configurationUpdateMessage);
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.searchData = searchValue;
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }

  updateIsActive(updateIsActive) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateIsActive.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.coOrderPaymentFacade.updateIsActive(updateIsActive);
        } else this.loadConfigDetails();
      });
  }

  search() {
    if (fieldValidation.descriptionField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.configDetailsListingPageEvent.pageIndex = 0;
      this.loadConfigDetails();
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.coOrderPaymentFacade.loadReset();
    this.searchForm.reset();
    this.searchData = '';
    this.configDetailsListingPageEvent.pageIndex = 0;
    this.loadConfigDetails();
  }

  addNew() {
    this.router.navigate([getCustomerOrderPaymentConfigDetailRouteUrl('new')]);
  }

  loadConfigDetails() {
    this.coOrderPaymentFacade.LoadCoOrderPaymentConfigList({
      description: this.searchData,
      pageIndex: this.configDetailsListingPageEvent.pageIndex,
      pageSize: this.configDetailsListingPageEvent.pageSize,
      length: this.configDetailsListingPageEvent.length
    });
  }

  loadSelectedConfig(configId: string) {
    this.router.navigate([
      getCustomerOrderPaymentConfigDetailRouteUrl(configId)
    ]);
  }

  openViewPage(configId) {
    this.router.navigate(
      [getCustomerOrderPaymentConfigDetailRouteUrl(configId)],
      {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      }
    );
  }

  showNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  paginate(pageEvent: PageEvent) {
    this.configDetailsListingPageEvent = pageEvent;
    this.loadConfigDetails();
  }

  back() {
    this.coOrderPaymentFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_ORDER_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
