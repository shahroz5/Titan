import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  getCMBillCancelRouteUrl,
  getSalesHomePageUrl,
  getBillCancelRouteUrl,
  getBcHistoryDetailsPageUrl
} from '@poss-web/shared/util-site-routes';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { BillCancelFacade } from '@poss-web/poss/bc/data-access-bc';

import {
  SelectDropDownOption,
  OverlayNotificationServiceAbstraction,
  LocationSettingAttributesEnum,
  OverlayNotificationType,
  TransactionTypeEnum,
  CustomErrors,
  CashMemoHistoryDetails,
  bcHistoryDetails,
  bcHistoryRequestPayload,
  bcHistoryResponse,
  BCTabsEnum,
  SalesMenuKeyEnum
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';

import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PageEvent } from '@angular/material/paginator';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

@Component({
  selector: 'poss-web-bc-history',
  templateUrl: './bc-history.component.html'
})
export class BcHistoryComponent implements OnInit, OnDestroy {
  tab: BCTabsEnum;
  destroy$: Subject<null> = new Subject<null>();
  BCTabsEnumRef = BCTabsEnum;
  isLoggedIn: boolean;
  pageSizeOptions: number[] = [];
  searchForm: FormGroup;
  utcOffset = moment().startOf('day').utcOffset();
  countryFiscalYear: number;
  currentFiscalYear: string;
  data: any;
  searchValue: {
    docNo: any;
    fiscalYear: any;
    searchType: any;
    searchField: any;
    fromDocDate: any;
    toDocDate: any;
    refDocNo: any;
  };
  histroyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  BcHistory$: Observable<bcHistoryDetails[]>;
  bcHistoryDetails: bcHistoryDetails;
  isHistoryDetailsLoading$: Observable<boolean>;
  subTxnTypes: SelectDropDownOption[];

  noDataFoundMessageHistory: any;
  currentDate = moment();

  subTxnTypeLabel: string;
  minPageSize: number;
  BCHistory$: Observable<CashMemoHistoryDetails[]>;
  historyItems: bcHistoryDetails[];
  totalElements: number;
  fiscal: any;
  totalElementlength: number;
  historyItemlength: bcHistoryDetails[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private translate: TranslateService,
    private cashMemoFacade: CashMemoFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private billcancelfacade: BillCancelFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    if (
      !(
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.clearFilter === false
      )
    ) {
      this.billcancelfacade.resethistory();
      this.billcancelfacade.clearHistorySearchParamDetails();
    }
  }

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
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
      });
    this.tab = this.activatedRoute.snapshot.params['tab'];
    this.changeTab(this.activatedRoute.snapshot.params['tab']);

    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearCashMemo();
    this.cashMemoFacade.resetValues();
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data) {
          this.countryFiscalYear = Number(data);
        }
      });

    this.translate
      .get(['pw.entity.resultEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.resultEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageHistory =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.billcancelfacade
      .getBcList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historyResponse: bcHistoryResponse) => {
        if (historyResponse && historyResponse.bcHistoryDetails.length > 0) {
          this.historyItems = historyResponse.bcHistoryDetails;
          this.totalElements = historyResponse.totalElements;
        } else if (
          historyResponse &&
          historyResponse.bcHistoryDetails.length === 0
        ) {
          this.historyItems = historyResponse.bcHistoryDetails;
          this.totalElements = historyResponse.totalElements;
        }
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.histroyPageEvent.pageSize = pageSize;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });

    this.billcancelfacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: bcHistoryRequestPayload) => {
        if (historySearchParams) {
          this.data = historySearchParams;
        }
      });

    this.isHistoryDetailsLoading$ = this.billcancelfacade.getisLoading();
  }

  searchHistory() {
    const searchValue = {
      docNo: this.searchForm.get('cmNoHeader')?.value
        ? this.searchForm.get('cmNoHeader')?.value
        : null,
      fiscalYear: this.searchForm.get('fiscalYear')?.value
        ? this.searchForm.get('fiscalYear')?.value
        : null,
      refDocNo: this.searchForm.get('refDocNo')?.value
        ? this.searchForm.get('refDocNo')?.value
        : null,
      searchType: this.searchForm.get('searchType')?.value
        ? this.searchForm.get('searchType')?.value
        : null,
      searchField: this.searchForm.get('searchField')?.value
        ? this.searchForm.get('searchField').value
        : null,
      fromDocDate: this.searchForm.get('fromDocDate')?.value?.startOf('days')
        ? this.searchForm
            .get('fromDocDate')
            ?.value.startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf()
        : null,
      toDocDate: this.searchForm.get('toDocDate')?.value?.startOf('days')
        ? this.searchForm
            .get('toDocDate')
            ?.value.startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf()
        : null
    };

    if (
      searchValue.docNo === null &&
      searchValue.fiscalYear === null &&
      searchValue.refDocNo === null &&
      searchValue.fromDocDate === null &&
      searchValue.toDocDate === null &&
      searchValue.searchField === null &&
      searchValue.searchType === null
    ) {
      this.showAlertNotification('pw.bc.alertMessage1');
    } else if (searchValue.docNo !== null && searchValue.fiscalYear === null) {
      this.showAlertNotification('pw.bc.alertMessage4');
    } else {
      const historySearchParamDetails: bcHistoryRequestPayload = {
        docNo: this.searchForm.get('cmNoHeader')?.value,
        fiscalYear: this.searchForm.get('fiscalYear')?.value,
        fromDocDate: this.searchForm.get('fromDocDate')?.value,
        refDocNo: this.searchForm.get('refDocNo')?.value,
        toDocDate: this.searchForm.get('toDocDate')?.value
      };
      this.billcancelfacade.setHistorySearchParamDetails(
        historySearchParamDetails
      );

      let bcHistoryRequestPayload: bcHistoryRequestPayload;
      let bcHistoryRequest = {
        ...bcHistoryRequestPayload,
        subTxnType: this.searchForm.get('subTxnType').value,
        searchField: this.searchForm.get('searchField').value,
        searchType: this.searchForm.get('searchType').value,
        page: this.histroyPageEvent.pageIndex,
        size: this.histroyPageEvent.pageSize,
        txnType: TransactionTypeEnum.CMCAN,
        filterOptions: searchValue
      };
      this.searchValue = searchValue;
      this.billcancelfacade.loadBCHistory(
        bcHistoryRequest.filterOptions,
        bcHistoryRequest.searchField,
        bcHistoryRequest.searchType,
        bcHistoryRequest.page,
        bcHistoryRequest.size,
        bcHistoryRequest.txnType,
        bcHistoryRequest.subTxnType
      );
    }
  }
  public onSearchFormEvent(event) {
    this.searchForm = event;
    this.searchHistory();
  }
  searchPaginatedHistory(pageEvent: PageEvent) {
    this.histroyPageEvent = pageEvent;
    this.bcHistoryDetails = {
      ...this.bcHistoryDetails,
      size: this.histroyPageEvent.pageSize,
      page: this.histroyPageEvent.pageIndex
    };

    this.billcancelfacade.loadBCHistory(
      this.searchValue,

      this.searchForm.get('searchField').value,
      this.searchForm.get('searchType').value,
      this.histroyPageEvent.pageIndex,
      this.histroyPageEvent.pageSize,
      TransactionTypeEnum.CMCAN,
      this.searchForm.get('subTxnType').value
    );
  }

  getSelectedHistoryItem(event) {
    if (event) {
      this.router.navigateByUrl(
        getBcHistoryDetailsPageUrl(event.subTxnType, event.cmId)
      );
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

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  clearDocRange() {
    this.searchForm.get('fromDocDate').reset();
    this.searchForm.get('toDocDate').reset();
  }

  changeTab(newTab: BCTabsEnum) {
    if (this.tab !== newTab) {
      this.tab = newTab;
      if (this.tab) {
        this.router.navigate([getCMBillCancelRouteUrl(this.tab)]);
      } else {
        this.router.navigate([getBillCancelRouteUrl()]);
      }
    }
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  ngOnDestroy(): void {
    // this.billcancelfacade.resethistory()
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
