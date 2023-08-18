import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  getApprovalsHomeRouteUrl,
  getCMRequestApprovalsListRouteUrl,
  getGRFequestApprovalsListRouteUrl,
  getHomePageUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  ApprovalsMenuKeyEnum,
  BodEodStatusEnum,
  CmRequestList,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RequestStatusTypesEnum,
  SubTransactionTypeEnum,
  ToolbarConfig,
  TransactionTypeEnum,
  WorkflowTypeEnum
} from '@poss-web/shared/models';
import { grfRequestFacade } from '@poss-web/eposs/grf-manual-request/data-access-grf-request';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import * as moment from 'moment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
@Component({
  selector: 'poss-web-feature-grf-listing',
  templateUrl: './feature-grf-listing.component.html',
  styleUrls: ['./feature-grf-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureGrfListingComponent implements OnInit {

  requestListEnable = true;
  requestHistoryEnable = false;
  billHistoryEnable = false;
  isCorpUser: boolean;
  destroy$: Subject<null> = new Subject<null>();
  cmRequestList$: Observable<CmRequestList[]>;
  locationForSelection: SelectionDailogOption[] = [];
  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };
  pageIndex = 0;
  pageSize = 4;
  initalPageSize = 8;
  requestListLoadedOnce = true;
  status: string;
  isLoading$: Observable<boolean>;
  currentDate = moment();
  minDate = moment('00010101');
  dateRangeType = 'CUSTOM';
  requestNo: number;
  locationCode: string;
  requestListCount: number;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CM,
    subTxnType: SubTransactionTypeEnum.MANUAL_CM,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private GrfRequestFacade: grfRequestFacade,
    private locationMappingFacade: LocationMappingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private toolbarFacade: ToolbarFacade,
    private sharedBodEodFacade: SharedBodEodFacade,
    public authFacade: AuthFacade
  ) {
    if (router.url === getGRFequestApprovalsListRouteUrl()) {
      this.isCorpUser = true;
      this.status = RequestStatusTypesEnum.PENDING;
    } else {
      this.isCorpUser = false;
      this.status = RequestStatusTypesEnum.APPROVED;
      this.toolbarFacade.setToolbarConfig(this.toolbarData);
    }
  }

  ngOnInit() {
    // this.authFacade
    //   .isUserLoggedIn()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isLoggedIn: boolean) => {
    //     console.log('GrfRequestListComponent: isLoggedIn:', isLoggedIn);
    //     this.isLoggedIn = isLoggedIn;
    //   });

    this.GrfRequestFacade.clearGrfRequestList();
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: this.status,
      appliedFilters: this.defaultFilter(),
      pageIndex: this.pageIndex,
      pageSize: this.requestListLoadedOnce
        ? this.initalPageSize
        : this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,
      //userType: this.isCorpUser
    });
    this.requestListLoadedOnce = false;
    if (this.isCorpUser) {
      this.locationMappingFacade.searchLocations(this.locationFilter);
    }
    this.componentInit();

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
      });

    this.sharedBodEodFacade
      .getGoldRateAvailablityStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(goldRateAvailable => {
        this.isGoldRateAvailable = goldRateAvailable;
      });
  }

  componentInit() {
    this.cmRequestList$ = this.GrfRequestFacade.getGrfRequestList();
    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
    this.isLoading$ = this.GrfRequestFacade.getIsLoading();
    this.GrfRequestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.cmRequestList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.length !== 0) {
          this.requestListCount = data[0].totalElements;
        } else {
          this.requestListCount = 0;
        }
      });
  }

  requestList() {
    this.requestListEnable = true;
  }

  // requestHistory() {
  //   this.requestListEnable = false;
  //   this.requestHistoryEnable = true;
  //   this.billHistoryEnable = false;
  // }

  // billHistory() {
  //   this.requestListEnable = false;
  //   this.requestHistoryEnable = false;
  //   this.billHistoryEnable = true;
  // }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: { menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY }
    });
  }

  // possback() {
  //   const url = this.isGoldRateAvailable
  //     ? getSalesHomePageUrl()
  //     : getHomePageUrl();

  //   if (this.bodEodStatus === BodEodStatusEnum.OPEN) {
  //     this.router.navigate([url], {
  //       queryParams: {
  //         menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
  //       }
  //     });
  //   } else {
  //     this.router.navigate([getHomePageUrl()]);
  //   }
  // }

  searchByLocation(locationCode) {
    this.locationCode = locationCode;
    this.GrfRequestFacade.clearGrfRequestList();
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: this.status,
      appliedFilters:
        this.requestNo !== 0
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: this.requestNo,
              filterParams: {
                locationCode: locationCode
              }
            }
          : {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              filterParams: {
                locationCode: locationCode
              }
            },
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,

    });
  }

  searchByRequestNo(requestNo) {
    this.requestNo = requestNo;
    this.GrfRequestFacade.clearGrfRequestList();
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: this.status,
      appliedFilters:
        this.locationCode !== null
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: requestNo,
              filterParams: {
                locationCode: this.locationCode
              }
            }
          : {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: requestNo
            },
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,

    });
  }

  clearSearch(event) {
    let filter;
    if (event) {
      this.requestNo = 0;
      filter =
        this.locationCode !== null
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              filterParams: {
                locationCode: this.locationCode
              }
            }
          : this.defaultFilter();
    } else {
      this.locationCode = null;
      filter =
        this.requestNo !== 0
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: this.requestNo
            }
          : this.defaultFilter();
    }
    this.GrfRequestFacade.clearGrfRequestList();
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: this.status,
      appliedFilters: filter,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,

    });
  }

  loadMore(event) {
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: this.status,
      appliedFilters:
        this.requestNo !== 0
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: this.requestNo
            }
          : this.defaultFilter(),
      pageIndex: event,
      pageSize: this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,
    });
  }

  statusChange(event) {
    this.status = event;
    this.GrfRequestFacade.clearGrfRequestList();
    this.GrfRequestFacade.loadGrfRequestList({
      approvalStatus: event,
      appliedFilters:
        this.requestNo !== 0
          ? {
              dateRangeType: this.dateRangeType,
              endDate: moment(this.currentDate).valueOf(),
              startDate: moment(this.minDate).valueOf(),
              docNo: this.requestNo
            }
          : this.defaultFilter(),
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF,
    });
  }

  defaultFilter() {
    return {
      dateRangeType: this.dateRangeType,
      endDate: moment(this.currentDate).valueOf(),
      startDate: moment(this.minDate).valueOf()
    };
  }

  clearSearchData() {
    this.GrfRequestFacade.clearGrfRequestList();
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }


}
