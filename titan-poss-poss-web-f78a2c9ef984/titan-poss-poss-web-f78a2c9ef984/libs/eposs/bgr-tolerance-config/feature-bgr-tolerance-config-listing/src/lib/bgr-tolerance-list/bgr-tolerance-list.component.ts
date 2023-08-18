import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { BgrToleranceConfigFacade } from '@poss-web/eposs/bgr-tolerance-config/data-access-bgr-tolerance-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  AbToleranceConfigResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  OrderTypesEnum,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getBgrToleranceConfigDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-bgr-tolerance-list',
  templateUrl: './bgr-tolerance-list.component.html'
})
export class BgrToleranceListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchErrorCode: string;
  invalidSearch: boolean;
  searchData = '';

  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[];
  bgrToleranceConfigList$: Observable<any[]>;
  noDataFoundMessage = '';
  destroy$ = new Subject<null>();
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION =
    'Configurations_bestGoldRateToleranceConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_bestGoldRateToleranceConfig_viewPermission';

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
  orderTypeFormControl = new FormControl(OrderTypesEnum.ADVANCE_BOOKING);
  orderType: string = OrderTypesEnum.ADVANCE_BOOKING;

  constructor(
    private bgrToleranceConfigFacade: BgrToleranceConfigFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.translate
      .get(['pw.entity.bgrToleranceConfiguration'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.bgrToleranceConfiguration']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
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
  ngOnInit(): void {
    this.orderType = this.orderTypeFormControl.value;
    this.bgrToleranceConfigFacade.loadReset();
    this.isLoading$ = this.bgrToleranceConfigFacade.getIsloading();
    this.error$ = this.bgrToleranceConfigFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadBgrToleranceConfigList();
        this.bgrToleranceConfigList$ = this.bgrToleranceConfigFacade.getBgrToleranceConfigList();
        this.totalElements$ = this.bgrToleranceConfigFacade.getTotalElements();
      });

    this.bgrToleranceConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.bgrToleranceConfigurations.updateMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadBgrToleranceConfigList();
        } else this.overlayNotification.close();
      });

    this.bgrToleranceConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search() {
    if (fieldValidation.nameWithSpaceField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.initialPageEvent.pageIndex = 0;
      this.loadBgrToleranceConfigList();
    } else {
      this.invalidSearch = true;
    }
  }

  orderTypeChangeHandler(event) {
    if (this.orderType !== this.orderTypeFormControl.value) {
      this.orderType = this.orderTypeFormControl.value;
      this.clearSearch();
      // this.router.navigate([
      //   getCustomerOrderToleranceConfigListRouteUrl(this.orderType)
      // ]);
      this.loadBgrToleranceConfigList();
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.searchData = '';
    this.initialPageEvent.pageIndex = 0;
    this.loadBgrToleranceConfigList();
  }
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateToggle(payload: AbToleranceConfigResponse) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = payload.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.bgrToleranceConfigFacade.updateConfigIsActive(payload);
        } else this.loadBgrToleranceConfigList();
      });
  }

  loadDetailPage(configId: string) {
    this.router.navigate([
      getBgrToleranceConfigDetailsRouteUrl(configId, this.orderType)
    ]);
  }

  loadBgrToleranceConfigList() {
    this.bgrToleranceConfigFacade.loadBgrToleranceConfigList({
      description: this.searchData,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      orderType:
        this.orderType === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
          : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
    });
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadBgrToleranceConfigList();
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  back() {
    this.bgrToleranceConfigFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BGR_CONFIGURATION_MENU_KEY
      }
    });
  }
  openViewPage(id) {
    this.router.navigate(
      [getBgrToleranceConfigDetailsRouteUrl(id, this.orderType)],
      {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      }
    );
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

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
