import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AdvanceHistoryItemsRequestPayload,
  CustomErrors,
  GEPList,
  GEPSearchResponse,
  HistorySearchParamDetails,
 OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { Observable, of, Subject } from 'rxjs';

import { getGEPHistoryDetailUrl } from '@poss-web/shared/util-site-routes';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'poss-web-gep-history',
  templateUrl: './gep-history.component.html'
})
export class GepHistoryComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();
  data: any;
  gepHistorySearchForm: FormGroup;
  docNo: string;
  cnDocNo: string;
  fiscalyear: string;
  mobileNoOption: string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;
  searchTypeOptions: SelectDropDownOption[] = [];
  subTxnTypeOptions: SelectDropDownOption[];
  statusOptions: SelectDropDownOption[];
  showSearchField: boolean;
  searchFieldPlaceholder: string;
  searchValue: {
    docNo: any;
    fiscalYear: any;
    searchType: any;
    searchField: any;
    startDate: any;
    endDate: any;
    fromNetAmount: any;
    toNetAmount: any;
  };
  minPageSize = 0;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  historyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  totalElements = 0;
  pageSizeOptions: number[];
  gepHistoryList: GEPList[];

  utcOffset = moment().startOf('day').utcOffset();
  totalGepHistoryReq$: Observable<number>;
  isLoading$: Observable<boolean> = of(false);
  noDataFoundMessageHistory: '';

  selectedHistoryItem: any;
  currentFiscalYear: string;
  clearFilter: boolean;

  businessDay = moment();

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private toolbarFacade: ToolbarFacade,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private gepFacade: GepFacade,
    private commonFacade: CommonFacade,
    private router: Router
  ) {
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.gepFacade.clearGEPHistoryItems();
      this.gepFacade.clearHistorySearchParamDetails();
    }
  }

  ngOnInit(): void {
    this.commonFacade.setFileUploadVisible(false);
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

    this.bodeodFacade.loadLatestBusinessDay();
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (date) {
          this.businessDay = moment(date);
        }
      });

    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if(fiscalYear)
        this.currentFiscalYear = fiscalYear.toString();
      });

    this.toolbarFacade.setToolbarConfig({
      txnType: TransactionTypeEnum.GEP,
      subTxnType: SubTransactionTypeEnum.NEW_GEP,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });

    this.gepFacade
      .getGEPHistoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historyResponse: GEPSearchResponse) => {
        if (historyResponse && historyResponse.GEPList.length > 0) {
          this.gepHistoryList = historyResponse.GEPList;
          this.totalElements = historyResponse.totalElements;
        } else if (historyResponse && historyResponse.GEPList.length === 0) {
          this.gepHistoryList = historyResponse.GEPList;
          this.totalElements = historyResponse.totalElements;
        }
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.initialPageEvent.pageSize = resp;
        this.historyPageEvent.pageSize = resp;
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.pageSizeOptions = resp;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.isLoading$ = this.gepFacade.getIsLoaded();

    this.gepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });

    this.gepFacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: HistorySearchParamDetails) => {
        if (historySearchParams) {
          this.data = historySearchParams;
        }
      });
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

  getSelectedHistoryItem(event) {
    if (event) {
      this.router.navigate([
        getGEPHistoryDetailUrl(event.txnId, event.subTxnType)
      ]);
    }
  }

  public onSearchFormEvent(event) {
    this.gepHistorySearchForm = event;
    this.searchPaginatedHistory(this.initialPageEvent);
  }

  searchAdvanceHistoryItem(pageEvent: PageEvent) {
    if (
      !this.gepHistorySearchForm.get('docNumber').value &&
      !this.gepHistorySearchForm.get('cnDocNo').value &&
      !this.gepHistorySearchForm.get('fiscalYear').value &&
      !this.gepHistorySearchForm.get('toNetAmount').value &&
      !this.gepHistorySearchForm.get('fromNetAmount').value &&
      !this.gepHistorySearchForm.get('startDate').value &&
      !this.gepHistorySearchForm.get('endDate').value &&
      !this.gepHistorySearchForm.get('searchField').value &&
      !this.gepHistorySearchForm.get('searchType').value &&
      !this.gepHistorySearchForm.get('status').value
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage1');
    } else if (
      this.gepHistorySearchForm.get('fromNetAmount').value &&
      !this.gepHistorySearchForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage2');
    } else if (
      !this.gepHistorySearchForm.get('fromNetAmount').value &&
      this.gepHistorySearchForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage3');
    } else if (
      (this.gepHistorySearchForm.get('docNumber').value ||
        (this.gepHistorySearchForm.get('fromNetAmount').value &&
          this.gepHistorySearchForm.get('toNetAmount').value)) &&
      !this.gepHistorySearchForm.get('fiscalYear').value
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage4');
    } else if (
      this.gepHistorySearchForm.get('fromNetAmount').value &&
      this.gepHistorySearchForm.get('toNetAmount').value &&
      Number(this.gepHistorySearchForm.get('fromNetAmount').value) >
        Number(this.gepHistorySearchForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage5');
    } else if (
      this.gepHistorySearchForm.get('fromNetAmount').value &&
      this.gepHistorySearchForm.get('toNetAmount').value &&
      Number(this.gepHistorySearchForm.get('fromNetAmount').value) ===
        Number(this.gepHistorySearchForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification('pw.gepHistory.alertMessage6');
    } else {
      const status = this.gepHistorySearchForm.get('status').value;
      const searchField = this.gepHistorySearchForm.get('searchField').value;
      const searchType = this.gepHistorySearchForm.get('searchType').value;
      const historySearchParamDetails: HistorySearchParamDetails = {
        fiscalYear: this.gepHistorySearchForm.get('fiscalYear').value,
        docNo: this.gepHistorySearchForm.get('docNumber').value,
        cnDocNo: this.gepHistorySearchForm.get('cnDocNo').value,
        startDate: this.gepHistorySearchForm.get('startDate').value,
        endDate: this.gepHistorySearchForm.get('endDate').value,
        toValue: this.gepHistorySearchForm.get('toNetAmount').value,
        fromValue: this.gepHistorySearchForm.get('fromNetAmount').value,
        searchField: this.gepHistorySearchForm.get('searchField').value,
        searchType: this.gepHistorySearchForm.get('searchType').value,
        status: this.gepHistorySearchForm.get('status').value,
        tepType: this.gepHistorySearchForm.get('subTxnType').value
      };
      this.gepFacade.setHistorySearchParamDetails(historySearchParamDetails);
      let requestPayload: AdvanceHistoryItemsRequestPayload = {
        docNo: this.gepHistorySearchForm.get('docNumber').value
          ? this.gepHistorySearchForm.get('docNumber').value
          : null,
        refDocNo: this.gepHistorySearchForm.get('cnDocNo').value
          ? this.gepHistorySearchForm.get('cnDocNo').value
          : null,
        fiscalYear: this.gepHistorySearchForm.get('fiscalYear').value
          ? this.gepHistorySearchForm.get('fiscalYear').value
          : null,
        toNetAmount: this.gepHistorySearchForm.get('toNetAmount').value
          ? Number(this.gepHistorySearchForm.get('toNetAmount').value)
          : null,
        fromNetAmount: this.gepHistorySearchForm.get('fromNetAmount').value
          ? Number(this.gepHistorySearchForm.get('fromNetAmount').value)
          : null
      };
      if (
        this.gepHistorySearchForm.get('startDate').value &&
        this.gepHistorySearchForm.get('endDate').value
      ) {

        const docStartDate = this.gepHistorySearchForm.get('startDate')?.value.startOf('days').add(this.utcOffset, 'm').valueOf()
        const docEndDate = this.gepHistorySearchForm.get('endDate')?.value.endOf('days').add(this.utcOffset, 'm').valueOf()
        requestPayload = {
          ...requestPayload,
          toDocDate: docEndDate,
          fromDocDate: docStartDate
        };
      }
      this.gepFacade.loadAdvanceHistory(
        requestPayload,
        searchField,
        searchType,
        status,
        pageEvent.pageIndex,
        pageEvent.pageSize,
        'GEP',
        this.gepHistorySearchForm.get('subTxnType').value
      );
    }
  }

  searchPaginatedHistory(event: PageEvent) {
    this.historyPageEvent = event;
    this.searchAdvanceHistoryItem(event);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.gepFacade.resetGep();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
