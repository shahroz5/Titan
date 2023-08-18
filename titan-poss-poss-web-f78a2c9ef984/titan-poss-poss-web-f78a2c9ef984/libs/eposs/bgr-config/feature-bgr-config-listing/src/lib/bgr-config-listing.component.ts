import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime } from 'rxjs/operators';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BgrConfigListingRequestPayload,
  ConfigTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  BgrConfigDetails,
  BgrConfigConstants,
  ConfigurationsMenuKeyEnum,
  OrderTypesEnum
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';

import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getBgrConfigDetailRouteUrl,
  getConfigurationHomeRouteUrl
  // getBgrConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { BgrConfigFacade } from '@poss-web/eposs/bgr-config/data-access-bgr-config';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-bgr-config-listing',
  templateUrl: './bgr-config-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrConfigListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  noDataFoundMessage = '';
  orderTypes = [
    {
      value: OrderTypesEnum.ADVANCE_BOOKING,
      description: OrderTypesEnum.ADVANCE_BOOKING
    },
    {
      value: OrderTypesEnum.CUSTOMER_ORDER,
      description: OrderTypesEnum.CUSTOMER_ORDER
    }
  ];
  orderType: string = OrderTypesEnum.ADVANCE_BOOKING;
  orderTypeFormControl = new FormControl(OrderTypesEnum.ADVANCE_BOOKING);
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'Configurations_bestGoldRateConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_bestGoldRateConfig_viewPermission';

  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bgrConfigFacade: BgrConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.translate
      .get(['pw.entity.bgrConfiguration'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.bgrConfiguration']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  invalidSearch = false;
  searchData = '';
  pageSize: number[];
  listPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  bgrConfigListing$: Observable<BgrConfigDetails[]>;
  bgrConfigListCount$: Observable<number>;
  searchErrorCode = ErrorEnums.ERR_PAY_007;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngOnInit() {
    this.orderType = this.orderTypeFormControl.value;
    this.hasError$ = this.bgrConfigFacade.getError();
    this.isLoading$ = this.bgrConfigFacade.getIsLoading();
    this.bgrConfigListCount$ = this.bgrConfigFacade.getBgrConfigTotal();
    this.bgrConfigListing$ = this.bgrConfigFacade.getBgrConfigListing();

    this.bgrConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listPageEvent.pageSize = pageSize;
        this.loadConfigList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.bgrConfigFacade
      .getBgrConfigDetailsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.bgrConfigurations.updateSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadConfigList();
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.searchData = searchValue;
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listPageEvent = pageEvent;
    this.loadConfigList();
  }

  orderTypeChangeHandler(event) {
    if (this.orderType !== this.orderTypeFormControl.value) {
      this.orderType = this.orderTypeFormControl.value;
      this.clearSearch();
      // this.router.navigate([
      //   getCustomerOrderToleranceConfigListRouteUrl(this.orderType)
      // ]);
      this.loadConfigList();
    }
  }

  loadConfigList() {
    const requestPayload: BgrConfigListingRequestPayload = {
      description: this.searchData,
      ruleType:
        this.orderType === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_CONFIG
          : ConfigTypeEnum.CO_BGR_CONFIG
    };
    this.bgrConfigFacade.loadBgrConfigListing(
      this.listPageEvent,
      requestPayload
    );
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
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

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  getId(event: string) {
    this.router.navigate([getBgrConfigDetailRouteUrl(event, this.orderType)]);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDetails() {
    this.router.navigate([
      getBgrConfigDetailRouteUrl(BgrConfigConstants.NEW, this.orderType)
    ]);
  }

  search() {
    if (
      fieldValidation.alphaNumericWithSpaceField.pattern.test(this.searchData)
    ) {
      this.invalidSearch = false;
      this.listPageEvent = { ...this.listPageEvent, pageIndex: 0 };
      this.loadConfigList();
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.searchData = '';
    this.listPageEvent = { ...this.listPageEvent, pageIndex: 0 };
    this.loadConfigList();
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  updateIsActive($event: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.bgrConfigFacade.editBgrConfigDetails({
            isActive: $event.isActive,
            ruleId: $event.ruleId,
            ruleType: $event.ruleType
          });
        } else this.loadConfigList();
      });
  }
  openViewPage(id) {
    this.router.navigate([getBgrConfigDetailRouteUrl(id, this.orderType)], {
      queryParams: { showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BGR_CONFIGURATION_MENU_KEY
      }
    });
  }
}
