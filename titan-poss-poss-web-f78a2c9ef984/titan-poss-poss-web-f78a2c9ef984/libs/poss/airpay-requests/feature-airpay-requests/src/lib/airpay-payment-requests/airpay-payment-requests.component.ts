import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { AirpayPaymentReqFacade } from '@poss-web/poss/airpay-requests/data-access-airpay-requests';
import {
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  SEARCH_BY_ENUM,
  CustomerPayload,
  PaymentRequestDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  SalesMenuKeyEnum,
  OverlayNotificationEventType,
  SharedBodEodFeatureServiceAbstraction,
  BodEodStatusEnum
} from '@poss-web/shared/models';
import { filter, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  getHomePageUrl,
  getPendingAirpayStatusUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

@Component({
  selector: 'poss-web-airpay-payment-requests',
  templateUrl: './airpay-payment-requests.component.html'
})
export class AirpayPaymentRequestsComponent implements OnInit, OnDestroy {
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
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private airpayFacade: AirpayPaymentReqFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorService: FieldValidatorsService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private sharedBodEodFacade: SharedBodEodFacade,
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
      fiscalYear: new FormControl(this.currentFiscalYear, [
        // this.fieldValidatorService.numbersField('Fiscal Year'),
        // this.fieldValidatorService.maxLength(4, 'Fiscal Year'),
        // this.fieldValidatorService.minLength(4, 'Fiscal Year'),
        // this.fieldValidatorService.max(this.currentYear, 'Fiscal Year')
      ]),
      fromDate: new FormControl(this.bussinessDay),
      toDate: new FormControl(this.bussinessDay)
    });
  }

  ngOnInit(): void {
    //resetError
    this.sharedBodEodFacade.loadLatestBusinessDay();

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log('AirpayPaymentRequestsShell: isLoggedIn:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      });

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
      });

    this.sharedBodEodFacade
      .getGoldRateAvailablityStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(goldRateAvailable => {
        this.isGoldRateAvailable = goldRateAvailable;
      });

    this.airpayFacade.resetError();
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
    this.airpayFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.sharedBodEodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        this.currentFiscalYear = fiscalYear?.toString();
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.initialPageEvent.pageSize = data;
      });
    this.airpayFacade
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

    this.paymentsList$ = this.airpayFacade.getAirpayPaymentRequests();
    this.paymentListTotalCount$ = this.airpayFacade.getAirpayPaymentRequestsCount();
    this.paymentsHistory$ = this.airpayFacade.getAirpayPaymentRequestsHistory();
    this.paymentHistoryTotalCount$ = this.airpayFacade.getAirpayPaymentRequestsHistoryCount();
    this.isSearchingCutsomer$ = this.airpayFacade.getIsSearchingCustomer();
    // this.isLoadingPaymnetRequestList$ = this.airpayFacade.getIsLoadingAirpayPaymentRequests();
    // this.isLoadingPaymentRequestHistory$ = this.airpayFacade.getIsLoadingAirpayPaymentRequestsHistory();
    this.isLoading$ = this.airpayFacade.getIsLoading();

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
          const endDate = this.requestHistoryFormFroup.get('toDate');
          endDate.setValidators([
            this.fieldValidatorsService.minDate(data, 'EndDate')
          ]);
          endDate.updateValueAndValidity();
        }
      });
    this.airpayFacade
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
    // this.requestListFormGroup
    //   .get('fromDate')
    //   .valueChanges.pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     console.log('data123', data);
    //     const endDate = this.requestListFormGroup.get('toDate');
    //     endDate.setValidators([
    //       this.fieldValidatorsService.minDate(data, 'EndDate')
    //     ]);
    //     endDate.updateValueAndValidity();
    //   });
  }
  changeType(newType: any) {
    if (this.tab !== newType) {
      this.listingPageEvent = this.initialPageEvent;
      this.tab = newType;
      // if (newType === 'list') {
      // this.router.navigate(['sales/airpayRequests', newType]);
      // } else if (newType === 'history') {
      this.router.navigate([getPendingAirpayStatusUrl(newType)]);
      // }
      this.loadPayments();
    }
  }

  loadPayments() {
    if (this.tab === 'list') {
      this.airpayFacade.loadPaymentRequests({
        page: this.listingPageEvent.pageIndex,
        paymentCode: 'AIRPAY',
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
      this.airpayFacade.loadPaymentRequestshistory({
        page: this.listingPageEvent.pageIndex,
        paymentCode: 'AIRPAY',
        size: this.listingPageEvent.pageSize,
        payload: {
          dateRangeType: dateRangeType,
          customerId: this.customerDetails
            ? this.customerDetails.customerId
            : null,
          endDate: this.fromDate
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
          this.airpayFacade.resetPaymentsList();
          this.airpayFacade.searchCustomer({
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
          this.airpayFacade.resetPaymentsHistory();
          this.airpayFacade.searchCustomer({
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
    this.airpayFacade.verifyPayment(event.id);
  }
  generateCN(event: any) {
    this.airpayFacade.generateCN({ id: event.id });
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadPayments();
  }
  back() {
    const url = this.isGoldRateAvailable
      ? getSalesHomePageUrl()
      : getHomePageUrl();

    if (this.bodEodStatus === BodEodStatusEnum.OPEN) {
      this.router.navigate([url], {
        queryParams: {
          menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
        }
      });
    } else {
      this.router.navigate([getHomePageUrl()]);
    }
  }
  errorHandler(error: CustomErrors) {
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
