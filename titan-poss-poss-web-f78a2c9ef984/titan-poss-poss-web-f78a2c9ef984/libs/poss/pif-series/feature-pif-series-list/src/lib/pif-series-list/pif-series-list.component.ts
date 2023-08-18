import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PIFSeriesFacade } from '@poss-web/poss/pif-series/data-access-pif-series';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PIFSeries,
  PossHomeKeyEnum,
  SavePIFSeriesPayload,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-pif-series-list',
  templateUrl: './pif-series-list.component.html'
})
export class PIFSeriesListComponent implements OnInit, OnDestroy {
  pifSeriesPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  destroy$ = new Subject<null>();
  totalElements$: Observable<number>;
  pifSeries: PIFSeries[];
  isLoading$: Observable<boolean>;
  bussinessDay: number;

  constructor(
    private pifSeriesFacade: PIFSeriesFacade,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.pifSeriesFacade.resetPIFSeries();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.pifSeriesPageEvent.pageSize = pageSize;
        this.loadPIFSeries();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.totalElements$ = this.pifSeriesFacade.getTotalElements();
    this.pifSeriesFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.pifSeriesFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.saveNotification('pw.pifSeries.successMessage');
          this.pifSeriesFacade.loadPIFSeries(this.pifSeriesPageEvent);
        }
      });
    this.isLoading$ = this.pifSeriesFacade.getIsLoading();
    this.pifSeriesFacade
      .getPIFSeries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pifSeries: PIFSeries[]) => {
        if (pifSeries) {
          this.pifSeries = [];
          let rowIndex = 1;
          for (const series of pifSeries) {
            this.pifSeries.push({
              id: series.id,
              bankName: series.bankName,
              paymentCode: series.paymentCode,
              fromNo: series.fromNo,
              toNo: series.toNo,
              currentSeqNo: series.currentSeqNo,
              isHomeBank: series.isHomeBank,
              isActive: series.isActive,
              rowIndex: rowIndex++
            });
          }
        }
      });

    this.bodEodFeatureService
      .getEodBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
        } else {
          this.showAlertNotification(
            'pw.boutiqueBankDeposit.businessDayAlertMsg'
          );
        }
      });

    // this.bodEodFeatureService
    //   .getLatestBusinessDate()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((closedBusinessDate: number) => {
    //     if (closedBusinessDate) {
    //       this.bussinessDay = closedBusinessDate;
    //     }
    //   });

    // this.bodEodFeatureService
    //   .getBodEodStatus()
    //   .pipe(
    //     filter(bodEodStatus => !!bodEodStatus),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(bodEodStatus => {
    //     if (bodEodStatus !== 'EOD_IN_PROGRESS') {
    //       this.showAlertNotification(
    //         'pw.boutiqueBankDeposit.businessDayAlertMsg'
    //       );
    //     }
    //   });
  }

  errorHandler(error: CustomErrors) {
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
  loadPIFSeries() {
    this.pifSeriesFacade.loadPIFSeries({
      pageIndex: this.pifSeriesPageEvent.pageIndex,
      pageSize: this.pifSeriesPageEvent.pageSize
    });
  }
  saveNotification(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            //this.pifSeriesFacade.resetPIFSeries();
          });
      });
  }

  showAlertNotification(key: string): void {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: true,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  paginator($event) {
    this.pifSeriesPageEvent = $event;
    this.loadPIFSeries();
  }
  savePIFSeries(savePayload: SavePIFSeriesPayload[]) {
    this.pifSeriesFacade.savePIFSeries(savePayload);
  }
  back() {
    this.pifSeriesFacade.resetPIFSeries();
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.PIF_SERIES
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
