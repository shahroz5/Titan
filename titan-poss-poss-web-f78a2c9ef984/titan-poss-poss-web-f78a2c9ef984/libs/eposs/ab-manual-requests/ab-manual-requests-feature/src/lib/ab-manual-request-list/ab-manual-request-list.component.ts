import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { takeUntil, filter, debounceTime } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import {
  AbManualRequestList,
  ApprovalsMenuKeyEnum,
  CustomErrors,
  HistoryFilterData,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  WorkflowTypeABEnum,
  LocationSettingAttributesEnum
} from '@poss-web/shared/models';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import * as moment from 'moment';
import { AbManualRequestFacade } from '@poss-web/eposs/ab-manual-requests/data-access-ab-manual-requests';

import { MatDialog } from '@angular/material/dialog';
import { FilterPopupComponent } from '@poss-web/eposs/ab-manual-requests/ui-ab-manual-requests';
import { FormControl } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  getApprovalsHomeRouteUrl,
  getApprovalsManualAbDetailsTabsUrl,
  getApprovalsManualAdvanceBookingTabsUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-ab-manual-request-list',
  templateUrl: './ab-manual-request-list.component.html'
})
export class AbManualRequestListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tab = 'requests';
  destroy$: Subject<null> = new Subject<null>();
  requestListCount = 0;
  hasNotification = true;
  status = 'PENDING';
  pageIndex = 0;
  pageSize = 4;
  historyFormData: any;
  isHistoryLoadedOnce = false;
  abManualRequestList$: Observable<AbManualRequestList[]>;
  isLoading$: Observable<boolean>;
  initalPageSize = 8;
  currentDate = moment();
  searchValue: number;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchFormControl = new FormControl();
  isLoggedIn: boolean;
  noDataFoundMessage: any;
  currentFiscalYear: string;
  constructor(
    private router: Router,
    private requestFacade: AbManualRequestFacade,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade
  ) {
    this.translate
      .get(['pw.entity.abManual'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.abManual']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
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
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
      });

    this.tab = this.activatedRoute.snapshot.params['tab'];
    this.changeTab(this.tab);
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
      console.log('dont clear');
    } else {
      this.requestFacade.resetFilter();
    }
  }

  changeTab(newTab: any) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.router.navigate([getApprovalsManualAdvanceBookingTabsUrl(this.tab)]);
    }
  }
  ngOnInit() {
    this.requestFacade.clearAbManualRequestList();
    this.componentInit();
    this.loadRequests(0);
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
  }
  dateFormat(date) {
    return moment(date);
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchValue = searchValue;
            this.isHistoryLoadedOnce = false;
            this.requestFacade.clearAbManualRequestList();
            this.loadRequests(0);
          } else {
          }
        } else {
          this.clearSearch();
        }
      });
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }
  advancedFilter(e) {
    this.overlayNotification.close();
    const emitData = {
      formData: this.historyFormData ? this.historyFormData : {},
      currentFiscalYear: this.currentFiscalYear
    };
    const dialogRef = this.dialog.open(FilterPopupComponent, {
      width: '30vw',
      data: emitData
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.requestFacade.clearAbManualRequestList();
          this.requestFacade.loadHistoryFilterData(res);

          this.isHistoryLoadedOnce = false;
          this.historyFormData = res;
          this.loadRequests(0);
        }
      });
  }
  componentInit() {
    this.abManualRequestList$ = this.requestFacade.getAbManualRequestList();
    this.abManualRequestList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data, 'listing');
        if (data.length !== 0) {
          this.requestListCount = data[0].totalElements;
        } else {
          this.requestListCount = 0;
        }
      });
    this.isLoading$ = this.requestFacade.getIsLoading();
    this.requestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  onSelected(request) {
    this.router.navigate([
      getApprovalsManualAbDetailsTabsUrl(request.taskId, request.processId)
    ]);
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
  loadRequests(pageIndex: number): void {
    this.searchFormControl.updateValueAndValidity();

    let valid = {};
    let body: any;
    this.requestFacade
      .getHistoryFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: HistoryFilterData) => {
        console.log(filterData);
        this.historyFormData = filterData;
      });
    body = {
      dateRangeType: 'CUSTOM',
      endDate: this.historyFormData
        ? this.historyFormData.endDate
        : this.currentDate.endOf('day'),

      fiscalYear: this.historyFormData
        ? this.historyFormData.reqFiscalYear
        : null,

      startDate: this.historyFormData
        ? this.historyFormData.startDate
        : this.currentDate.startOf('day')
    };
    if (this.historyFormData.location) {
      valid = {
        ...valid,
        locationCode: this.historyFormData.location.toUpperCase()
      };
    }
    if (this.searchValue) {
      body = {
        ...body,
        docNo: this.searchValue,

        filterParams: valid
      };
    } else {
      body = {
        ...body,
        filterParams: valid
      };
    }

    this.requestFacade.loadAbManualRequestList({
      approvalStatus: this.status,
      appliedFilters: body,
      pageIndex: pageIndex,
      pageSize: !this.isHistoryLoadedOnce ? this.initalPageSize : this.pageSize,
      workflowType: WorkflowTypeABEnum.MANUAL_BILL
    });

    this.isHistoryLoadedOnce = true;
  }

  clearSearch() {
    this.searchFormControl.reset();

    this.requestFacade.clearAbManualRequestList();
    this.searchValue = null;

    this.isHistoryLoadedOnce = false;
    this.loadRequests(0);
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
