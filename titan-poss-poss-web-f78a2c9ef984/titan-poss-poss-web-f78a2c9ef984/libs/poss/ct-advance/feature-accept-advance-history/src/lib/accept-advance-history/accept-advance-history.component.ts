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
  RsoNameObject
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { MatDialog } from '@angular/material/dialog';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CtAcceptAdvanceFacade } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AdvanceHistoryListPopUpComponent } from '@poss-web/poss/ct-advance/ui-advance-history-list-pop-up';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { getAdvanceHistoryDetailRouteUrl } from '@poss-web/shared/util-site-routes';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

@Component({
  selector: 'poss-web-accept-advance-history',
  templateUrl: './accept-advance-history.component.html',
  styleUrls: []
})
export class AcceptAdvanceHistoryComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = of(false);
  acceptAdvanceHistoryForm: FormGroup;
  advanceHistoryItems: AdvanceHistoryItem[];
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
  advanceHistoryItems$ = new Subject();
  advanceHistoryItemsCount$ = new Subject();
  currentFiscalYear: string;

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
    private acceptAdvanceFacade: CtAcceptAdvanceFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.acceptAdvanceHistoryForm = new FormGroup({
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
      searchField: new FormControl('')
    });
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.acceptAdvanceFacade.clearAdvanceHistoryItems();
      this.acceptAdvanceFacade.clearHistorySearchParamDetails();
    }
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
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
    this.acceptAdvanceFacade
      .getAdvanceHistoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((advanceHistoryResponse: AdvanceHistoryResponse) => {
        if (
          advanceHistoryResponse &&
          advanceHistoryResponse.results.length > 0
        ) {
          this.advanceHistoryItems = advanceHistoryResponse.results;
          this.totalElements = advanceHistoryResponse.totalElements;

        } else if (
          advanceHistoryResponse &&
          advanceHistoryResponse.results.length === 0
        ) {
          this.advanceHistoryItems = advanceHistoryResponse.results;
          this.totalElements = advanceHistoryResponse.totalElements;
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
    this.isLoading$ = this.acceptAdvanceFacade.getIsLoading();
    this.acceptAdvanceFacade.loadRsoDetails('RSO');
    this.acceptAdvanceFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.acceptAdvanceFacade
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
    this.acceptAdvanceFacade
      .getViewAdvanceResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewAdvanceResponse: any) => {
        if (viewAdvanceResponse) {
          this.selectedItemCustomerId = viewAdvanceResponse.customerId;
          this.selectedItemRemarks = viewAdvanceResponse.remarks;
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
    this.acceptAdvanceFacade
      .getHistorySearchParamDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((historySearchParams: HistorySearchParamDetails) => {
        if (historySearchParams) {
          this.acceptAdvanceHistoryForm
            .get('fiscalYear')
            .setValue(historySearchParams.fiscalYear);
          this.acceptAdvanceHistoryForm
            .get('cnDocNo')
            .setValue(historySearchParams.cnDocNo);
          this.acceptAdvanceHistoryForm
            .get('docNumber')
            .setValue(historySearchParams.docNo);
          // this.acceptAdvanceHistoryForm
          //   .get('startDate')
          //   .setValue(historySearchParams.startDate);
          // this.acceptAdvanceHistoryForm
          //   .get('endDate')
          //   .setValue(historySearchParams.endDate);
          this.acceptAdvanceHistoryForm
            .get('fromNetAmount')
            .setValue(historySearchParams.fromValue);
          this.acceptAdvanceHistoryForm
            .get('toNetAmount')
            .setValue(historySearchParams.toValue);
          this.acceptAdvanceHistoryForm.updateValueAndValidity();
        }
      });

    this.acceptAdvanceHistoryForm
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.acceptAdvanceHistoryForm.get('endDate');
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
        this.acceptAdvanceHistoryForm.get('searchField').setValue('');
        this.acceptAdvanceHistoryForm.get('searchField').setValidators([]);
      } else {
        this.showSearchField = false;
        this.acceptAdvanceHistoryForm.get('searchField').setValidators([]);
      }
      if (event.value === AdvanceSearchTypesEnum.MOBILE_NO) {
        this.acceptAdvanceHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.mobileField('Mobile Number'),
            this.fieldValidatorsService.requiredField('Mobile Number')
          ]);
        this.searchFieldPlaceholder =
          'pw.acceptAdvance.mobileNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.PAN_NO) {
        this.acceptAdvanceHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.pancardField('PAN Number'),
            this.fieldValidatorsService.requiredField('PAN Number')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.panNumberPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.EMAIL_ID) {
        this.acceptAdvanceHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.emailField('Email ID'),
            this.fieldValidatorsService.requiredField('Email ID')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.emailIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.ULP_ID) {
        this.acceptAdvanceHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.ulpIdField('Ulp ID'),
            this.fieldValidatorsService.ulpIdField('Ulp ID')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.ulpIdPlaceholder';
      } else if (event.value === AdvanceSearchTypesEnum.GST_NO) {
        this.acceptAdvanceHistoryForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.gstNumberField('Gst Number'),
            this.fieldValidatorsService.requiredField('Gst Number')
          ]);
        this.searchFieldPlaceholder = 'pw.acceptAdvance.gstNumberPlaceholder';
      }
      this.acceptAdvanceHistoryForm.get('searchField').updateValueAndValidity();
    }
  }

  openHistoryItemSelectionPopUp() {
    this.advanceHistoryItems$.next([]);
    this.advanceHistoryItemsCount$.next(0);
    const dialogRef = this.dialog.open(AdvanceHistoryListPopUpComponent, {
      autoFocus: false,
      data: {
        advanceHistoryList: this.advanceHistoryItems,
        advanceHistoryItems: this.advanceHistoryItems$.asObservable(),
        advanceHistoryItemsCount: this.advanceHistoryItemsCount$.asObservable()
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
        this.acceptAdvanceFacade.loadRsoDetails(RoleCodesEnum.RSO);
        this.getSelectedHistoryItem(selectedHistoryItem);
      }
    });
  }

  // setSelectedRSOName(selectedRSOName: string) {
  //   this.clearSelectedRsoName = false;
  //   this.selectedRso = { value: selectedRSOName, description: selectedRSOName };
  //   console.log('SelectedRso :', this.selectedRso);
  //   this.acceptAdvanceFacade.setSelectedRsoName({
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
        getAdvanceHistoryDetailRouteUrl(this.selectedHistoryItem.id)
      );
      // this.commonFacade.setTransactionConfig({
      //   isPaymentEditable: false,
      //   transactionType: {
      //     type: TransactionTypeEnum.ADV,
      //     subType: SubTransactionTypeEnum.NON_FROZEN_RATES
      //   },
      //   transactionID: this.selectedHistoryItem.id
      // });
      // this.acceptAdvanceFacade.getViewAdvanceDetails(
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
      !this.acceptAdvanceHistoryForm.get('docNumber').value &&
      !this.acceptAdvanceHistoryForm.get('cnDocNo').value &&
      !this.acceptAdvanceHistoryForm.get('fiscalYear').value &&
      !this.acceptAdvanceHistoryForm.get('toNetAmount').value &&
      !this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
      !this.acceptAdvanceHistoryForm.get('startDate').value &&
      !this.acceptAdvanceHistoryForm.get('endDate').value &&
      !this.acceptAdvanceHistoryForm.get('searchField').value &&
      !this.acceptAdvanceHistoryForm.get('searchType').value &&
      !this.acceptAdvanceHistoryForm.get('status').value
    ) {
      this.showAlertNotification(
        'Search criteria is required. Please add one or more search parameters.'
      );
    } else if (
      this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
      !this.acceptAdvanceHistoryForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('To Net Amount is required.');
    } else if (
      !this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
      this.acceptAdvanceHistoryForm.get('toNetAmount').value
    ) {
      this.showAlertNotification('From Net Amount is required.');
    } else if (
      (this.acceptAdvanceHistoryForm.get('docNumber').value ||
        (this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
          this.acceptAdvanceHistoryForm.get('toNetAmount').value)) &&
      !this.acceptAdvanceHistoryForm.get('fiscalYear').value
    ) {
      this.showAlertNotification('Please enter Fiscal Year and proceed.');
    } else if (
      this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
      this.acceptAdvanceHistoryForm.get('toNetAmount').value &&
      Number(this.acceptAdvanceHistoryForm.get('fromNetAmount').value) >
        Number(this.acceptAdvanceHistoryForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount should be lesser than To Net Amount.'
      );
    } else if (
      this.acceptAdvanceHistoryForm.get('fromNetAmount').value &&
      this.acceptAdvanceHistoryForm.get('toNetAmount').value &&
      Number(this.acceptAdvanceHistoryForm.get('fromNetAmount').value) ===
        Number(this.acceptAdvanceHistoryForm.get('toNetAmount').value)
    ) {
      this.showAlertNotification(
        'From Net Amount and To Net Amount should not be same.'
      );
    } else {
      const status = this.acceptAdvanceHistoryForm.get('status').value;
      const searchField = this.acceptAdvanceHistoryForm.get('searchField')
        .value;
      const searchType = this.acceptAdvanceHistoryForm.get('searchType').value;
      const historySearchParamDetails: HistorySearchParamDetails = {
        fiscalYear: this.acceptAdvanceHistoryForm.get('fiscalYear').value,
        docNo: this.acceptAdvanceHistoryForm.get('docNumber').value,
        cnDocNo: this.acceptAdvanceHistoryForm.get('cnDocNo').value,
        startDate: this.acceptAdvanceHistoryForm.get('startDate').value,
        endDate: this.acceptAdvanceHistoryForm.get('endDate').value,
        toValue: this.acceptAdvanceHistoryForm.get('toNetAmount').value,
        fromValue: this.acceptAdvanceHistoryForm.get('fromNetAmount').value,
        searchField: this.acceptAdvanceHistoryForm.get('searchField').value,
        searchType: this.acceptAdvanceHistoryForm.get('searchType').value,
        status: this.acceptAdvanceHistoryForm.get('status').value
      };
      this.acceptAdvanceFacade.setHistorySearchParamDetails(
        historySearchParamDetails
      );
      let requestPayload: AdvanceHistoryItemsRequestPayload = {
        docNo: this.acceptAdvanceHistoryForm.get('docNumber').value
          ? this.acceptAdvanceHistoryForm.get('docNumber').value
          : null,
        refDocNo: this.acceptAdvanceHistoryForm.get('cnDocNo').value
          ? this.acceptAdvanceHistoryForm.get('cnDocNo').value
          : null,
        fiscalYear: this.acceptAdvanceHistoryForm.get('fiscalYear').value
          ? this.acceptAdvanceHistoryForm.get('fiscalYear').value
          : null,
        toNetAmount: this.acceptAdvanceHistoryForm.get('toNetAmount').value
          ? Number(this.acceptAdvanceHistoryForm.get('toNetAmount').value)
          : null,
        fromNetAmount: this.acceptAdvanceHistoryForm.get('fromNetAmount').value
          ? Number(this.acceptAdvanceHistoryForm.get('fromNetAmount').value)
          : null
      };
      if (
        this.acceptAdvanceHistoryForm.get('startDate').value &&
        this.acceptAdvanceHistoryForm.get('endDate').value
      ) {
        const docStartDate = moment(
          this.acceptAdvanceHistoryForm.get('startDate').value
        )
          .startOf('day')
          .valueOf();
        const docEndDate = moment(
          this.acceptAdvanceHistoryForm.get('endDate').value
        )
          .endOf('day')
          .valueOf();
        requestPayload = {
          ...requestPayload,
          toDocDate: docEndDate,
          fromDocDate: docStartDate
        };
      }
      this.acceptAdvanceFacade.loadAdvanceHistory(
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
      docNo: this.acceptAdvanceHistoryForm.get('docNumber').value,
      refDocNo: this.acceptAdvanceHistoryForm.get('cnDocNo').value,
      fiscalYear: this.acceptAdvanceHistoryForm.get('fiscalYear').value
    };
    this.acceptAdvanceFacade.loadAdvanceHistory(
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
    //   this.acceptAdvanceHistoryForm.get('startDate').value
    // ).format('YYYY-MM-DD');
    // const docEndDate = moment(
    //   this.acceptAdvanceHistoryForm.get('endDate').value
    // ).format('YYYY-MM-DD');
    // const status = this.acceptAdvanceHistoryForm.get('status').value;
    // const searchType = AdvanceSearchTypesEnum.MOBILE_NO;
    // const searchField = this.acceptAdvanceHistoryForm.get('mobileNumber').value;
    // const requestPayload: AdvanceHistoryItemsRequestPayload = {
    //   docNo: this.acceptAdvanceHistoryForm.get('docNumber').value,
    //   cnDocNo: this.acceptAdvanceHistoryForm.get('cnDocNo').value,
    //   fiscalYear: this.acceptAdvanceHistoryForm.get('fiscalYear').value,
    //   toDocDate: docEndDate,
    //   fromDocDate: docStartDate,
    //   toNetAmount: this.acceptAdvanceHistoryForm.get('toNetAmount').value,
    //   fromNetAmount: this.acceptAdvanceHistoryForm.get('fromNetAmount').value
    // };
    // this.acceptAdvanceFacade.loadAdvanceHistory(
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

  ngOnDestroy(): void {
    this.acceptAdvanceFacade.resetAcceptAdvance();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
