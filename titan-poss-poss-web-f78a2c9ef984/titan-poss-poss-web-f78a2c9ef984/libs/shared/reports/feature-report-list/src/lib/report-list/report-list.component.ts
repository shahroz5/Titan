import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  Report,
  ReportStatus,
  SelectDropDownOption,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getReportHomeRouteUrl } from '@poss-web/shared/util-site-routes';

import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';

@Component({
  selector: 'poss-web-report-list',
  templateUrl: './report-list.component.html'
})
export class ReportListComponent implements OnInit, AfterViewInit, OnDestroy {
  currentDate = moment();
  reportForm: FormGroup;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  isLoadingReports$: Observable<boolean>;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  reportNames: SelectDropDownOption[] = [];
  reportGroups: SelectDropDownOption[] = [];
  reports: Report[] = [];
  totalReports = 0;
  allOptions = ReportStatus.ALL;
  reportStatusOptions: SelectDropDownOption[] = [];
  noDataFoundMessage;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  fromDate = this.currentDate;
  toDate = this.currentDate;
  selectedTab = 0;
  boutiqueUser: any;
  businessDate: any;
  constructor(
    private reportsFacade: ReportsFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public profiledatafacade: ProfileDataFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.profiledatafacade
      .isBTQUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isBoutiqueUser => {
        this.boutiqueUser = isBoutiqueUser;
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.businessDate = moment(data);
      });
    this.translate
      .get(['pw.entity.reportEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.reportEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.translate
      .get([
        'pw.reports.completedStatus',
        'pw.reports.inProgressStatus',
        'pw.reports.failedStatus',
        'pw.reports.fromDateLabel',
        'pw.reports.toDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.reportStatusOptions = [
          {
            value: ReportStatus.COMPLETED,
            description: translatedMsg['pw.reports.completedStatus']
          },
          {
            value: ReportStatus.IN_PROGRESS,
            description: translatedMsg['pw.reports.inProgressStatus']
          },
          {
            value: ReportStatus.FAILED,
            description: translatedMsg['pw.reports.failedStatus']
          }
        ];
        console.log(this.businessDate, this.currentDate);

        this.reportForm = new FormGroup({
          referenceNumber: new FormControl(),
          reportName: new FormControl(),
          reportStatus: new FormControl(),
          reportGroup: new FormControl(),
          fromDate: new FormControl(
            this.boutiqueUser ? this.businessDate : this.currentDate,
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.reports.fromDateLabel']
            )
          ),
          toDate: new FormControl(
            this.boutiqueUser ? this.businessDate : this.currentDate,
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.reports.toDateLabel']
            )
          )
        });
      });
  }

  fromDateChange(event) {
    this.fromDate = event?.value;
    this.toDate = null;
  }

  toDateChange(event) {
    if (event?.value) {
      this.toDate = event?.value;
      this.pageEvent.pageIndex = 0;
      this.loadReports();
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const referenceNumber = this.reportForm.value.referenceNumber;
        if (referenceNumber) {
          this.pageEvent.pageIndex = 0;
          this.loadReports();
        } else {
          this.clearSearch();
        }
      });
  }

  dateCompare(date1: Moment, date2: Moment) {
    return date1?.format('DDMMYY') !== date2?.format('DDMMYY');
  }

  clearSearch() {
    this.reportForm.get('referenceNumber').reset();
    this.pageEvent.pageIndex = 0;
    this.loadReports();
  }

  ngOnInit() {
    this.reportsFacade.clearReportsData();

    this.reportForm
      .get('reportStatus')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageEvent.pageIndex = 0;
        this.loadReports();
      });



    this.reportsFacade
      .getReportGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportGroups => {
        this.reportGroups = reportGroups.map(reportGroup => ({
          value: reportGroup.code,
          description: reportGroup.value
        }));
      });

    this.reportsFacade
      .getReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reports => {
        this.reports = reports;
      });

    this.reportsFacade
      .getReportNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportNames => {
        this.reportNames = reportNames.map(reportName => ({
          value: reportName.name,
          description: reportName.reportDes
        }));
      });

    this.reportsFacade
      .getTotalReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalReports => {
        this.totalReports = totalReports;
      });

    this.reportsFacade.loadReportGroups();
    this.isLoading$ = this.reportsFacade.getIsLoading();
    this.isLoadingReports$ = this.reportsFacade.getIsLoadingReports();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.pageEvent.pageSize = pageSize;
        this.loadReports();
      });

    this.reportsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.reportForm
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.reportForm.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  downloadReport(data: string) {
    this.reportsFacade.downloadReport({
      reportId: data,
      selectedTab: this.selectedTab
    });
  }
  onReportGroupChange(event) {
    this.pageEvent.pageIndex = 0;
    this.reportForm.get('reportGroup').patchValue(event.value);
    this.reportForm.get('reportName').reset();
    this.reportsFacade.loadReportNames(event.value);
    this.loadReports();
  }
  onReportNameChange(event) {
    this.pageEvent.pageIndex = 0;
    this.reportForm.get('reportName').patchValue(event.value);
    this.loadReports();
  }
  loadReports() {
    this.reportsFacade.loadReports({
      referenceNumber: this.reportForm.get('referenceNumber').value,
      pageSize: this.pageEvent.pageSize,
      pageIndex: this.pageEvent.pageIndex,
      reportDesc: this.reportForm.get('reportName').value,
      reportGroup: this.reportForm.get('reportGroup').value,
      reportStatus: this.reportForm.get('reportStatus').value,
      fromDate: this.fromDate?.format(),
      toDate: this.toDate?.format(),
      selectedTab: this.selectedTab
    });
  }

  loadPaginateData(event: PageEvent) {
    this.pageEvent = event;
    this.loadReports();
  }
  changeTab(tab) {
    this.reportForm.get('referenceNumber').reset();
    this.reportForm.get('reportName').reset();
    this.reportForm.get('reportStatus').reset();
    this.reportForm.get('reportGroup').reset();

    this.selectedTab = tab;
    this.loadReports();
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  back() {
    this.router.navigate([getReportHomeRouteUrl()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
