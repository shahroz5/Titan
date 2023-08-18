import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GiftCardsFacade } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  CustomErrors,
  GiftCardsHistoryListItems,
  GiftCardsHistoryRequestPayload,
  GiftCardsHistorySearchByEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { getGiftCardsHistoryDetailsPage } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gift-cards-history',
  templateUrl: './gift-cards-history.component.html',
  styleUrls: ['./gift-cards-history.component.scss']
})
export class GiftCardsHistoryComponent implements OnInit {
  searchForm: FormGroup;
  searchTypes: SelectDropDownOption[] = [];
  countryFiscalYear: number;
  histroyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  noDataFoundMessageHistory: any;
  businessDate: moment.Moment;

  utcOffset = moment().startOf('day').utcOffset();
  selectedSortOrder = 'desc';

  docNumber: string;
  fiscalYear: string;
  mobileNo: string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;

  showSearchField: boolean;
  searchFieldPlaceholder: string;
  selectedFiscalYear: number;

  giftCardsHistoryItems$: Observable<GiftCardsHistoryListItems[]>;
  totalGiftCardsHistoryReq$: Observable<number>;

  isLoading$: Observable<boolean>;

  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[];
  pageIndex = 0;
  minPageSize = 0;

  searchValue: {
    docNo: number;
    fiscalYear: number;
    searchType: string;
    searchField: string;
    fromDocDate: any;
    toDocDate: any;
  };

  giftCardsHistoryRequestPayload: GiftCardsHistoryRequestPayload;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private appSettingFacade: AppsettingFacade,
    private customerFacade: CustomerFacade,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private giftCardsFacade: GiftCardsFacade,
    private router: Router
  ) {
    if (history.state && history.state.clearFilter !== false) {
      this.giftCardsFacade.resetHistory();
    }
  }

  ngOnInit(): void {
    this.customerFacade.clearSelectedCustomer();

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
          this.countryFiscalYear = fiscalYear;
        }
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });

    // Get History Items
    this.giftCardsHistoryItems$ = this.giftCardsFacade.getGiftCardsHistory();
    this.totalGiftCardsHistoryReq$ = this.giftCardsFacade.getGiftCardsHistoryTotalElements();
    this.isLoading$ = this.giftCardsFacade.getIsLoading();

    this.translate
      .get([
        'pw.giftCardsHistory.docNumber',
        'pw.giftCardsHistory.fiscalYear',
        'pw.giftCardsHistory.mobileNoOption',
        'pw.giftCardsHistory.panNoOption',
        'pw.giftCardsHistory.emailIdOption',
        'pw.giftCardsHistory.ulpIdOption',
        'pw.giftCardsHistory.gstNoOption'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.docNumber = translatedMessages['pw.giftCardsHistory.docNumber'];
        this.fiscalYear = translatedMessages['pw.giftCardsHistory.fiscalYear'];
        this.mobileNo =
          translatedMessages['pw.giftCardsHistory.mobileNoOption'];
        this.panNoOption =
          translatedMessages['pw.giftCardsHistory.panNoOption'];
        this.emailIdOption =
          translatedMessages['pw.giftCardsHistory.emailIdOption'];
        this.ulpIdOption =
          translatedMessages['pw.giftCardsHistory.ulpIdOption'];
        this.gstNoOption =
          translatedMessages['pw.giftCardsHistory.gstNoOption'];

        this.searchForm = new FormGroup({
          docNumber: new FormControl(null, [
            this.fieldValidatorsService.numbersField(this.docNumber)
          ]),
          fiscalYear: new FormControl(this.countryFiscalYear),
          fromDocDate: new FormControl(null),
          toDocDate: new FormControl(null),
          searchType: new FormControl(null),
          searchField: new FormControl(null),
          subTxnType: new FormControl(SubTransactionTypeEnum.GIFT_SALE)
        });

        this.searchTypes = [
          {
            value: GiftCardsHistorySearchByEnum.MOBILE_NO,
            description:
              translatedMessages['pw.giftCardsHistory.mobileNoOption']
          },
          {
            value: GiftCardsHistorySearchByEnum.PAN_NO,
            description: translatedMessages['pw.giftCardsHistory.panNoOption']
          },
          {
            value: GiftCardsHistorySearchByEnum.EMAIL_ID,
            description: translatedMessages['pw.giftCardsHistory.emailIdOption']
          },
          {
            value: GiftCardsHistorySearchByEnum.ULP_ID,
            description: translatedMessages['pw.giftCardsHistory.ulpIdOption']
          },
          {
            value: GiftCardsHistorySearchByEnum.GST_NO,
            description: translatedMessages['pw.giftCardsHistory.gstNoOption']
          }
        ];
      });

    this.giftCardsFacade
      .getHistorySearchParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchParameter: GiftCardsHistoryRequestPayload) => {
        this.giftCardsHistoryRequestPayload = searchParameter;
        if (searchParameter) {
          this.selectedFiscalYear = searchParameter?.filterOptions?.fiscalYear;
          this.searchValue = {
            docNo: searchParameter?.filterOptions?.docNo,
            fiscalYear: searchParameter?.filterOptions?.fiscalYear,
            fromDocDate: searchParameter?.filterOptions?.fromDocDate,
            toDocDate: searchParameter?.filterOptions?.toDocDate,
            searchType: searchParameter?.filterOptions?.searchType,
            searchField: searchParameter?.filterOptions?.searchField
          };
          if (searchParameter.filterOptions.searchField !== null) {
            this.showSearchField = true;
            this.setSearchTypeLabel({
              value: searchParameter.filterOptions.searchType
            });
          }

          this.searchForm
            .get('docNumber')
            .setValue(searchParameter.filterOptions.docNo);
          this.searchForm
            .get('fiscalYear')
            .patchValue(searchParameter.filterOptions.fiscalYear);

          this.searchForm
            .get('fromDocDate')
            .patchValue(
              searchParameter.filterOptions.fromDocDate
                ? moment(searchParameter.filterOptions.fromDocDate)
                : null
            );
          this.searchForm
            .get('toDocDate')
            .patchValue(
              searchParameter.filterOptions.toDocDate
                ? moment(searchParameter.filterOptions.toDocDate)
                : null
            );
          this.searchForm
            .get('subTxnType')
            .patchValue(searchParameter.subTxnType);

          this.searchForm
            .get('searchType')
            .patchValue(searchParameter.filterOptions.searchType);
          this.searchForm
            .get('searchField')
            .patchValue(searchParameter.filterOptions.searchField);
          // this.searchHistory();
        }
      });

    this.giftCardsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.searchForm
      .get('fromDocDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.searchForm.get('toDocDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
    if (this.giftCardsHistoryRequestPayload) {
      this.giftCardsFacade.loadGiftCardsHistoryListItems(
        this.giftCardsHistoryRequestPayload
      );
    }
  }

  onSearchTypeChanged(event: any) {
    this.searchForm.get('searchField').reset();
    if (event) {
      if (event.value) {
        this.showSearchField = true;
      } else {
        this.showSearchField = false;
        this.searchForm.get('searchField').setValidators([]);
      }
      this.setSearchTypeLabel(event);
    }
  }

  setSearchTypeLabel(event) {
    switch (event.value) {
      case GiftCardsHistorySearchByEnum.MOBILE_NO:
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.mobileField(this.mobileNo),
            this.fieldValidatorsService.requiredField(this.mobileNo)
          ]);
        this.searchFieldPlaceholder = this.mobileNo;
        break;
      case GiftCardsHistorySearchByEnum.PAN_NO:
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.pancardField(this.panNoOption),
            this.fieldValidatorsService.requiredField(this.panNoOption)
          ]);
        this.searchFieldPlaceholder = this.panNoOption;
        break;
      case GiftCardsHistorySearchByEnum.EMAIL_ID:
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.emailField(this.emailIdOption),
            this.fieldValidatorsService.requiredField(this.emailIdOption)
          ]);
        this.searchFieldPlaceholder = this.emailIdOption;
        break;
      case GiftCardsHistorySearchByEnum.ULP_ID:
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.ulpIdField(this.ulpIdOption),
            this.fieldValidatorsService.requiredField(this.ulpIdOption)
          ]);
        this.searchFieldPlaceholder = this.ulpIdOption;
        break;
      case GiftCardsHistorySearchByEnum.GST_NO:
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.gstNumberField(this.gstNoOption),
            this.fieldValidatorsService.requiredField(this.gstNoOption)
          ]);
        this.searchFieldPlaceholder = this.gstNoOption;
        break;
    }
    this.searchForm.get('searchField').updateValueAndValidity();
  }

  searchHistory() {
    this.countryFiscalYear = this.searchForm.get('fiscalYear')?.value
      ? this.searchForm.get('fiscalYear')?.value
      : null;

    const searchValue = {
      docNo: this.searchForm.get('docNumber')?.value
        ? this.searchForm.get('docNumber')?.value
        : null,
      fiscalYear: this.searchForm.get('fiscalYear')?.value
        ? this.searchForm.get('fiscalYear')?.value
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
      searchValue.fromDocDate === null &&
      searchValue.toDocDate === null &&
      searchValue.searchField === null &&
      searchValue.searchType === null
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage1');
    } else if (searchValue.docNo !== null && searchValue.fiscalYear === null) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage4');
    } else {
      let giftCardsHistoryRequestPayload: GiftCardsHistoryRequestPayload;
      giftCardsHistoryRequestPayload = {
        ...giftCardsHistoryRequestPayload,
        page: this.histroyPageEvent.pageIndex,
        size: this.histroyPageEvent.pageSize,
        sort: this.selectedSortOrder,
        subTxnType: this.searchForm.get('subTxnType').value,
        txnType: TransactionTypeEnum.CM,
        filterOptions: searchValue
      };

      this.searchValue = searchValue;
      this.giftCardsHistoryRequestPayload = giftCardsHistoryRequestPayload;
      this.giftCardsFacade.updatetHistorySearchParameter(
        this.giftCardsHistoryRequestPayload
      );
      this.giftCardsFacade.loadGiftCardsHistoryListItems(
        this.giftCardsHistoryRequestPayload
      );
    }
  }

  searchPaginatedHistory(pageEvent: PageEvent) {
    this.histroyPageEvent = pageEvent;
    this.giftCardsHistoryRequestPayload = {
      ...this.giftCardsHistoryRequestPayload,
      subTxnType: this.searchForm.get('subTxnType').value,
      txnType: TransactionTypeEnum.CM,
      sort: this.selectedSortOrder,
      page: this.histroyPageEvent.pageIndex,
      size: this.histroyPageEvent.pageSize
    };

    this.giftCardsFacade.loadGiftCardsHistoryListItems(
      this.giftCardsHistoryRequestPayload
    );
  }

  getSelectedHistoryItem(id) {
    if (id) {
      this.router.navigate([getGiftCardsHistoryDetailsPage(id)]);
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
  sortOrder(event) {
    this.selectedSortOrder = event?.sort?.toLowerCase();
    let giftCardsHistoryRequestPayload: GiftCardsHistoryRequestPayload;
    giftCardsHistoryRequestPayload = {
      ...giftCardsHistoryRequestPayload,
      page: this.histroyPageEvent.pageIndex,
      size: this.histroyPageEvent.pageSize,
      subTxnType: this.searchForm.get('subTxnType').value,
      sort: event !== null ? event.sort.toLowerCase() : 'desc',
      txnType: TransactionTypeEnum.CM,
      filterOptions: this.searchValue
    };
    this.giftCardsHistoryRequestPayload = giftCardsHistoryRequestPayload;
    this.giftCardsFacade.loadGiftCardsHistoryListItems(
      this.giftCardsHistoryRequestPayload
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
