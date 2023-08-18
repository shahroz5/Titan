import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  CustomerPayload,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentRequestDetails,
  SalesMenuKeyEnum,
  SEARCH_BY_ENUM,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  getSalesHomePageUrl
  // getPendingRazorpayStatusUrl
} from '@poss-web/shared/util-api-service';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { RazorpayStatusCheckFacade } from '@poss-web/poss/razorpay-status-check/data-access-razorpay-status-check';

@Component({
  selector: 'poss-web-razorpay-payment-requests',
  templateUrl: './razorpay-payment-requests.component.html'
})
export class RazorpayPaymentRequestsComponent implements OnInit, OnDestroy {
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  listingPageEvent: PageEvent = this.initialPageEvent;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  pageEvent: PageEvent;
  dateFormat: string;

  tab: string;
  paymentsList$: Observable<PaymentRequestDetails[]>;
  paymentsHistory$: Observable<PaymentRequestDetails[]>;
  paymentListTotalCount$: Observable<number>;
  paymentHistoryTotalCount$: Observable<number>;
  isSearchingCutsomer$: Observable<boolean>;
  // isLoadingPaymnetRequestList$: Observable<boolean>;
  // isLoadingPaymentRequestHistory$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  destroy$: Subject<null> = new Subject<null>();

  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;

  requestListFormGroup: FormGroup;
  requestHistoryFormFroup: FormGroup;
  bussinessDay: any;
  customerDetails: CustomerPayload;
  listCustMobileNo: string;
  historyCustMobileNo: string;
  date: any;
  fromDate: any;
  toDate: any;
  fiscalYear: string;
  verificationResponse: PaymentRequestDetails;
  currentFiscalYear: string;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private razorpayFacade: RazorpayStatusCheckFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorService: FieldValidatorsService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    public authFacade: AuthFacade
  ) {
    this.requestListFormGroup = new FormGroup({
      listMobileNo: new FormControl('', [
        this.fieldValidatorService.mobileField('Mobile No')
      ]),
      date: new FormControl(this.bussinessDay)
    });
    this.requestHistoryFormFroup = new FormGroup({
      historyMobileNo: new FormControl('', [
        this.fieldValidatorService.mobileField('Mobile No')
      ]),
      fiscalYear: new FormControl(this.currentFiscalYear),
      fromDate: new FormControl(this.bussinessDay),
      toDate: new FormControl(this.bussinessDay)
    });
  }

  ngOnInit(): void {
    //resetError
    this.bodeodFacade.loadLatestBusinessDay();

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log(
          'RazorpayPaymentRequestsComponent: isLoggedIn:',
          isLoggedIn
        );
        this.isLoggedIn = isLoggedIn;
      });

    this.razorpayFacade.resetError();
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = moment(data);
        if (this.bussinessDay) {
          this.requestListFormGroup.patchValue(
            {
              date: this.bussinessDay
            },
            { emitEvent: false }
          );
        }
      });
    // this.locationSettingsFacade
    //   .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((fiscalYear: string) => {
    //     this.currentFiscalYear = fiscalYear;
    //   });
    this.listCustMobileNo = this.requestListFormGroup.get('listMobileNo').value;
    this.date = this.requestListFormGroup.get('date').value;
    this.historyCustMobileNo = this.requestHistoryFormFroup.get(
      'historyMobileNo'
    ).value;
    this.fromDate = this.requestHistoryFormFroup.get('fromDate').value;
    this.toDate = this.requestHistoryFormFroup.get('toDate').value;
    // this.currentFiscalYear = this.requestHistoryFormFroup.get(
    //   'fiscalYear'
    // ).value;
    this.razorpayFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.initialPageEvent.pageSize = data;
      });
    this.razorpayFacade
      .getSearchedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.customerDetails = null;
        if (data) {
          this.customerDetails = data;
          this.loadPayments();
        }
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
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });

    this.changeType(this.activatedRoute.snapshot.params['type']);

    this.paymentsList$ = this.razorpayFacade.getRazorpayPaymentRequests();
    this.paymentListTotalCount$ = this.razorpayFacade.getRazorpayPaymentRequestsCount();
    this.paymentsHistory$ = this.razorpayFacade.getRazorpayPaymentRequestsHistory();
    this.paymentHistoryTotalCount$ = this.razorpayFacade.getRazorpayPaymentRequestsHistoryCount();
    this.isSearchingCutsomer$ = this.razorpayFacade.getIsSearchingCustomer();
    // this.isLoadingPaymnetRequestList$ = this.razorpayFacade.getIsLoadingAirpayPaymentRequests();
    // this.isLoadingPaymentRequestHistory$ = this.razorpayFacade.getIsLoadingAirpayPaymentRequestsHistory();
    this.isLoading$ = this.razorpayFacade.getIsLoading();

    this.requestHistoryFormFroup
      .get('fiscalYear')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.requestHistoryFormFroup.patchValue(
            {
              toDate: null,
              fromDate: null
            },
            { emitEvent: false }
          );
        }
      });
    this.requestHistoryFormFroup
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.requestHistoryFormFroup.patchValue(
            {
              fiscalYear: null
            },
            { emitEvent: false }
          );
        }
      });
    this.razorpayFacade
      .getVerificationResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PaymentRequestDetails) => {
        this.verificationResponse = data;
        if (this.verificationResponse) {
          if (this.verificationResponse?.otherDetails?.data?.creditNoteDocNo) {
            this.successNotificationOverlay();
          }
        }
      });

    this.requestListFormGroup
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.requestListFormGroup.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  changeType(newType: any) {
    if (this.tab !== newType) {
      this.listingPageEvent = this.initialPageEvent;
      this.tab = newType;
      // if (newType === 'list') {
      // this.router.navigate(['sales/airpayRequests', newType]);
      // } else if (newType === 'history') {
      // this.router.navigate([getPendingRazorpayStatusUrl(newType)]);
      this.router.navigate([`/sales/razorpayRequests/${newType}`]);
      // }
      this.loadPayments();
    }
  }

  loadPayments() {
    if (this.tab === 'list') {
      this.razorpayFacade.loadPaymentRequests({
        page: this.listingPageEvent.pageIndex,
        paymentCode: 'RAZOR PAY',
        size: this.listingPageEvent.pageSize,
        payload: {
          dateRangeType: 'CUSTOM',
          customerId: this.customerDetails
            ? this.customerDetails.customerId
            : null,
          endDate: this.date ? moment(this.date).endOf('day').valueOf() : null,
          fiscalYear: null,

          referenceId: null,
          startDate: this.date
            ? moment(this.date).startOf('day').valueOf()
            : null,
          status: ['COMPLETED', 'IN_PROGRESS', 'OPEN']
        }
      });
    } else {
      let dateRangeType = 'ALL';
      if (this.fromDate && this.toDate) {
        dateRangeType = 'CUSTOM';
      } else if (this.currentFiscalYear) {
        dateRangeType = null;
      }
      this.razorpayFacade.loadPaymentRequestshistory({
        page: this.listingPageEvent.pageIndex,
        paymentCode: 'RAZOR PAY',
        size: this.listingPageEvent.pageSize,
        payload: {
          dateRangeType: dateRangeType,

          customerId: this.customerDetails
            ? this.customerDetails.customerId
            : null,
          endDate: this.toDate
            ? moment(this.toDate).endOf('day').valueOf()
            : null,
          fiscalYear: this.requestHistoryFormFroup.get('fiscalYear').value
            ? Number(this.requestHistoryFormFroup.get('fiscalYear').value)
            : null,

          referenceId: null,
          startDate: this.fromDate
            ? moment(this.fromDate).startOf('day').valueOf()
            : null,
          status: ['CLOSED', 'FAILED']
        }
      });
    }
  }

  search() {
    if (this.tab === 'list') {
      if (
        this.listCustMobileNo !==
          this.requestListFormGroup.get('listMobileNo').value ||
        this.date !== this.requestListFormGroup.get('date').value
      ) {
        this.listCustMobileNo = this.requestListFormGroup.get(
          'listMobileNo'
        ).value;
        this.date = this.requestListFormGroup.get('date').value;
        this.listingPageEvent = this.initialPageEvent;
        if (this.requestListFormGroup.get('listMobileNo').value) {
          this.razorpayFacade.resetPaymentsList();
          this.razorpayFacade.searchCustomer({
            searchType: SEARCH_BY_ENUM.MOBILE_NO,
            searchFieldValue: this.requestListFormGroup.get('listMobileNo')
              .value
          });
        } else {
          this.customerDetails = null;
          this.loadPayments();
        }
      }
    } else if (this.tab === 'history') {
      if (
        this.historyCustMobileNo !==
          this.requestHistoryFormFroup.get('historyMobileNo').value ||
        this.fromDate !== this.requestHistoryFormFroup.get('fromDate').value ||
        this.toDate !== this.requestHistoryFormFroup.get('toDate').value ||
        this.currentFiscalYear !==
          this.requestHistoryFormFroup.get('fiscalYear').value ||
        this.currentFiscalYear ===
          this.requestHistoryFormFroup.get('fiscalYear').value
      ) {
        this.historyCustMobileNo = this.requestHistoryFormFroup.get(
          'historyMobileNo'
        ).value;
        this.fromDate = this.requestHistoryFormFroup.get('fromDate').value;
        this.toDate = this.requestHistoryFormFroup.get('toDate').value;
        // this.currentFiscalYear = this.requestHistoryFormFroup.get(
        //   'fiscalYear'
        // ).value;
        this.listingPageEvent = this.initialPageEvent;
        if (this.requestHistoryFormFroup.get('historyMobileNo').value) {
          this.razorpayFacade.resetPaymentsHistory();
          this.razorpayFacade.searchCustomer({
            searchType: SEARCH_BY_ENUM.MOBILE_NO,
            searchFieldValue: this.requestHistoryFormFroup.get(
              'historyMobileNo'
            ).value
          });
        } else {
          this.customerDetails = null;
          this.loadPayments();
        }
      }
    }
  }
  verifyAirpayPayment(event: any) {
    this.razorpayFacade.verifyPayment(event.id);
  }
  generateCN(event: any) {
    this.razorpayFacade.generateCN({ id: event.id });
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadPayments();
  }
  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
      }
    });
  }
  errorHandler(error: CustomErrors) {
    console.log('error', error);

    if (error.code !== 'ERR-SALE-070') {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }
  successNotificationOverlay() {
    // this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        // this.hasNotification = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.loadPayments();
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
