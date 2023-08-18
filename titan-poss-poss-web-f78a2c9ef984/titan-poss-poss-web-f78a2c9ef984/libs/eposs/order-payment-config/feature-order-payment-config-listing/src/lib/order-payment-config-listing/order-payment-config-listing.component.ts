import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { OrderPaymentFacade } from '@poss-web/eposs/order-payment-config/data-access-order-payment-config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OrderPaymentConfigPayload,
  OverlayNotificationType,
  OverlayNotificationEventType,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';

import {
  getConfigurationHomeRouteUrl,
  getOrderPaymentConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject, fromEvent } from 'rxjs';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-order-payment-config-listing',
  templateUrl: './order-payment-config-listing.component.html'
})
export class OrderPaymentConfigListingComponent
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
  searchedData$: Observable<OrderPaymentConfigPayload>;
  configList$: Observable<OrderPaymentConfigPayload[]>;
  invalidSearch: boolean;
  noDataFoundMessage;
  configurationUpdateMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  searchData = '';
  ADD_EDIT_PERMISSION = 'ABConfigurations_OrderPaymentConfig_addEditPermission';
  VIEW_PERMISSION = 'ABConfigurations_OrderPaymentConfig_viewPermission';
  permissions$: Observable<any[]>;

  constructor(
    private appSettingFacade: AppsettingFacade,
    private orderPaymentFacade: OrderPaymentFacade,
    private router: Router,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

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
    this.hasError$ = this.orderPaymentFacade.getError();

    this.translate
      .get(['pw.abOrderPaymentConfig.configurationUpdateMessage'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configurationUpdateMessage =
          translatedMessages[
            'pw.abOrderPaymentConfig.configurationUpdateMessage'
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
    this.configList$ = this.orderPaymentFacade.getConfigurationList();
    this.totalElements$ = this.orderPaymentFacade.getTotalElement();
    this.isLoading$ = this.orderPaymentFacade.getIsloading();
    this.orderPaymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.orderPaymentFacade
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

          this.orderPaymentFacade.updateIsActive(updateIsActive);
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
    this.orderPaymentFacade.loadReset();
    this.searchForm.reset();
    this.searchData = '';
    this.configDetailsListingPageEvent.pageIndex = 0;
    this.loadConfigDetails();
  }

  addNew() {
    this.router.navigate([getOrderPaymentConfigDetailRouteUrl('new')]);
  }

  loadConfigDetails() {
    this.orderPaymentFacade.LoadOrderPaymentConfigList({
      description: this.searchData,
      pageIndex: this.configDetailsListingPageEvent.pageIndex,
      pageSize: this.configDetailsListingPageEvent.pageSize,
      length: this.configDetailsListingPageEvent.length
    });
  }

  loadSelectedConfig(configId: string) {
    this.router.navigate([getOrderPaymentConfigDetailRouteUrl(configId)]);
  }

  openViewPage(configId) {
    this.router.navigate([getOrderPaymentConfigDetailRouteUrl(configId)], {
      queryParams: { showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
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
    this.orderPaymentFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.ADVANCE_BOOKING_TRANSACTION_MENU_KEY
      }
    });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
