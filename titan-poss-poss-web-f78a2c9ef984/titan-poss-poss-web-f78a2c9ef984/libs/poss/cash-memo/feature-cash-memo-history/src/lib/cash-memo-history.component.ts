import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  CashMemoHistorySearchByEnum,
  SelectDropDownOption,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CashMemoHistoryRequestPayload,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  CashMemoHistoryDetails,
  CustomErrors,
  CashMemoRouteEnum,
  SharedBodEodFeatureServiceAbstraction,
  ShortcutServiceAbstraction,
  Command
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { getCashMemoHistoryDetailsPage } from '@poss-web/shared/util-site-routes';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

const searchShortcutKey = 'CashMemoHistoryComponent.MAIN_SEARCH';

@Component({
  selector: 'poss-web-cash-memo-history',
  templateUrl: './cash-memo-history.component.html',
  styleUrls: ['./cash-memo-history.component.scss']
})
export class CashMemoHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  searchForm: FormGroup;
  mobileNo: string;
  fiscalYear: string;
  cmNumber: string;
  docNo: string;
  utcOffset = moment().startOf('day').utcOffset();
  searchTypes: SelectDropDownOption[] = [];
  showSearchField: boolean;
  searchFieldPlaceholder: string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;
  CustomerNameOption: string;
  cmLocationLabel: any;
  countryFiscalYear: number;
  searchValue: {
    docNo: any;
    fiscalYear: any;
    searchType: any;
    searchField: any;
    fromDocDate: any;
    toDocDate: any;
    fromNetAmount: any;
    toNetAmount: any;
  };
  histroyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[];
  cashMemoHistory$: Observable<CashMemoHistoryDetails[]>;
  totalCashMemoHistoryReq$: Observable<number>;
  cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload;
  isHistoryDetailsLoading$: Observable<boolean>;
  subTxnTypes: SelectDropDownOption[];
  noDataFoundMessageHistory: any;
  currentDate = moment();
  selectedSortOrder = 'desc';
  subTxnTypeLabel: string;
  businessDate: moment.Moment;
  selectedFiscalYear: number;
  @ViewChild('cmNumberInput')
  cmNumberInput: ElementRef;
  currentFiscalYear: string;
  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cashMemoFacade: CashMemoFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private router: Router,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction
  ) {
    if (history.state && history.state.clearFilter !== false) {
      this.cashMemoFacade.resetHistory();
    }
  }
  ngOnInit(): void {
    this.commonFacade.clearCashMemo();
    this.cashMemoFacade.resetValues();
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
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });
    this.cashMemoHistory$ = this.cashMemoFacade.getCashMemoHistory();
    this.totalCashMemoHistoryReq$ = this.cashMemoFacade.getCashMemoHistoryTotalElements();
    this.isHistoryDetailsLoading$ = this.cashMemoFacade.getIsHistoryDetailsLoading();
    this.translate
      .get([
        'pw.cashMemoHistory.cmNumber',
        'pw.cashMemoHistory.fiscalYear',
        'pw.cashMemoHistory.mobileNoOption',
        'pw.cashMemoHistory.ulpIdOption',
        'pw.cashMemoHistory.panNoOption',
        'pw.cashMemoHistory.gstNoOption',
        'pw.cashMemoHistory.passportIdOption',
        'pw.cashMemoHistory.emailIdOption',
        'pw.cashMemoHistory.CustomerNameOption',
        'pw.cashMemoHistory.newCm',
        'pw.cashMemoHistory.manualCm',
        'pw.cashMemoHistory.focCm'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fiscalYear = translatedMessages['pw.cashMemoHistory.fiscalYear'];
        this.cmNumber = translatedMessages['pw.cashMemoHistory.cmNumber'];
        this.mobileNo = translatedMessages['pw.cashMemoHistory.mobileNoOption'];
        this.panNoOption = translatedMessages['pw.cashMemoHistory.panNoOption'];
        this.emailIdOption =
          translatedMessages['pw.cashMemoHistory.emailIdOption'];
        this.ulpIdOption = translatedMessages['pw.cashMemoHistory.ulpIdOption'];
        this.gstNoOption = translatedMessages['pw.cashMemoHistory.gstNoOption'];
        this.CustomerNameOption = translatedMessages['pw.cashMemoHistory.CustomerNameOption'];

        this.searchForm = new FormGroup({
          cmNumber: new FormControl(null, [
            this.fieldValidatorsService.numbersField(this.cmNumber)
          ]),
          fiscalYear: new FormControl(this.countryFiscalYear),
          searchField: new FormControl(null),
          searchType: new FormControl(null),
          fromDocDate: new FormControl(null),
          toDocDate: new FormControl(null),

          fromNetAmount: new FormControl(null),
          toNetAmount: new FormControl(null),
          subTxnType: new FormControl(SubTransactionTypeEnum.NEW_CM)
        });
        this.subTxnTypes = [
          {
            value: SubTransactionTypeEnum.NEW_CM,
            description: translatedMessages['pw.cashMemoHistory.newCm']
          },
          {
            value: SubTransactionTypeEnum.MANUAL_CM,
            description: translatedMessages['pw.cashMemoHistory.manualCm']
          },
          {
            value: SubTransactionTypeEnum.FOC_CM,
            description: translatedMessages['pw.cashMemoHistory.focCm']
          }
        ];
        this.searchTypes = [
          {
            value: CashMemoHistorySearchByEnum.MOBILE_NO,
            description: translatedMessages['pw.cashMemoHistory.mobileNoOption']
          },
          {
            value: CashMemoHistorySearchByEnum.PAN_NO,
            description: translatedMessages['pw.cashMemoHistory.panNoOption']
          },
          {
            value: CashMemoHistorySearchByEnum.EMAIL_ID,
            description: translatedMessages['pw.cashMemoHistory.emailIdOption']
          },
          {
            value: CashMemoHistorySearchByEnum.ULP_ID,
            description: translatedMessages['pw.cashMemoHistory.ulpIdOption']
          },
          {
            value: CashMemoHistorySearchByEnum.GST_NO,
            description: translatedMessages['pw.cashMemoHistory.gstNoOption']
          },
          {
            value: CashMemoHistorySearchByEnum.CUSTOMER_NAME,
            description: translatedMessages['pw.cashMemoHistory.CustomerNameOption']
          }
        ];
      });

    this.cashMemoFacade
      .getHistorySearchParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchParameter => {
        this.cashMemoHistoryRequestPayload = searchParameter;
        if (searchParameter) {
          this.selectedFiscalYear = searchParameter.filterOptions.fiscalYear;
          if (searchParameter.filterOptions.searchField !== null) {
            this.showSearchField = true;
            this.setSearchTypeLabel({
              value: searchParameter.filterOptions.searchType
            });
          }

          this.searchForm
            .get('cmNumber')
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
            .get('fromNetAmount')
            .patchValue(searchParameter.filterOptions.fromNetAmount);
          this.searchForm
            .get('toNetAmount')
            .patchValue(searchParameter.filterOptions.toNetAmount);
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
    this.cashMemoFacade
      .getHasError()
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
    if (this.cashMemoHistoryRequestPayload) {
      this.cashMemoFacade.loadCashMemoHistory(
        this.cashMemoHistoryRequestPayload
      );
    }

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
        this.shortcutEventHandler(command);
      });
  }

  ngAfterViewInit() {
    if (this.cmNumberInput) {
      this.cmNumberInput.nativeElement.focus();
    }
  }

  onSubTxnTypeChanged(event) {
    this.searchForm.get('subTxnType').patchValue(event.value);
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
    if (event.value === CashMemoHistorySearchByEnum.MOBILE_NO) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.mobileField(this.mobileNo),
          this.fieldValidatorsService.requiredField(this.mobileNo)
        ]);
      this.searchFieldPlaceholder = this.mobileNo;
    } else if (event.value === CashMemoHistorySearchByEnum.PAN_NO) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.pancardField(this.panNoOption),
          this.fieldValidatorsService.requiredField(this.panNoOption)
        ]);
      this.searchFieldPlaceholder = this.panNoOption;
    } else if (event.value === CashMemoHistorySearchByEnum.EMAIL_ID) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.emailField(this.emailIdOption),
          this.fieldValidatorsService.requiredField(this.emailIdOption)
        ]);
      this.searchFieldPlaceholder = this.emailIdOption;
    } else if (event.value === CashMemoHistorySearchByEnum.ULP_ID) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.ulpIdField(this.ulpIdOption),
          this.fieldValidatorsService.ulpIdField(this.ulpIdOption)
        ]);
      this.searchFieldPlaceholder = this.ulpIdOption;
    } else if (event.value === CashMemoHistorySearchByEnum.GST_NO) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.gstNumberField(this.gstNoOption),
          this.fieldValidatorsService.requiredField(this.gstNoOption)
        ]);
      this.searchFieldPlaceholder = this.gstNoOption;
    } else if (event.value === CashMemoHistorySearchByEnum.CUSTOMER_NAME) {
      this.searchForm
        .get('searchField')
        .setValidators([
          this.fieldValidatorsService.customerNameField(this.CustomerNameOption),
          this.fieldValidatorsService.requiredField(this.CustomerNameOption)
        ]);
      this.searchFieldPlaceholder = this.CustomerNameOption;
    }
    this.searchForm.get('searchField').updateValueAndValidity();
  }

  searchHistory() {
    this.countryFiscalYear = this.searchForm.get('fiscalYear')?.value
      ? this.searchForm.get('fiscalYear')?.value
      : null;
    const searchValue = {
      docNo: this.searchForm.get('cmNumber')?.value
        ? this.searchForm.get('cmNumber')?.value
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
        : null,
      fromNetAmount: this.searchForm.get('fromNetAmount')?.value
        ? this.searchForm.get('fromNetAmount')?.value?.toUpperCase()
        : null,
      toNetAmount: this.searchForm.get('toNetAmount')?.value
        ? this.searchForm.get('toNetAmount')?.value
        : null
    };

    if (
      searchValue.fromNetAmount === null &&
      searchValue.docNo === null &&
      searchValue.fiscalYear === null &&
      searchValue.fromDocDate === null &&
      searchValue.toDocDate === null &&
      searchValue.toNetAmount === null &&
      searchValue.searchField === null &&
      searchValue.searchType === null
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage1');
    } else if (
      searchValue.fromNetAmount !== null &&
      searchValue.toNetAmount === null
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage2');
    } else if (
      searchValue.fromNetAmount === null &&
      searchValue.toNetAmount !== null
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage3');
    } else if (
      (searchValue.docNo !== null ||
        (searchValue.toNetAmount !== null &&
          searchValue.fromNetAmount !== null)) &&
      searchValue.fiscalYear === null
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage4');
    } else if (
      searchValue.fromNetAmount !== null &&
      searchValue.toNetAmount !== null &&
      Number(searchValue.fromNetAmount) > Number(searchValue.toNetAmount)
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage5');
    } else if (
      searchValue.fromNetAmount !== null &&
      searchValue.toNetAmount !== null &&
      Number(searchValue.fromNetAmount) === Number(searchValue.toNetAmount)
    ) {
      this.showAlertNotification('pw.cashMemoHistory.alertMessage6');
    } else {
      let cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload;
      cashMemoHistoryRequestPayload = {
        ...cashMemoHistoryRequestPayload,
        page: this.histroyPageEvent.pageIndex,
        size: this.histroyPageEvent.pageSize,
        sort: this.selectedSortOrder,
        subTxnType: this.searchForm.get('subTxnType').value,
        txnType: TransactionTypeEnum.CM,
        filterOptions: searchValue
      };

      this.searchValue = searchValue;
      this.cashMemoHistoryRequestPayload = cashMemoHistoryRequestPayload;
      this.cashMemoFacade.updatetHistorySearchParameter(
        this.cashMemoHistoryRequestPayload
      );
      this.cashMemoFacade.loadCashMemoHistory(cashMemoHistoryRequestPayload);
    }
  }
  searchPaginatedHistory(pageEvent: PageEvent) {
    this.histroyPageEvent = pageEvent;
    this.cashMemoHistoryRequestPayload = {
      ...this.cashMemoHistoryRequestPayload,
      subTxnType: this.searchForm.get('subTxnType').value,
      txnType: TransactionTypeEnum.CM,
      sort: this.selectedSortOrder,
      page: this.histroyPageEvent.pageIndex,
      size: this.histroyPageEvent.pageSize
    };

    this.cashMemoFacade.loadCashMemoHistory(this.cashMemoHistoryRequestPayload);
  }

  getSelectedHistoryItem(id) {
    if (id) {
      this.router.navigate([
        getCashMemoHistoryDetailsPage(
          this.searchForm.get('subTxnType').value ===
            SubTransactionTypeEnum.NEW_CM
            ? CashMemoRouteEnum.REGULAR
            : this.searchForm.get('subTxnType').value ===
            SubTransactionTypeEnum.MANUAL_CM ? CashMemoRouteEnum.MANUAL : CashMemoRouteEnum.FOC ,
          id
        )
      ]);
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
    this.selectedSortOrder = event.sort.toLowerCase();

    let cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload;
    cashMemoHistoryRequestPayload = {
      ...cashMemoHistoryRequestPayload,
      page: this.histroyPageEvent.pageIndex,
      size: this.histroyPageEvent.pageSize,
      subTxnType: this.searchForm.get('subTxnType').value,
      sort: event !== null ? event.sort.toLowerCase() : 'desc',
      txnType: TransactionTypeEnum.CM,
      filterOptions: this.searchValue
    };

    this.cashMemoHistoryRequestPayload = cashMemoHistoryRequestPayload;
    this.cashMemoFacade.loadCashMemoHistory(cashMemoHistoryRequestPayload);
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    if (command.name === searchShortcutKey) {
      if (this.cmNumberInput) {
        this.cmNumberInput.nativeElement.focus();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
