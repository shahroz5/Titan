import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Router } from '@angular/router';
import {
  AdvanceHistoryItem,
  AdvanceHistoryItemsRequestPayload,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleCodesEnum,
  SubTransactionTypeEnum,
  SummaryBarServiceAbstraction,
  TransactionTypeEnum,
  CreatedCustomerResponse,
  AdvanceHistoryResponse,
  HistorySearchParamDetails,
  AdvanceStatusEnum,
  AdvanceSearchTypesEnum,
  ToolbarConfig,
  CtGrfTxnEnum,
  GoldRateFreezeEnumTypes,
  RsoNameObject
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { MatDialog } from '@angular/material/dialog';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AdvanceHistoryListPopUpComponent } from '@poss-web/poss/ct-advance/ui-advance-history-list-pop-up';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { getGrfHistoryDetailRouteUrl } from '@poss-web/shared/util-site-routes';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

@Component({
  selector: 'poss-web-grf-history',
  templateUrl: './grf-history.component.html',
  styleUrls: []
})
export class GrfHistoryComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = of(false);
  grfHistoryForm: FormGroup;
  grfHistoryItems: AdvanceHistoryItem[];
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

  isFilterApplied = false;
  selectedSortOrder = 'desc';
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[];
  pageIndex = 0;
  minPageSize = 0;

  searchField = '';
  searchType = '';
  status = '';
  statusOptions = [
    {
      value: AdvanceStatusEnum.CONFIRMED,
      description: AdvanceStatusEnum.CONFIRMED
    },
    { value: AdvanceStatusEnum.DELETED, description: AdvanceStatusEnum.DELETED }
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
  showSearchField = false;
  searchFieldPlaceholder = '';
  noDataFoundMessageHistory = '';
  currentDate = moment();
  clearFilter: boolean;
  currentFiscalYear: string;
  subTxnTypes = [];
  newGrfLabel = '';
  manualGrfLabel = '';

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private appsetttingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private paymentFacade: PaymentFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private grfFacade: CtGrfFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.grfHistoryForm = new FormGroup({
      docNumber: new FormControl('', [
        this.fieldValidatorsService.requestNumberField('Doc Number')
      ]),
      cnDocNo: new FormControl('', [
        this.fieldValidatorsService.requestNumberField('CN Doc Number')
      ]),
      fiscalYear: new FormControl('', [
        this.fieldValidatorsService.fiscalYearField('Fiscal Year')
      ]),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      fromNetAmount: new FormControl(''),
      toNetAmount: new FormControl(''),
      status: new FormControl(AdvanceStatusEnum.CONFIRMED),
      searchType: new FormControl(''),
      searchField: new FormControl(''),
      subTxnType: new FormControl(SubTransactionTypeEnum.FROZEN_RATES)
    });
    // this.router.getCurrentNavigation() &&
    //   this.router.getCurrentNavigation().extras.state &&
    //   this.router.getCurrentNavigation().extras.state.clearFilter === false

    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.grfFacade.clearGrfHistoryItems();
      this.grfFacade.clearHistorySearchParamDetails();
    }
  }

  ngOnInit(): void {
    this.translate
      .get(['pw.entity.resultEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.grf.newGrfLabel',
              'pw.grf.manualGrfLabel'
            ],
            {
              entityName: entity['pw.entity.resultEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageHistory =
              translatedMsg['pw.global.noDataFoundMessage'];
            this.newGrfLabel = translatedMsg['pw.grf.newGrfLabel'];
            this.manualGrfLabel = translatedMsg['pw.grf.manualGrfLabel'];
            this.subTxnTypes = [
              {
                value: SubTransactionTypeEnum.FROZEN_RATES,
                description: this.newGrfLabel
              },
              {
                value: SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
                description: this.manualGrfLabel
              }
            ];
          });
      });
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.NON_FROZEN_RATES,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.grfFacade
      .getGrfHistoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((grfHistoryResponse: AdvanceHistoryResponse) => {
        if (grfHistoryResponse && grfHistoryResponse.results.length > 0) {
          this.grfHistoryItems = grfHistoryResponse.results;
          this.totalElements = grfHistoryResponse.totalElements;
          // this.advanceHistoryItems$.next(advanceHistoryResponse.results);
          // this.advanceHistoryItemsCount$.next(100);
        } else if (
          grfHistoryResponse &&
          grfHistoryResponse.results.length === 0
        ) {
          this.grfHistoryItems = grfHistoryResponse.results;
          this.totalElements = grfHistoryResponse.totalElements;
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
    this.isLoading$ = this.grfFacade.getIsLoading();
    this.grfFacade.loadRsoDetails('RSO');
    this.grfFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.grfFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoNamesList: RsoNameObject[]) => {
        this.rsoNamesList = rsoNamesList;
        // if (rsoNamesList && rsoNamesList.length > 0) {
        //   this.rsoNamesList = rsoNamesList.map((rsoName: string) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
    this.grfFacade
      .getViewGrfResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewGrfResponse: any) => {
        if (viewGrfResponse) {
          this.selectedItemCustomerId = viewGrfResponse.customerId;
          this.selectedItemRemarks = viewGrfResponse.remarks;
          if (this.selectedItemCustomerId) {
            this.customerFacade.loadSelectedCustomerDetail(
              this.selectedItemCustomerId.toString()
            );
          }
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
    this.grfFacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: HistorySearchParamDetails) => {
        if (historySearchParams) {
          this.grfHistoryForm
            .get('fiscalYear')
            .setValue(historySearchParams.fiscalYear);
          this.grfHistoryForm
            .get('cnDocNo')
            .setValue(historySearchParams.cnDocNo);
          this.grfHistoryForm
            .get('docNumber')
            .setValue(historySearchParams.docNo);
          // this.grfHistoryForm
          //   .get('startDate')
          //   .setValue(historySearchParams.startDate);
          // this.grfHistoryForm
          //   .get('endDate')
          //   .setValue(historySearchParams.endDate);
          this.grfHistoryForm
            .get('fromNetAmount')
            .setValue(historySearchParams.fromValue);
          this.grfHistoryForm
            .get('toNetAmount')
            .setValue(historySearchParams.toValue);
          this.grfHistoryForm
            .get('subTxnType')
            .setValue(historySearchParams.subTxnType);
          this.grfHistoryForm.updateValueAndValidity();
        }
      });

    this.grfHistoryForm
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.grfHistoryForm.get('endDate');
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

  onSearchTypeChanged(event: any) {
    if (event) {
      if (event.value) {
        this.showSearchField = true;
        this.grfHistoryForm.get('searchField').setValue('');
        this.grfHistoryForm.get('searchField').setValidators([]);
      } else {
        this.showSearchField = false;
        this.grfHistoryForm.get('searchField').setValidators([]);
      }
      if (event.value === AdvanceSearchTypesEnum.MOBILE_NO) {
        this.grfHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.mobileField('Mobile Number'),
            this.fieldValidatorsService.requiredField('Mobile Number')
          ]);
        this.searchFieldPlaceholder =
          'pw.acceptAdvance.mobileNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.PAN_NO) {
        this.grfHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.pancardField('PAN Number'),
            this.fieldValidatorsService.requiredField('PAN Number')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.panNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.EMAIL_ID) {
        this.grfHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.emailField('Email ID'),
            this.fieldValidatorsService.requiredField('Email ID')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.emailIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.ULP_ID) {
        this.grfHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.ulpIdField('Ulp ID'),
            this.fieldValidatorsService.ulpIdField('Ulp ID')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.ulpIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.GST_NO) {
        this.grfHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.gstNumberField('Gst Number'),
            this.fieldValidatorsService.requiredField('Gst Number')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.gstNumberPlaceholder';
      }
      this.grfHistoryForm.get('searchField').updateValueAndValidity();
    }
  }

  openHistoryItemSelectionPopUp() {
    this.grfHistoryItems$.next([]);
    this.grfHistoryItemsCount$.next(0);
    const dialogRef = this.dialog.open(AdvanceHistoryListPopUpComponent, {
      autoFocus: false,
      data: {
        advanceHistoryList: this.grfHistoryItems,
        advanceHistoryItems: this.grfHistoryItems$.asObservable(),
        advanceHistoryItemsCount: this.grfHistoryItemsCount$.asObservable()
      },
      width: '900px'
    });

    dialogRef.componentInstance.load
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result?.page !== undefined) {
          this.paginateItems(null, null, null, result.page, result.size);
        }
      });

    dialogRef.afterClosed().subscribe((selectedHistoryItem: any) => {
      if (selectedHistoryItem) {
        // this.isOpenPopUp = false;
        this.grfFacade.loadRsoDetails(RoleCodesEnum.RSO);
        this.getSelectedHistoryItem(selectedHistoryItem);
      }
    });
  }

  // setSelectedRSOName(selectedRSOName: string) {
  //   this.clearSelectedRsoName = false;
  //   this.selectedRso = { value: selectedRSOName, description: selectedRSOName };
  //   console.log('SelectedRso :', this.selectedRso);
  //   this.grfFacade.setSelectedRsoName({
  //     value: selectedRSOName,
  //     description: selectedRSOName
  //   });
  // }

  onStatusChanged(event: any) {
    // console.log('EVENT IN STATUS :', event);
  }

  getSelectedHistoryItem(event) {
    if (event) {
      this.selectedHistoryItem = event;
      this.router.navigateByUrl(
        getGrfHistoryDetailRouteUrl(
          this.selectedHistoryItem.id,
          this.grfHistoryForm.get('subTxnType').value
        )
      );
      // this.commonFacade.setTransactionConfig({
      //   isPaymentEditable: false,
      //   transactionType: {
      //     type: TransactionTypeEnum.ADV,
      //     subType: SubTransactionTypeEnum.NON_FROZEN_RATES
      //   },
      //   transactionID: this.selectedHistoryItem.id
      // });
      // this.grfFacade.getViewAdvanceDetails(
      //   this.selectedHistoryItem.id
      // );
      // this.selectedRso = {
      //   value: this.selectedHistoryItem.createdBy,
      //   description: this.selectedHistoryItem.createdBy
      // };
    }
  }

  searchAdvanceHistoryItem(page, size) {
    if (
      !this.grfHistoryForm.get('docNumber').value &&
      !this.grfHistoryForm.get('cnDocNo').value &&
      !this.grfHistoryForm.get('fiscalYear').value &&
      !this.grfHistoryForm.get('toNetAmount').value &&
      !this.grfHistoryForm.get('fromNetAmount').value &&
      !this.grfHistoryForm.get('startDate').value &&
      !this.grfHistoryForm.get('endDate').value &&
      !this.grfHistoryForm.get('searchField').value &&
      !this.grfHistoryForm.get('searchType').value &&
      !this.grfHistoryForm.get('status').value
    ) {
      this.showAlertNotification(
        'Search criteria is required. Please add one or more search parameters.'
      );
    } else if (
      this.grfHistoryForm.get('fromNetAmount').value &&
      !this.grfHistoryForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('To Net Amount is required.');
    } else if (
      !this.grfHistoryForm.get('fromNetAmount').value &&
      this.grfHistoryForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('From Net Amount is required.');
    } else if (
      (this.grfHistoryForm.get('docNumber').value ||
        (this.grfHistoryForm.get('fromNetAmount').value &&
          this.grfHistoryForm.get('toNetAmount').value)) &&
      !this.grfHistoryForm.get('fiscalYear').value
    ) {
      this.showAlertNotification('Please enter Fiscal Year and proceed.');
    } else if (
      this.grfHistoryForm.get('fromNetAmount').value &&
      this.grfHistoryForm.get('toNetAmount').value &&
      Number(this.grfHistoryForm.get('fromNetAmount').value) >
        Number(this.grfHistoryForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount should be lesser than To Net Amount.'
      );
    } else if (
      this.grfHistoryForm.get('fromNetAmount').value &&
      this.grfHistoryForm.get('toNetAmount').value &&
      Number(this.grfHistoryForm.get('fromNetAmount').value) ===
        Number(this.grfHistoryForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount and To Net Amount should not be same.'
      );
    } else {
      const status = this.grfHistoryForm.get('status').value;
      const searchField = this.grfHistoryForm.get('searchField').value;
      const searchType = this.grfHistoryForm.get('searchType').value;
      const historySearchParamDetails: HistorySearchParamDetails = {
        fiscalYear: this.grfHistoryForm.get('fiscalYear').value,
        docNo: this.grfHistoryForm.get('docNumber').value,
        cnDocNo: this.grfHistoryForm.get('cnDocNo').value,
        startDate: this.grfHistoryForm.get('startDate').value,
        endDate: this.grfHistoryForm.get('endDate').value,
        toValue: this.grfHistoryForm.get('toNetAmount').value,
        fromValue: this.grfHistoryForm.get('fromNetAmount').value,
        searchField: this.grfHistoryForm.get('searchField').value,
        searchType: this.grfHistoryForm.get('searchType').value,
        status: this.grfHistoryForm.get('status').value,
        subTxnType: this.grfHistoryForm.get('subTxnType').value
      };
      this.grfFacade.setHistorySearchParamDetails(historySearchParamDetails);
      let requestPayload: AdvanceHistoryItemsRequestPayload = {
        docNo: this.grfHistoryForm.get('docNumber').value
          ? this.grfHistoryForm.get('docNumber').value
          : null,
        refDocNo: this.grfHistoryForm.get('cnDocNo').value
          ? this.grfHistoryForm.get('cnDocNo').value
          : null,
        fiscalYear: this.grfHistoryForm.get('fiscalYear').value
          ? this.grfHistoryForm.get('fiscalYear').value
          : null,
        toNetAmount: this.grfHistoryForm.get('toNetAmount').value
          ? Number(this.grfHistoryForm.get('toNetAmount').value)
          : null,
        fromNetAmount: this.grfHistoryForm.get('fromNetAmount').value
          ? Number(this.grfHistoryForm.get('fromNetAmount').value)
          : null
      };
      if (
        this.grfHistoryForm.get('startDate').value &&
        this.grfHistoryForm.get('endDate').value
      ) {
        const docStartDate = moment(this.grfHistoryForm.get('startDate').value)
          .startOf('day')
          .valueOf();
        const docEndDate = moment(this.grfHistoryForm.get('endDate').value)
          .endOf('day')
          .valueOf();
        requestPayload = {
          ...requestPayload,
          toDocDate: docEndDate,
          fromDocDate: docStartDate
        };
      }
      this.grfFacade.loadAdvanceHistory(
        this.grfHistoryForm.get('subTxnType').value,
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        size
      );
    }
    // this.openHistoryItemSelectionPopUp();
  }

  paginateItems(searchField, searchType, status, page, size) {
    const requestPayload: AdvanceHistoryItemsRequestPayload = {
      docNo: this.grfHistoryForm.get('docNumber').value,
      refDocNo: this.grfHistoryForm.get('cnDocNo').value,
      fiscalYear: this.grfHistoryForm.get('fiscalYear').value
    };
    this.grfFacade.loadAdvanceHistory(
      this.grfHistoryForm.get('subTxnType').value,
      requestPayload,
      searchField,
      searchType,
      status,
      page,
      size
    );
  }

  paginate(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // const docStartDate = moment(
    //   this.grfHistoryForm.get('startDate').value
    // ).format('YYYY-MM-DD');
    // const docEndDate = moment(this.grfHistoryForm.get('endDate').value).format(
    //   'YYYY-MM-DD'
    // );
    // const status = this.grfHistoryForm.get('status').value;
    // const searchType = AdvanceSearchTypesEnum.MOBILE_NO;
    // const searchField = this.grfHistoryForm.get('mobileNumber').value;
    // const requestPayload: AdvanceHistoryItemsRequestPayload = {
    //   docNo: this.grfHistoryForm.get('docNumber').value,
    //   cnDocNo: this.grfHistoryForm.get('cnDocNo').value,
    //   fiscalYear: this.grfHistoryForm.get('fiscalYear').value,
    //   toDocDate: docEndDate,
    //   fromDocDate: docStartDate,
    //   toNetAmount: this.grfHistoryForm.get('toNetAmount').value,
    //   fromNetAmount: this.grfHistoryForm.get('fromNetAmount').value
    // };
    // this.grfFacade.loadAdvanceHistory(
    //   requestPayload,
    //   searchField,
    //   searchType,
    //   status,
    //   this.pageIndex,
    //   this.pageSize
    // );
    this.searchAdvanceHistoryItem(this.pageIndex, this.pageSize);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onSubTxnTypeChanged(event) {
    this.grfHistoryForm.get('subTxnType').patchValue(event.value);
  }

  ngOnDestroy(): void {
    this.grfFacade.resetGrf();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
