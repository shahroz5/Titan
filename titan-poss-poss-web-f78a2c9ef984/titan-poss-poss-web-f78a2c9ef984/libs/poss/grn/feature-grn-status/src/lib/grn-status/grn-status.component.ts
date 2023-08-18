import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';
import { Observable, Subject } from 'rxjs';
import {
  GrnReqStatus,
  GrnEnums,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  GrnHistoryDetails,
  GrnHistoryPayload,
  SalesMenuKeyEnum
} from '@poss-web/shared/models';
import {
  getSalesHomePageUrl,
  grnDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/Operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

import { TranslateService } from '@ngx-translate/core';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@Component({
  selector: 'poss-web-grn-status',
  templateUrl: './grn-status.component.html',
  styleUrls: ['./grn-status.component.scss']
})
export class GrnStatusComponent implements OnInit, OnDestroy {
  type = 'status';
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject();
  pageSize = 4;
  initialPageSize = 8;
  histroyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  grnEnums = GrnEnums;
  invalidSearch = false;
  selectedRequestType = this.grnEnums.APPROVED;
  grnReqStatus$: Observable<GrnReqStatus[]>;
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;
  isReqListLodedOnce = false;
  isFilterd = false;
  pageSizeOptions: number[];
  grnHistory$: Observable<GrnHistoryDetails[]>;
  totalGrnHistoryReq$: Observable<number>;
  grnHistoryPayload: GrnHistoryPayload;
  countryFiscalYear: number;
  utcOffset = moment().startOf('day').utcOffset();
  clearFilter: boolean;
  data: GrnHistoryPayload;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private grnFacade: GrnFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private translate: TranslateService,
    private bodeodFacade: SharedBodEodFacade,    
    private commonFacade: CommonFacade
  ) {
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.grnFacade.clearGrnHistoryItems();
      this.grnFacade.clearHistorySearchParamDetails();
    }
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.grnFacade.loadReset();
    this.type = this.activatedRoute.snapshot.params['type'];
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.countryFiscalYear = fiscalYear;
        }
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.histroyPageEvent.pageSize = pageSize;
      });
    this.isLoading$ = this.grnFacade.getIsloading();
    this.grnReqStatus$ = this.grnFacade.getGrnReqStatus();
    this.grnHistory$ = this.grnFacade.getGrnHistory();
    this.totalGrnHistoryReq$ = this.grnFacade.getTotalGrnHistoryReq();

    this.totalElements$ = this.grnFacade.getTotalElement();
    this.grnFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    if (this.type !== this.grnEnums.HISTORY) {
      this.loadGrnReqStatus(0);
    }
    else{
      this.grnFacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: GrnHistoryPayload) => {
        if (historySearchParams) {
          this.data = historySearchParams;
        }
      });
    }
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  loadFilterdType(type) {
    this.isFilterd = true;
    this.selectedRequestType = type;
    this.grnFacade.filterGrnReqStatusList({
      filterOptions: {
        dateRangeType: this.grnEnums.ALL
      },
      size: this.initialPageSize,
      page: 0,
      approvalStatus: this.selectedRequestType,
      workflowType: this.grnEnums.GOODS_RETURN
    });
  }
  loadGrnReqStatus(pageIndex: number) {
    this.grnFacade.loadGrnReqStatusList({
      filterOptions: {
        dateRangeType: this.grnEnums.ALL
      },
      size: this.initialPageSize,
      page: pageIndex,
      approvalStatus: this.selectedRequestType,
      workflowType: this.grnEnums.GOODS_RETURN
    });
  }

  loadPaginatedReqStatus(pageIndex: number) {
    this.grnFacade.loadGrnReqStatusList({
      filterOptions: {
        dateRangeType: this.grnEnums.ALL
      },
      size: this.pageSize,
      page: pageIndex,
      approvalStatus: this.selectedRequestType,
      workflowType: this.grnEnums.GOODS_RETURN
    });
  }

  viewSelectedGrn(event: any) {
    this.commonFacade.setGrnWorkflowFlag(event.isWorkflow);
    this.commonFacade.setGrnCreditNoteType(event.creditNoteType);
    this.router.navigate([grnDetailsRouteUrl(GrnEnums.GRN_STATUS, event.grnId)]);
  }
  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
  changeTab(type: string) {
    this.grnFacade.loadReset();
    this.type = type;
    this.selectedRequestType = GrnEnums.APPROVED;
    this.router.navigate(['..', type], {
      relativeTo: this.activatedRoute
    });
    this.grnFacade.clearGrnHistoryItems();
    this.grnFacade.clearHistorySearchParamDetails();
    this.data = null;
    if (this.type === this.grnEnums.HISTORY) {
      this.commonFacade.setGrnWorkflowFlag(false);
      this.grnFacade.loadGrnHistory({
        page: this.histroyPageEvent.pageIndex,
        size: this.histroyPageEvent.pageSize,
        txnType: this.grnEnums.TXN_TYPE,
        subTxnType: this.grnEnums.SUB_TXN_TYPE,

        filterOptions: {
          fromDocDate: moment()
            .startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf(),

          toDocDate: moment()
            .startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf(),
          searchField: null,
          searchType: null
        }
      });
    } else {
      this.commonFacade.setGrnWorkflowFlag(true);
      this.loadGrnReqStatus(0);
    }
  }
  getDetails(grnId: string) {
    this.router.navigate([grnDetailsRouteUrl(GrnEnums.GRN_CREATE, grnId)]);
  }
  search(searchValue: string) {
    if (fieldValidation.numbersField.pattern.test(searchValue)) {
      this.grnFacade.searchGrn({
        filterOptions: {
          dateRangeType: this.grnEnums.ALL,
          filterParams: { refDocNo: searchValue }
        },
        approvalStatus: this.selectedRequestType,
        workflowType: this.grnEnums.GOODS_RETURN
      });
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;

    this.grnFacade.filterGrnReqStatusList({
      filterOptions: {
        dateRangeType: this.grnEnums.ALL
      },
      size: this.initialPageSize,
      page: 0,
      approvalStatus: this.selectedRequestType,
      workflowType: this.grnEnums.GOODS_RETURN
    });
  }

  searchHistory(grnHistoryPayload: GrnHistoryPayload) {
    if (
      grnHistoryPayload.filterOptions.cmLocation === null &&
      grnHistoryPayload.filterOptions.docNo === null &&
      grnHistoryPayload.filterOptions.fiscalYear === null &&
      grnHistoryPayload.filterOptions.fromDocDate === null &&
      grnHistoryPayload.filterOptions.toDocDate === null &&
      grnHistoryPayload.filterOptions.refDocNo === null &&
      grnHistoryPayload.filterOptions.searchField === null &&
      grnHistoryPayload.filterOptions.searchType === null
    ) {
      this.showAlertNotification('pw.grn.alertMessage');
    } else {
      grnHistoryPayload.page = this.histroyPageEvent.pageIndex;
      grnHistoryPayload.size = this.histroyPageEvent.pageSize;
      grnHistoryPayload.subTxnType = this.grnEnums.SUB_TXN_TYPE;
      grnHistoryPayload.txnType = this.grnEnums.TXN_TYPE;
      this.grnHistoryPayload = grnHistoryPayload;
      this.grnFacade.setHistorySearchParamDetails(grnHistoryPayload);
      this.grnFacade.loadGrnHistory(grnHistoryPayload);
    }
  }
  showAlertNotification(key: string): void {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            hasBackdrop: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  
  onSearchFormEvent(event) {
    this.grnHistoryPayload = {
      ...event,
      page: this.initialPageEvent.pageIndex,
      size: this.initialPageEvent.pageSize
    }
    this.searchHistory(this.grnHistoryPayload);
  }

  searchPaginatedHistory(pageEvent: PageEvent) {
    this.histroyPageEvent = pageEvent;
    this.grnHistoryPayload = {
      ...this.grnHistoryPayload,
      page: this.histroyPageEvent.pageIndex,
      size: this.histroyPageEvent.pageSize
    };

    this.grnFacade.loadGrnHistory(this.grnHistoryPayload);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
