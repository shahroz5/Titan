import {
  ElementRef,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  AutoReportList,
  SaveAutoReportPayload
} from '@poss-web/shared/models';

import { getReportHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-report-auto-generation',
  templateUrl: './report-auto-generation.component.html'
})
export class ReportAutoGenerationComponent
  implements OnInit, OnDestroy, AfterViewInit {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  permissions$: Observable<any[]>;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  autoReportList$: Observable<AutoReportList[]>;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  totalReports$: Observable<number>;
  pageSizeOptions: number[];
  searchValue: string;
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private reportsFacade: ReportsFacade,
    private permissionfacade: PermissionFacade,
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.searchValue = searchValue;
    this.loadAutoReportList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.searchValue = null;
    this.loadAutoReportList();
  }
  ngOnInit() {
    this.reportsFacade.clearReportsData();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.isLoading$ = this.reportsFacade.getIsLoading();
    this.totalReports$ = this.reportsFacade.getTotalReports();
    this.autoReportList$ = this.reportsFacade.getAutoReportList();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.pageEvent.pageSize = pageSize;
        this.loadAutoReportList();
      });

    this.reportsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.reportsFacade
      .getSaveReportResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response?.isSaved) {
          this.loadAutoReportList();
          this.showSuccessNotifications();
        }
      });
  }

  loadAutoReportList() {
    this.reportsFacade.loadAutoReportList({
      pageIndex: this.pageEvent.pageIndex,
      pageSize: this.pageEvent.pageSize,
      reportDesc: this.searchValue ? this.searchValue : undefined
    });
  }

  loadPaginateData(event: PageEvent) {
    this.pageEvent = event;
    this.loadAutoReportList();
  }

  back() {
    this.router.navigate([getReportHomeRouteUrl()]);
  }

  save(saveAutoReportPayload: SaveAutoReportPayload) {
    this.reportsFacade.saveAutoReportList(saveAutoReportPayload);
    this.showProgressNotification();
  }

  showProgressNotification() {
    const key = 'pw.reports.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }
  showSuccessNotifications() {
    const key = 'pw.reports.reportAutoSaveSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
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
