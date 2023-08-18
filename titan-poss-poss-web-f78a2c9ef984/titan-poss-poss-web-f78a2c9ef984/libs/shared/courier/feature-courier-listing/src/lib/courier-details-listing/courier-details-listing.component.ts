import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  OverlayNotificationType,
  OverlayNotificationEventType,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  CustomErrors,
  StateTypes,
  Towns,
  OverlayNotificationServiceAbstraction,
  CourierDetailsListing
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CourierDetailsFacade } from '@poss-web/shared/courier/data-access-courier';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  getCourierDetailsRouteUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
export enum courierDetailsEnum {
  NEW = 'new'
}
@Component({
  selector: 'poss-web-courier-details-listing',
  templateUrl: './courier-details-listing.component.html'
})
export class CourierDetailsListingComponent implements OnInit, OnDestroy {
  courierDetailsListing$: Observable<CourierDetailsListing[]>;
  totalCourierDetailsCount$: Observable<number>;
  allStates$: Observable<StateTypes[]>;
  allTowns$: Observable<Towns[]>;
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  hasSearched: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  courierDetailsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  destroy$ = new Subject<null>();
  searchErrorCode: string;
  permissions$: Observable<any[]>;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  invalidSearch = false;
  noDataFoundMessage: string;
  ADD_EDIT_COURIER_PERMISSIONS = 'Courier Master - Add/Edit Courier Master';

  constructor(
    private appsettingFacade: AppsettingFacade,
    private courierDetailsFacade: CourierDetailsFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.entity.courierEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.courierEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.searchErrorCode = ErrorEnums.ERR_INV_029;

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.courierDetailsPageEvent.pageSize = pageSize;
        this.loadCourierDetails();
      });
    this.courierDetailsListing$ = this.courierDetailsFacade.getCourierDetailsListing();
    this.totalCourierDetailsCount$ = this.courierDetailsFacade.getTotalCourierDetails();
    this.isLoading$ = this.courierDetailsFacade.getIsLoading();
    this.hasSearched$ = this.courierDetailsFacade.getHasSearched();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.hasError$ = this.courierDetailsFacade.getError();

    this.hasError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.courierDetailsFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.courierDetails.updatedSuccessMessage');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
          this.loadCourierDetails();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.courierDetailsPageEvent = pageEvent;
    this.loadCourierDetails();
  }
  search(searchValue: string) {
    const pattern = /^[-_ A-Za-z0-9]*$/;
    if (pattern.test(searchValue)) {
      this.courierDetailsFacade.searchCourierName(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.loadCourierDetails();
  }

  addnew() {
    this.courierDetailsFacade.resetCourierDetails();
    this.router.navigate([getCourierDetailsRouteUrl()], {
      queryParams: { courierName: 'new' }
    });
  }

  loadCourierDetails() {
    this.courierDetailsFacade.loadCourierDetailsListing(
      this.courierDetailsPageEvent
    );
  }
  getCourierName(courierName: string) {
    this.courierDetailsFacade.resetCourierDetails();
    this.router.navigate([getCourierDetailsRouteUrl()], {
      queryParams: { courierName: courierName }
    });
  }
  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.INVENTORY_MENU_KEY
      }
    });
    this.courierDetailsFacade.resetCourierDetails();
  }

  isActive($event) {
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

          this.courierDetailsFacade.updateCourierStatus({
            courierName: $event.courierName,
            isActive: $event.isActive
          });
        } else this.loadCourierDetails();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.courierDetailsFacade.resetCourierDetails();
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
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.courierDetailsFacade.resetCourierDetails();
          });
      });
  }
  openViewPage($event) {
    this.courierDetailsFacade.resetCourierDetails();
    this.router.navigate([getCourierDetailsRouteUrl()], {
      queryParams: { courierName: $event, showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

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
}
