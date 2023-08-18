import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConversionApprovalsFacade } from '@poss-web/eposs/conversion-approvals/data-access-conversion-approvals';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  ApprovalsMenuKeyEnum,
  ConversionApprovalsEnum,
  ConversionApprovalsItem,
  ConversionApprovalStatus,
  CustomErrors,
  LocationSummaryList,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PermissionData
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-conversion-approvals',
  templateUrl: './conversion-approvals.component.html'
})
export class ConversionApprovalsComponent implements OnInit, OnDestroy {
  tab: string;
  conversionApprovalsEnum = ConversionApprovalsEnum;

  permissions$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  isLoggedIn: boolean;
  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };
  clearFilters: boolean;
  selectedLocationCode: string;
  enteredRequestDocNo: number;
  locations$: Observable<LocationSummaryList[]>;
  defaultPageNumber = 0;
  defaultPageSize = 8;

  // UI Components Related
  conversionsRequestList$: Observable<ConversionApprovalsItem[]>;
  conversionsRequestListLength$: Observable<number>;

  destroy$: Subject<null> = new Subject<null>();

  OPEN_REQUESTS_TAB_PERMISSIONS =
    ConversionApprovalsEnum.OPEN_REQUESTS_TAB_PERMISSIONS;
  ACKNOWLEDGED_REQUESTS_TAB_PERMISSIONS =
    ConversionApprovalsEnum.ACKNOWLEDGED_REQUESTS_TAB_PERMISSIONS;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private authFacade: AuthFacade,
    private permissionfacade: PermissionFacade,
    private conversionApprovalsFacade: ConversionApprovalsFacade,
    private elementPermission: ElementPermissionService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  ngOnInit(): void {
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tab = this.activatedRoute.snapshot.params[
          ConversionApprovalsEnum.TAB
        ];
        this.changeTab(tab);
      });
    this.changeTab(
      this.activatedRoute.snapshot.params[ConversionApprovalsEnum.TAB]
    );

    this.componentInit();
    this.handleErrors();
  }

  componentInit() {
    this.isLoading$ = this.conversionApprovalsFacade.getIsLoading();

    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.locationMappingFacade.searchLocations(this.locationFilter);

    this.conversionsRequestList$ = this.conversionApprovalsFacade.getConversionRequestsList();
    this.conversionsRequestListLength$ = this.conversionApprovalsFacade.getConversionRequestsLength();

    this.locations$ = this.locationMappingFacade.getLocations();
  }

  handleErrors() {
    this.conversionApprovalsFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.errorHandler(errorVal));

    this.locationMappingFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.errorHandler(errorVal));
  }

  searchByFilters(event: { locationCode: string; requestDocNo: number }) {
    this.selectedLocationCode = event.locationCode;
    this.enteredRequestDocNo = event.requestDocNo;
    this.clearFilters = false;

    this.loadConversionRequestList();
  }

  loadConversionRequestList(
    pageNumber: number = this.defaultPageNumber,
    pageSize: number = this.defaultPageSize
  ) {
    this.conversionApprovalsFacade.loadApprovalRequestsList(
      this.getRequestsListPayload(pageNumber, pageSize)
    );
  }

  loadMoreConversionRequestList(
    pageNumber: number = this.defaultPageNumber,
    pageSize: number = this.defaultPageSize
  ) {
    this.conversionApprovalsFacade.loadMoreApprovalRequestsList(
      this.getRequestsListPayload(pageNumber, pageSize)
    );
  }

  getRequestsListPayload(pageNumber, pageSize) {
    const payload = {
      reqDocNo: this.enteredRequestDocNo ? this.enteredRequestDocNo : null,
      locationCode: this.selectedLocationCode
        ? this.selectedLocationCode
        : null,
      status:
        this.tab === ConversionApprovalsEnum.ACKNOWLEDGED_REQUESTS
          ? ConversionApprovalStatus.APVL_PENDING
          : ConversionApprovalStatus.ACKNOWLEDGE_PENDING,
      pageNumber: pageNumber,
      pageSize: pageSize
    };
    return payload;
  }

  loadPermission = (element: string): Observable<PermissionData> =>
    this.elementPermission.loadPermission(element, this.permissions$);

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.INVENTORY_MENU_KEY
      }
    });
  }

  changeTab(newTab: ConversionApprovalsEnum) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.router.navigate(['..', this.tab], {
        relativeTo: this.activatedRoute
      });

      this.clearFilters = true;
      this.selectedLocationCode = null;
      this.enteredRequestDocNo = null;
    }
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        message: error.message,
        error: error,
        hasClose: !!error,
        hasBackdrop: true
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.conversionApprovalsFacade.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
