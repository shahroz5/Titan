import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomErrors,
  RevenueRequest,
  RevenueResponse,
  RevenueTypesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  BankingAndRevenueMenuKeyEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { RevenueFacade } from '@poss-web/shared/revenue/data-access-revenue';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getBankingAndRevenueHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-day-wise-revenue',
  templateUrl: './day-wise-revenue.component.html'
})
export class DayWiseRevenueComponent implements OnInit, OnDestroy {
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  count = 0;
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  pageEvent: PageEvent;
  revenueTypeEnumRef = RevenueTypesEnum;

  dateRangeRequest: RevenueRequest;
  dayWiseRevenueList$: Observable<RevenueResponse>;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  dateRangeData: RevenueRequest = {
    fromDate: null,
    toDate: null
  };
  dateFormat: string;

  constructor(
    private router: Router,
    private revenueFacade: RevenueFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.isLoading$ = this.revenueFacade.getIsLoading();
    this.revenueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  ngOnInit(): void {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listingPageEvent.pageSize = data;
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
  }

  back() {
    this.router.navigate([getBankingAndRevenueHomeRouteUrl()], {
      queryParams: {
        menu: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }

  loadDayWiseRevenue(dateRange: RevenueRequest) {
    this.dateRangeData.fromDate = dateRange.fromDate;
    this.dateRangeData.toDate = dateRange.toDate;
    this.revenueFacade.loadDayWiseReveune(this.listingPageEvent, dateRange);
    this.dayWiseRevenueList$ = this.revenueFacade.getDayWiseRevenueList();
    this.dayWiseRevenueList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RevenueResponse) => {
        if (data) {
          this.count = data.totalRevenues;
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasBackdrop: true,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.revenueFacade.loadDayWiseReveune(
      this.listingPageEvent,
      this.dateRangeData
    );
  }

  ngOnDestroy(): void {
    this.revenueFacade.resetError();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
