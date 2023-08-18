import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BillCancelFacade } from '@poss-web/poss/bc/data-access-bc';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CmFilterPopupComponent } from '@poss-web/poss/bc/ui-bc-list';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import {
  BcTypesEnum,
  CmBillList,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  BcCmRouteTypesEnum,
  getCMBillCancelDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

@Component({
  selector: 'poss-web-bc-list',
  templateUrl: './bc-list.component.html'
})
export class BcListComponent implements OnInit, OnDestroy {
  cmBillList$: Observable<CmBillList[]>;
  isFilterApplied = false;
  selectedSortOrder = 'desc';
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[];
  pageIndex = 0;
  minPageSize = 0;
  customerName = null;
  refDocNo = null;
  destroy$: Subject<null> = new Subject<null>();
  configHours: number;
  isLoading$: Observable<boolean>;
  isApproval: boolean;

  constructor(
    private router: Router,
    private facade: BillCancelFacade,
    private dialog: MatDialog,
    private appsetttingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade
  ) {}

  ngOnInit(): void {
    this.facade.loadCmBillList({
      txnType: BcTypesEnum.CM_CAN,
      subTxnType: BcTypesEnum.CASH_MEMO,
      sort: this.selectedSortOrder,
      customerName: this.customerName,
      refDocNo: this.refDocNo,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
    this.componentInit();
  }

  componentInit() {
    this.appsetttingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => (this.pageSize = resp));

    this.appsetttingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.pageSizeOptions = resp;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.cmBillList$ = this.facade.getCmBillList();
    this.isLoading$ = this.facade.getisLoading();
    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.facade
      .getCmBillList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(billList => {
        if (billList.length !== 0) {
          this.totalElements = billList[0].totalElements;
        } else {
          this.totalElements = 0;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CM_MAX_HOURS_FOR_BILL_CANCEL
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(configHours => {
        this.configHours = Number(configHours);
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CM_IS_BILL_CANCEL_APPROVAL_REQUIRED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isApproval => {
        if (!!isApproval) {
          this.isApproval = JSON.parse(isApproval);
        }
      });
  }

  selectedCm(event) {
    this.router.navigate([
      getCMBillCancelDetailsRouteUrl(
        Object.keys(BcCmRouteTypesEnum).filter(
          key => BcCmRouteTypesEnum[key] === event.subTxnType
        )[0],
        event.refTxnId
      )
    ]);
  }

  advancedFilter(event) {
    this.overlayNotification.close();
    const dialogRef = this.dialog.open(CmFilterPopupComponent, {
      width: '30vw',
      data: {
        reqDocNo: this.refDocNo,
        customerName: this.customerName
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.refDocNo = res.reqDocNo;
          this.customerName = res.customerName;
          if (res.reqDocNo || res.customerName) {
            this.isFilterApplied = true;
          } else {
            this.isFilterApplied = false;
          }
          this.facade.loadCmBillList({
            txnType: BcTypesEnum.CM_CAN,
            subTxnType: BcTypesEnum.CASH_MEMO,
            sort: this.selectedSortOrder,
            customerName: res.customerName,
            refDocNo: res.reqDocNo,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          });
        }
      });
  }

  sortOrder(event) {
    this.selectedSortOrder = event.sort.toLowerCase();
    this.facade.loadCmBillList({
      txnType: BcTypesEnum.CM_CAN,
      subTxnType: BcTypesEnum.CASH_MEMO,
      sort: event !== null ? event.sort.toLowerCase() : 'desc',
      customerName: this.customerName,
      refDocNo: this.refDocNo,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  paginate(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.facade.loadCmBillList({
      txnType: BcTypesEnum.CM_CAN,
      subTxnType: BcTypesEnum.CASH_MEMO,
      sort: this.selectedSortOrder,
      customerName: this.customerName,
      refDocNo: this.refDocNo,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }

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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
