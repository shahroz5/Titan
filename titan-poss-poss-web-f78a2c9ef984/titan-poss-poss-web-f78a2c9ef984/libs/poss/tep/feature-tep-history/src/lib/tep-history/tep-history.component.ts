import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TEPRequestFacade } from '@poss-web/poss/tep/data-access-tep';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AdvanceHistoryItemsRequestPayload,
  AdvanceSearchTypesEnum,
  AdvanceStatusEnum,
  CreatedCustomerResponse,
  CreateTepTypesEnum,
  CustomErrors,
  HistorySearchParamDetails,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SharedBodEodFeatureServiceAbstraction,
  SortItem,
  SubTransactionTypeEnum,
  SummaryBarServiceAbstraction,
  TEPList,
  TEPSearchResponse,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { getCancelTepUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-history',
  templateUrl: './tep-history.component.html',
})
export class TepHistoryComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = of(false);
  TEPHistory: FormGroup;
  historyItems: TEPList[] = [];
  moment = moment;
  rsoNamesList: { value: string; description: string }[];
  clearSelectedRsoName = false;
  selectedRso: { value: string; description: string };
  selectedHistoryItem: any;
  selectedItemRemarks: string;
  selectedItemCustomerId: number;
  selectedItemCustomerDetails: CreatedCustomerResponse;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  grfHistoryItems$ = new Subject();
  grfHistoryItemsCount$ = new Subject();
  defaultSort: SortItem = { colId: 'salesTxn.docNo', sort: 'Desc' };
  defaultSortCutPiece: SortItem = { colId: 'docNo', sort: 'Desc' };
  isFilterApplied = false;
  selectedSortOrder = 'desc';
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[];
  pageIndex = 0;
  minPageSize = 0;
  configPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  searchField = '';
  searchType = '';
  status = '';
  statusOptions = [
    {
      value: AdvanceStatusEnum.ALL,
      description: AdvanceStatusEnum.ALL
    },
    {
      value: AdvanceStatusEnum.CONFIRMED,
      description: AdvanceStatusEnum.CONFIRMED
    },

    {
      value: AdvanceStatusEnum.CANCELLED,
      description: AdvanceStatusEnum.CANCELLED
    }
  ];

  searchTypes = [
    {
      value: AdvanceSearchTypesEnum.MOBILE_NO,
      description: 'Mobile Number'
    },
    {
      value: AdvanceSearchTypesEnum.PAN_NO,
      description: 'PAN Number'
    },
    {
      value: AdvanceSearchTypesEnum.EMAIL_ID,
      description: 'Email ID'
    },
    {
      value: AdvanceSearchTypesEnum.ULP_ID,
      description: 'ULP ID'
    },
    {
      value: AdvanceSearchTypesEnum.GST_NO,
      description: 'GST Number'
    }
  ];

  tepTypes = [
    {
      value: CreateTepTypesEnum.REGULAR_TEP,
      description: 'REGULAR TEP'
    },
    {
      value: CreateTepTypesEnum.CUT_PIECE_TEP,
      description: 'CUT PIECE TEP'
    },
    {
      value: CreateTepTypesEnum.INTER_BRAND_TEP,
      description: 'INTER BRAND TEP'
    },
    {
      value: CreateTepTypesEnum.FULL_VALUE_TEP,
      description: 'FULL VALUE TEP'
    },
    {
      value: CreateTepTypesEnum.MANUAL_TEP,
      description: 'MANUAL TEP'
    },
    {
      value: CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP,
      description: 'MANUAL FULL VALUE TEP'
    }
  ];
  showSearchField = false;
  searchFieldPlaceholder = '';
  noDataFoundMessageHistory = '';
  currentDate = moment();
  clearFilter: boolean;
  currentFiscalYear: string;
  data: any;
  currencyCode: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private appsetttingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private commonFacade: CommonFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private customerFacade: CustomerFacade,
    private paymentFacade: PaymentFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private tEPRequestFacade: TEPRequestFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.TEPHistory = new FormGroup({
      docNumber: new FormControl('', [
        this.fieldValidatorsService.requestNumberField('Doc No.')
      ]),
      cnDocNo: new FormControl('', [
        this.fieldValidatorsService.numbersField('CN Doc No.')
      ]),
      fiscalYear: new FormControl('', [
        this.fieldValidatorsService.fiscalYearField('Fiscal Year')
      ]),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      fromNetAmount: new FormControl(''),
      toNetAmount: new FormControl(''),
      status: new FormControl(
        AdvanceStatusEnum.ALL,
        this.fieldValidatorsService.remarkField('TEP Type')
      ),
      searchType: new FormControl(''),
      searchField: new FormControl(''),
      tepType: new FormControl(CreateTepTypesEnum.REGULAR_TEP)
    });
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;

      this.tEPRequestFacade.clearHistorySearchParamDetails();
    }
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });

    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (date) {
          this.currentDate = moment(date);
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

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.configPageEvent.pageSize = data;
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
    this.tEPRequestFacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: HistorySearchParamDetails) => {
        if (historySearchParams) {
          this.data = historySearchParams;
          this.TEPHistory.get('status').setValue(historySearchParams.status);
          this.TEPHistory.get('fiscalYear').setValue(
            historySearchParams.fiscalYear
          );

          this.TEPHistory.get('cnDocNo').setValue(historySearchParams.cnDocNo);
          this.TEPHistory.get('docNumber').setValue(historySearchParams.docNo);

          this.TEPHistory.get('fromNetAmount').setValue(
            historySearchParams.fromValue
          );
          this.TEPHistory.get('toNetAmount').setValue(
            historySearchParams.toValue
          );

          this.TEPHistory.get('startDate').setValue(
            historySearchParams.startDate
          );
          this.TEPHistory.get('endDate').setValue(historySearchParams.endDate);

          if (historySearchParams.searchType) {
            this.TEPHistory.get('searchType').setValue(
              historySearchParams.searchType
            );
            this.TEPHistory.get('searchField').setValue(
              historySearchParams.searchField
            );
            this.onSearchTypeChanged({
              value: historySearchParams.searchType
            });
          }

          this.TEPHistory.get('tepType').setValue(historySearchParams.tepType);
          this.TEPHistory.updateValueAndValidity();
        }
      });

    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.TEP,
      subTxnType: SubTransactionTypeEnum.NEW_TEP,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);

    this.tEPRequestFacade
      .getTEPHistoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historyResponse: TEPSearchResponse) => {
        if (historyResponse) {
          this.historyItems = historyResponse.TEPList;
          this.totalElements = historyResponse.totalElements;
        } else {
          this.historyItems = [];
          this.totalElements = 0;
        }
      });

    this.appsetttingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => (this.pageSize = resp));

    this.appsetttingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.pageSizeOptions = resp;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.isLoading$ = this.tEPRequestFacade.getIsLoading();
    this.tEPRequestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });

    this.customerFacade
      .getSelectedCustomerDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CreatedCustomerResponse) => {
        if (response) {
          this.selectedItemCustomerDetails = response;

          const mobileNumber = this.selectedItemCustomerDetails.mobileNumber;
          const ulpID = this.selectedItemCustomerDetails.ulpId;
          const address = this.selectedItemCustomerDetails.customerDetails.data
            .fullAddress;
          const customerId = this.selectedItemCustomerDetails.customerId;
          const name =
            this.selectedItemCustomerDetails.title +
            '.' +
            this.selectedItemCustomerDetails.customerName;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    // if (this.TEPHistory.get('status').value) {
    //   this.searchAdvanceHistoryItem(0, 10);
    // }

    this.TEPHistory.get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.TEPHistory.get('endDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  sort(sortItem: SortItem) {
    if (sortItem) {
      this.defaultSort = { colId: 'salesTxn.docNo', sort: sortItem.sort };
    } else {
      this.defaultSort = { colId: 'salesTxn.docNo', sort: 'Desc' };
    }
    this.searchAdvanceHistoryItem(this.configPageEvent.pageIndex);
  }

  onSearchTypeChanged(event: any, search?: boolean) {
    if (event) {
      if (event.value) {
        this.showSearchField = true;
      } else {
        this.showSearchField = false;
        this.TEPHistory.get('searchField').setValidators([]);
      }
      if (event.value === AdvanceSearchTypesEnum.MOBILE_NO) {
        this.TEPHistory.get('searchField').setValidators([
          this.fieldValidatorsService.mobileField('Mobile Number'),
          this.fieldValidatorsService.requiredField('Mobile Number')
        ]);
        this.searchFieldPlaceholder =
          'pw.acceptAdvance.mobileNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.PAN_NO) {
        this.TEPHistory.get('searchField').setValidators([
          this.fieldValidatorsService.pancardField('PAN Number'),
          this.fieldValidatorsService.requiredField('PAN Number')
        ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.panNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.EMAIL_ID) {
        this.TEPHistory.get('searchField').setValidators([
          this.fieldValidatorsService.emailField('Email ID'),
          this.fieldValidatorsService.requiredField('Email ID')
        ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.emailIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.ULP_ID) {
        this.TEPHistory.get('searchField').setValidators([
          this.fieldValidatorsService.ulpIdField('Ulp ID'),
          this.fieldValidatorsService.ulpIdField('Ulp ID')
        ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.ulpIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.GST_NO) {
        this.TEPHistory.get('searchField').setValidators([
          this.fieldValidatorsService.gstNumberField('Gst Number'),
          this.fieldValidatorsService.requiredField('Gst Number')
        ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.gstNumberPlaceholder';
      }
      this.TEPHistory.get('searchField').updateValueAndValidity();
    }
  }

  onStatusChanged(event: any) {
    this.tEPRequestFacade.clearSearchList();
  }

  onSelected(event) {
    this.router.navigate([
      getCancelTepUrl(event.refTxnId, 'history', event.subTxnType.toLowerCase())
    ]);
  }

  searchAdvanceHistoryItem(page, reset?) {
    if (
      !this.TEPHistory.get('docNumber').value &&
      !this.TEPHistory.get('cnDocNo').value &&
      !this.TEPHistory.get('fiscalYear').value &&
      !this.TEPHistory.get('toNetAmount').value &&
      !this.TEPHistory.get('fromNetAmount').value &&
      !this.TEPHistory.get('startDate').value &&
      !this.TEPHistory.get('endDate').value &&
      !this.TEPHistory.get('searchField').value &&
      !this.TEPHistory.get('searchType').value &&
      !this.TEPHistory.get('status').value
    ) {
      this.showAlertNotification(
        'Search criteria is required. Please add one or more search parameters.'
      );
    } else if (
      this.TEPHistory.get('fromNetAmount').value &&
      !this.TEPHistory.get('toNetAmount').value
    ) {
      this.showAlertNotification('To Net Amount is required.');
    } else if (
      !this.TEPHistory.get('fromNetAmount').value &&
      this.TEPHistory.get('toNetAmount').value
    ) {
      this.showAlertNotification('From Net Amount is required.');
    } else if (
      (this.TEPHistory.get('docNumber').value ||
        (this.TEPHistory.get('fromNetAmount').value &&
          this.TEPHistory.get('toNetAmount').value)) &&
      !this.TEPHistory.get('fiscalYear').value
    ) {
      this.showAlertNotification('Please enter Fiscal Year and proceed.');
    } else if (
      this.TEPHistory.get('fromNetAmount').value &&
      this.TEPHistory.get('toNetAmount').value &&
      Number(this.TEPHistory.get('fromNetAmount').value) >
        Number(this.TEPHistory.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount should be lesser than To Net Amount.'
      );
    } else if (
      this.TEPHistory.get('fromNetAmount').value &&
      this.TEPHistory.get('toNetAmount').value &&
      Number(this.TEPHistory.get('fromNetAmount').value) ===
        Number(this.TEPHistory.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount and To Net Amount should not be same.'
      );
    } else {
      if (reset) {
        this.configPageEvent.pageIndex = 0;
      }
      const status = this.TEPHistory.get('status').value;
      const searchField = this.TEPHistory.get('searchField').value;
      const searchType = this.TEPHistory.get('searchType').value;
      const historySearchParamDetails: HistorySearchParamDetails = {
        fiscalYear: this.TEPHistory.get('fiscalYear').value,
        docNo: this.TEPHistory.get('docNumber').value,
        cnDocNo: this.TEPHistory.get('cnDocNo').value,
        startDate: this.TEPHistory.get('startDate').value,
        endDate: this.TEPHistory.get('endDate').value,
        toValue: this.TEPHistory.get('toNetAmount').value,
        fromValue: this.TEPHistory.get('fromNetAmount').value,
        searchField: this.TEPHistory.get('searchField').value,
        searchType: this.TEPHistory.get('searchType').value,
        status: this.TEPHistory.get('status').value,
        tepType: this.TEPHistory.get('tepType').value
      };
      this.tEPRequestFacade.setHistorySearchParamDetails(
        historySearchParamDetails
      );
      let requestPayload: AdvanceHistoryItemsRequestPayload = {
        docNo: this.TEPHistory.get('docNumber').value
          ? this.TEPHistory.get('docNumber').value
          : null,
        refDocNo: this.TEPHistory.get('cnDocNo').value
          ? this.TEPHistory.get('cnDocNo').value
          : null,
        fiscalYear: this.TEPHistory.get('fiscalYear').value
          ? this.TEPHistory.get('fiscalYear').value
          : null,
        toNetAmount: this.TEPHistory.get('toNetAmount').value
          ? Number(this.TEPHistory.get('toNetAmount').value)
          : null,
        fromNetAmount: this.TEPHistory.get('fromNetAmount').value
          ? Number(this.TEPHistory.get('fromNetAmount').value)
          : null
      };
      if (
        this.TEPHistory.get('startDate').value &&
        this.TEPHistory.get('endDate').value
      ) {
        const docStartDate = moment(this.TEPHistory.get('startDate').value)
          .startOf('day')
          .valueOf();
        const docEndDate = moment(this.TEPHistory.get('endDate').value)
          .endOf('day')
          .valueOf();
        requestPayload = {
          ...requestPayload,
          toDocDate: docEndDate,
          fromDocDate: docStartDate
        };
      }
      this.tEPRequestFacade.loadTEPHistory(
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        this.configPageEvent.pageSize,
        'TEP',
        this.TEPHistory.get('tepType').value,
        this.TEPHistory.get('tepType').value ===
          CreateTepTypesEnum.CUT_PIECE_TEP
          ? this.defaultSortCutPiece
          : this.defaultSort
      );
    }
  }

  paginate(event: PageEvent) {
    this.configPageEvent = event;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.searchAdvanceHistoryItem(this.pageIndex, this.pageSize);
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

  ngOnDestroy(): void {
    this.tEPRequestFacade.resetValue();
    this.destroy$.next();
    this.destroy$.complete();
    this.tEPRequestFacade.clearSearchList();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
