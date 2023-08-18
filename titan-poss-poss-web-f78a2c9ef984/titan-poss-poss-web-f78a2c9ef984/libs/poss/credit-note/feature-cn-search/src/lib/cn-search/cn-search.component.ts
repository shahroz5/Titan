import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditNoteFacade } from '@poss-web/poss/credit-note/data-access-cn';
import {
  CNSearchEnum,
  CreditNoteAPITypes,
  CreditNoteSearch,
  CreditNoteSearchResult,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SalesMenuKeyEnum,
  SentRequestResponse,
  SharedBodEodFeatureServiceAbstraction,
  TransferedCNS
} from '@poss-web/shared/models';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import {
  getCreditNoteDetailsUrl,
  getCreditNoteEGHSDetailsUrl,
  getCreditNoteUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { PageEvent } from '@angular/material/paginator';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-cn-search',
  templateUrl: './cn-search.component.html'
})
export class CNSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  CNSearchEnumRef = CNSearchEnum;
  tabType = CNSearchEnum.CN_ACTIVITY;
  sentRequestFormGroup: FormGroup;
  creditNoteSearchResult: CreditNoteSearchResult[];
  searchTransferedCN$: Observable<CreditNoteSearchResult[]>;
  destroy$ = new Subject<null>();
  dateFormat: string;
  sentRequests: SentRequestResponse[] = [];
  sentRequests$: Observable<SentRequestResponse[]>;
  searchRequests$: Observable<SentRequestResponse[]>;
  count: number;
  transferedCNsCount: number;

  statusColor: string;
  fiscalYear = null;
  docNo = null;
  pageSize = 4;
  initalPageSize = 8;
  workFlowType = CreditNoteAPITypes.CREDIT_NOTE_GOLD_RATE_REMOVE;
  isLoading$: Observable<boolean>;
  isApprovalsLoadedOnce = false;
  requestTypes: { value: string; description: string }[] = [
    {
      value: CreditNoteAPITypes.CREDIT_NOTE_GOLD_RATE_REMOVE,
      description: 'CN Gold Rate Remove'
    },
    {
      value: CreditNoteAPITypes.CREDIT_NOTE_CANCELLATION,
      description: 'CN Cancellation'
    },
    {
      value: CreditNoteAPITypes.CREDIT_NOTE_ACTIVATE,
      description: 'CN Activate'
    }
  ];
  invalidSearch = false;
  hasSearched$: Observable<boolean>;
  totalElements$: Observable<number>;
  requestType: string;
  transferedCNs: TransferedCNS[];
  transferedCNs$: Observable<TransferedCNS[]>;

  @ViewChild('searchBox', { static: true })
  private searchBox: ElementRef;

  @ViewChild('fiscalYearSearchBox', { static: true })
  private fiscalYearSearchBox: ElementRef;

  transferEGHSFormGroup: FormGroup;
  searchPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  currentFiscalYear: string;
  noDataFoundMessage: string;
  searchData = null;
  eghsSearchErrorcode: string;
  businessDay = moment();
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private creditNoteFacade: CreditNoteFacade,
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.creditNoteEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.creditNoteEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    if (
      !(
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state?.clearFilter === false
      )
    ) {
      this.creditNoteFacade.resetListPage();
    }
  }

  ngOnInit(): void {
    this.creditNoteFacade.resetError();
    this.bodeodFacade.loadLatestBusinessDay();
    this.loadRequests(0);
    this.loadTransferedCNs();
    this.requestType = CNSearchEnum.REMOVE_GOLD_RATE;

    this.createForm();

    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
          this.fiscalYear = fiscalYear;
          this.sentRequestFormGroup.patchValue(
            this.searchData
              ? { fiscalYear: this.searchData?.fiscalYear }
              : { fiscalYear: fiscalYear }
          );
        }
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
    this.creditNoteFacade
      .getRequestType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requestType: string) => {
        if (requestType !== undefined && requestType) {
          this.requestType = requestType;
        }
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

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.searchPageEvent.pageSize = pageSize;
      });
    const fromPath = this.route.pathFromRoot[2];
    this.tabType = fromPath.snapshot.params['_tabType'];

    if (this.tabType === CNSearchEnum.SENT_REQUESTS) {
      switch (this.requestType) {
        case CNSearchEnum.ACTIVATE_CN:
          this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_ACTIVATE;
          break;
        case CNSearchEnum.REMOVE_GOLD_RATE:
          this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_GOLD_RATE_REMOVE;
          break;
        case CNSearchEnum.CANCEL_CN:
          this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_CANCELLATION;
          break;
      }
      this.loadRequestsData(this.workFlowType);
    } else if (this.tabType === CNSearchEnum.EGHS_TRANSFER) {
      this.loadTransferedCNs();
    }

    this.isLoading$ = this.creditNoteFacade.getIsLoading();
    this.hasSearched$ = this.creditNoteFacade.getHasSearched();
    this.transferedCNs$ = this.creditNoteFacade.getTransfteredCNs();
    this.searchTransferedCN$ = this.creditNoteFacade.getTransferedCN();
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        if (dateFormat) {
          this.dateFormat = dateFormat;
        }
      });
    this.creditNoteFacade
      .getTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalCount: number) => {
        this.count = totalCount;
      });
    this.sentRequests$ = this.creditNoteFacade.getSentRequests();
    this.creditNoteFacade
      .getSentRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sentRequestResponse: SentRequestResponse[]) => {
        if (
          sentRequestResponse &&
          sentRequestResponse.length !== 0 &&
          !this.isApprovalsLoadedOnce
        ) {
          this.sentRequests = sentRequestResponse;
          this.isApprovalsLoadedOnce = true;
        }
      });
    this.searchRequests$ = this.creditNoteFacade.getSearchRequests();
    this.totalElements$ = this.creditNoteFacade.getTotalElements();

    this.creditNoteFacade
      .getSearch()
      .pipe(takeUntil(this.destroy$))
      .subscribe((search: CreditNoteSearch) => {
        if (search) {
          if (this.tabType === CNSearchEnum.CN_ACTIVITY) {
            this.searchData = search;
          }
        }
      });
    this.creditNoteFacade
      .getCreditNoteSearchResult()
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchResult: CreditNoteSearchResult[]) => {
        if (searchResult) {
          this.creditNoteSearchResult = searchResult;
        }
      });

    this.creditNoteFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.eghsSearchErrorcode = error.code;
          if (error.code !== 'ERR-INT-041') {
            this.errorHandler(error);
          }
        }
      });

    this.creditNoteFacade
      .getTransfteredCNs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((transferedCNs: TransferedCNS[]) => {
        if (transferedCNs && transferedCNs.length !== 0) {
          this.transferedCNs = transferedCNs;
        }
      });

    this.creditNoteFacade
      .getTransferedCNsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.transferedCNsCount = count;
      });
    if (this.searchData.mobileNumber || this.searchData.cnNumber) {
      this.search(this.searchData);
    }
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.sentRequestFormGroup.get('cnNumber').value;
        if (searchValue) {
          this.searchCNNumber(searchValue);
        } else {
          this.clearSearch();
        }
      });

    fromEvent(this.fiscalYearSearchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.sentRequestFormGroup.get('fiscalYear').value;
        if (searchValue) {
          this.searchFiscalYear(searchValue);
        } else {
          this.clearFiscalYearSearch();
        }
      });
  }
  loadRequestsData(workFlowType) {
    this.sentRequestFormGroup.patchValue({ requestType: workFlowType });
    this.creditNoteFacade.resetRequests();
    this.isApprovalsLoadedOnce = false;
    this.loadRequests(0);
  }

  paginate($event) {
    this.searchPageEvent = $event.paginator;
    this.creditNoteFacade.loadSearchResult({
      cnNumber: $event.searchFormGroup.get('cnNumber').value,
      mobileNumber: $event.searchFormGroup.get('mobileNumber').value,
      fiscalYear: $event.searchFormGroup.get('fiscalYear').value,
      startDate:
        $event.searchFormGroup.get('startDate').value !== null
          ? $event.searchFormGroup.get('startDate').value.valueOf()
          : null,
      endDate:
        $event.searchFormGroup.get('endDate').value !== null
          ? $event.searchFormGroup.get('endDate').value.valueOf()
          : null,
      isUnipayCN: $event.searchFormGroup.get('isUnipayCN').value,
      pageIndex: this.searchPageEvent.pageIndex,
      pageSize: this.searchPageEvent.pageSize
    });
  }
  searchCNNumber(searchValue) {
    if (fieldValidation.requestNumberField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.docNo = searchValue;
      this.creditNoteFacade.searchRequest({
        workFlowType: this.workFlowType,
        pageIndex: null,
        pageSize: null,
        payload: {
          dateRangeType: 'ALL',
          docNo: this.docNo,
          fiscalYear: this.fiscalYear
        }
      });
    } else {
      this.invalidSearch = true;
    }
  }
  searchFiscalYear(searchValue) {
    if (fieldValidation.fiscalYearField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.fiscalYear = searchValue;
      this.creditNoteFacade.searchRequest({
        workFlowType: this.workFlowType,
        pageIndex: null,
        pageSize: null,
        payload: {
          dateRangeType: 'ALL',
          docNo: this.docNo,
          fiscalYear: this.fiscalYear
        }
      });
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.sentRequestFormGroup.get('cnNumber').reset();
    this.docNo = null;
    this.isApprovalsLoadedOnce = false;
    this.loadRequests(0);
  }
  clearFiscalYearSearch() {
    this.invalidSearch = false;
    this.sentRequestFormGroup.get('fiscalYear').reset();
    this.fiscalYear = null;
    this.isApprovalsLoadedOnce = false;
    this.loadRequests(0);
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

  createForm() {
    this.sentRequestFormGroup = new FormGroup({
      cnNumber: new FormControl('', [
        this.fieldValidatorsService.numbersField('CN Number')
      ]),
      fiscalYear: new FormControl(this.currentFiscalYear, [
        this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
        this.fieldValidatorsService.max(
          Number(this.currentFiscalYear),
          'Fiscal Year'
        )
      ]),
      requestType: new FormControl(this.workFlowType)
    });
  }

  loadRequests(pageIndex) {
    this.creditNoteFacade.loadSentRequest({
      workFlowType: this.workFlowType,
      pageIndex: pageIndex,
      pageSize: this.isApprovalsLoadedOnce
        ? this.pageSize
        : this.initalPageSize,
      payload: {
        dateRangeType: 'ALL',
        docNo: this.docNo,
        fiscalYear: this.fiscalYear
      }
    });
  }
  loadTransferedCNs() {
    this.creditNoteFacade.loadTransferedCNs();
  }
  search(searchResponse) {
    this.searchPageEvent.pageIndex = 0;
    this.searchPageEvent.pageSize = 10;
    this.creditNoteFacade.loadSearchResult({
      cnNumber: searchResponse.cnNumber,
      mobileNumber: searchResponse.mobileNumber,
      fiscalYear: searchResponse.fiscalYear,
      startDate: searchResponse.startDate,
      endDate: searchResponse.endDate,
      isUnipayCN: searchResponse.isUnipayCN,
      pageIndex: 0,
      pageSize: 10
    });
    this.creditNoteFacade.storeSearch({
      cnNumber: searchResponse.cnNumber,
      mobileNumber: searchResponse.mobileNumber,
      fiscalYear: searchResponse.fiscalYear,
      startDate: searchResponse.startDate,
      endDate: searchResponse.endDate,
      isUnipayCN: searchResponse.isUnipayCN
    });
  }

  onSelected($event) {
    if (this.tabType === CNSearchEnum.SENT_REQUESTS) {
      this.router.navigate([
        getCreditNoteDetailsUrl(
          this.tabType,
          this.requestType,
          $event.processId
        )
      ]);
    } else if (this.tabType === CNSearchEnum.EGHS_TRANSFER) {
      this.router.navigate([
        getCreditNoteEGHSDetailsUrl(
          this.tabType,
          'ghs',
          $event.docNo,
          $event.fiscalYear,
          $event.ghsDocNo
        )
      ]);
    }
  }
  back() {
    this.creditNoteFacade.resetListPage();
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CREDIT_NOTE
      }
    });
  }
  cnDetails($event) {
    this.router.navigate([
      getCreditNoteDetailsUrl(this.tabType, $event.type, $event.id)
    ]);
  }

  getStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  selectionChange(workFlowType) {
    this.workFlowType = workFlowType;
    // Below is to assign workflow type, based on selected Request Type
    switch (workFlowType) {
      case CreditNoteAPITypes.CREDIT_NOTE_GOLD_RATE_REMOVE:
        this.requestType = CNSearchEnum.REMOVE_GOLD_RATE;
        break;
      case CreditNoteAPITypes.CREDIT_NOTE_ACTIVATE:
        this.requestType = CNSearchEnum.ACTIVATE_CN;
        break;
      case CreditNoteAPITypes.CREDIT_NOTE_CANCELLATION:
        this.requestType = CNSearchEnum.CANCEL_CN;
        break;
    }
    this.requestChange();
  }

  requestChange() {
    this.docNo = null;
    this.sentRequestFormGroup.patchValue({
      fiscalYear: this.currentFiscalYear
    });
    this.fiscalYear = this.currentFiscalYear;
    this.invalidSearch = false;
    this.sentRequestFormGroup.get('cnNumber').reset();
    this.creditNoteFacade.storeRequestType(this.requestType);
    this.isApprovalsLoadedOnce = false;
    this.creditNoteFacade.resetRequests();
    this.loadRequests(0);
  }
  tab(tabType) {
    this.invalidSearch = false;
    this.tabType = tabType;
    this.creditNoteFacade.resetSearch();

    if (this.tabType === CNSearchEnum.SENT_REQUESTS) {
      this.sentRequestFormGroup.get('cnNumber').reset();
      this.creditNoteFacade.storeRequestType(CNSearchEnum.REMOVE_GOLD_RATE);
      this.docNo = null;
      this.tabType = tabType;
    } else if (this.tabType === CNSearchEnum.EGHS_TRANSFER) {
      this.tabType = tabType;
    }
    this.router.navigate([getCreditNoteUrl(this.tabType)]);
    this.sentRequestFormGroup.patchValue({
      fiscalYear: this.currentFiscalYear
    });
  }

  onSearchChange() {
    this.creditNoteFacade.clearSearchList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
