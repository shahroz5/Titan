import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Inject,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { ViewTransactionLevelDiscountsComponent } from '@poss-web/poss/shared/discount/ui-discount';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashMemoDetailsResponse,
  CashMemoItemDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfigTypeEnum,
  CouponDetails,
  CreditNoteDetail,
  CreditNotePayment,
  CustomErrors,
  DiscountDetail,
  DiscountItemDetails,
  DiscountsResponse,
  DiscountTransactionLevelResponse,
  DiscountTypeEnum,
  DiscountVoucherDetailsRequestPayload,
  DiscountVoucherDetailsResponePayload,
  GepPurityConfigIdEligibleItemsRequestPayload,
  GepPurityConfigIdEligibleItemsResponse,
  GhsAccountDiscount,
  KaratOrCoinOfferEligibleItemsRequestPayload,
  LocationSettingAttributesEnum,
  Lov,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  PaymentModeEnum,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TataEmployeeDetails,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { AnyFn } from '@ngrx/store/src/selector';
import * as moment from 'moment';

const TATA_COMPANY_LIST_PAYLOAD = 'TATA_COMPANY';
@Component({
  selector: 'poss-web-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() transactionMode: TransactionTypeEnum;
  cashMemoDiscountDetails: any;
  discountType: string = null;

  availabeBillLevelDiscounts$: Observable<any>;
  availabeSystemDvDiscounts: any;
  appliedBillLevelDiscount$: Observable<any>;
  appliedEmployeeDiscount$: Observable<any>;
  appliedTsssDiscount$: Observable<any>;
  appliedTataEmployeeDiscount$: Observable<any>;
  appliedSystemDvDiscount$: Observable<any>;
  appliedSystemDvDiscounts: any[];
  appliedGrnMultipleDiscount: any[];
  appliedSystemGhsBonusDiscounts: any[];
  appliedEmpowermentDiscounts: any[];
  curentDigiGoldPayment: number;
  paymentDetails: PaymentDetails[];
  appliedDiscounts$: Observable<any>;
  appliedDiscounts = [];
  appliedBillLevelDiscount = [];
  appliedKaratOfferDiscount = [];
  appliedCoinOfferDiscount = [];
  appliedSystemDiscountGepPurity = [];

  selectedEmployeeCouponCode = null;
  appliedEmployeeCouponCode = null;
  appliedRivahCouponCode = null;

  selectedTsssCouponCode = null;
  appliedTsssCouponCode = null;

  selectedTataEmployeeDiscountDetails: TataEmployeeDetails = null;
  appliedTataEmployeeDiscountDetails = null;

  bussinessDay: number;
  cashMemoId = null;

  tataCompanyList: Lov[];

  subTransactionType: SubTransactionTypeEnum;
  transactionType: TransactionTypeEnum;
  transactionTypeEnum = TransactionTypeEnum;
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  selectedItemDetailsPayload: DiscountItemDetails[];
  isLoading$: Observable<boolean>;
  isRsoSelected = true;
  selectedCreditNote: CreditNoteDetail = null;
  selectedCreditNotePaymentToBeDeleted: PaymentDetails = null;
  addedCreditNotePayment: CreditNotePayment = null;
  destroy$: Subject<null> = new Subject<null>();
  isL3Store = false;
  dateFormat: string;
  discountVoucherDetails: any;
  resetForm$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  isEmpowermentDiscountSelected: boolean;
  transactionDiscounts: DiscountsResponse[];
  appliedEmpowermentDiscountDetails = false;
  refPaymentId = '';
  gepPurityDiscountObject: any;
  ghsAccountDiscountObject: GhsAccountDiscount;
  systemDiscountDvObject: any;
  grnMultipleDiscountObject: any;
  digiPercentage = 0;

  selectedCustomer: any;
  isABInvokedFirstTime = false;
  isABDiscountsSelected = false;
  creditNoteActualAmount = 0;
  creditNoteRedeemedAmount = 0;
  karatExchangeOfferEligibleItems = [];
  coinOfferEligibleItems = [];

  tataEmployeeDetails: TataEmployeeDetails;
  tsssDetails: {
    couponDetails: CouponDetails[];
  };
  empowermentDetails: {
    applyEmpowermentDiscount: boolean;
  };
  employeeDetails: {
    couponDetails: CouponDetails[];
  };
  locationCode: string;
  tcsToBeCollectedAtCM: number;
  tcsPaymentDetail: any;
  enableCalculateRivaahGhsDiscount = false;
  @Input() setFocus: number;
  @ViewChild('viewButton', { static: true })
  viewButton: ElementRef;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  isLoadDigiGoldDiscFromCN: boolean;
  selectedItemId: string;

  constructor(
    private dialog: MatDialog,
    private discountFacade: DiscountFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private commonFacade: CommonFacade,
    private authFacade: AuthFacade,
    private productFacade: ProductFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    private appSettingFacade: AppsettingFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private profiledatafacade: ProfileDataFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private customerFacade: CustomerFacade,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean
  ) {
    super(timeTrackingLog);
  }

  public getDiscountValue(): number {
    if (this.isLoadDigiGoldDiscFromCN) {
      return this.selectedCreditNote.discountDetails.data.digiGoldDiscount
        ?.discountValue;
    } else {
      return Number(
        (this.digiPercentage * 0.01 * this.curentDigiGoldPayment).toFixed(2)
      );
    }
  }

  ngOnInit(): void {
    this.componentInit();
    this.isLoading$ = this.discountFacade.getIsLoading();
    combineLatest([
      this.productFacade
        .getIsABInvokedFirstTime()
        .pipe(takeUntil(this.destroy$)),
      this.productFacade
        .getIsABDiscountsSelected()
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(([isABInvokedFirstTime, isABDiscountsSelected]) => {
      this.isABInvokedFirstTime = isABInvokedFirstTime;
      this.isABDiscountsSelected =
        isABDiscountsSelected.filter(value => !!value).length > 0;
    });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.DIGIGOLD_DIGIGOLD_DISCOUNT_PERCENTAGE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(percentage => {
        if (percentage) {
          this.digiPercentage = Number(percentage);
        }
      });
    this.discountFacade
      .getIsRsoSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSelected => {
        this.isRsoSelected = isSelected;
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemDetails: CashMemoItemDetailsResponse[]) => {
        this.selectedItemsDetails = itemDetails;
      });

    this.productFacade
      .getSpecificItemId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedItem: any) => {
        this.selectedItemId = selectedItem?.id;
      });
    this.profiledatafacade
      .isL3Boutique()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isL3Store => (this.isL3Store = isL3Store));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsAmount => {
        this.tcsToBeCollectedAtCM = tcsAmount;
      });

    this.availabeBillLevelDiscounts$ = this.discountFacade.getAvailableTransactionLevelDiscounts();

    this.appliedDiscounts$ = this.discountFacade.getAppliedTransactionLevelDiscounts();
    this.appliedBillLevelDiscount$ = this.discountFacade.getAppliedBillLevelTransactionLevelDiscounts();
    this.appliedEmployeeDiscount$ = this.discountFacade.getAppliedEmployeeLevelDiscounts();
    this.appliedTsssDiscount$ = this.discountFacade.getAppliedTSSSLevelDiscounts();
    this.appliedTataEmployeeDiscount$ = this.discountFacade.getAppliedTataEmployeeLevelDiscounts();
    this.appliedSystemDvDiscount$ = this.discountFacade.getAppliedSystemDvDiscounts();

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.discountFacade
      .getAppliedSystemDvDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response && response.length && this.discountType === 'SYSTEM_DV') {
          this.discountType = 'SYSTEM_DV';
        }
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCustomerSelected => {
        this.selectedCustomer = isCustomerSelected;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PARTIAL_CM_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          if (
            this.selectedCustomer &&
            this.discountVoucherDetails &&
            this.availabeSystemDvDiscounts.length !== 0
          ) {
            this.applyDiscountVoucherDiscount(this.discountVoucherDetails);
          }
        }
      });

    this.discountFacade
      .getDigiDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: DiscountTransactionLevelResponse) => {
        if (data) {
          const modifiedEligibleItem: DiscountTransactionLevelResponse = {
            discountCode: data.discountCode,
            discountType: data.discountType,
            discountId: data.discountId,
            discountValue: this.getDiscountValue(),
            discountValueDetails: {
              type: 'DISCOUNT_VALUE_DETAILS',
              discountValueDetails: [
                {
                  component: 'BILL_DISCOUNT',
                  discountPercent: 0,
                  discountValue: this.getDiscountValue(),
                  isDiscountPercentage: false
                }
              ]
            },
            isEdited: false,
            refPaymentId: this.isLoadDigiGoldDiscFromCN
              ? this.getCreditNotePaymentId()
              : this.refPaymentId
          };
          this.discountFacade.applyKaratOrCoinOfferDiscount({
            discountType: data.discountType,
            subTxnType: this.subTransactionType,
            transactionId: this.cashMemoId,
            txnType: this.transactionType,
            requestBody: {
              discountDetails: [modifiedEligibleItem]
            }
          });
        }
      });

    this.discountFacade
      .getGrnMultipleDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: DiscountTransactionLevelResponse) => {
        if (data) {
          // const modifiedEligibleItem: DiscountTransactionLevelResponse = {
          //   discountCode: data.discountCode,
          //   discountType: data.discountType,
          //   discountId: data.discountId,
          //   discountValue: this.getDiscountValue(),
          //   discountValueDetails: {
          //     type: 'DISCOUNT_VALUE_DETAILS',
          //     discountValueDetails: [
          //       {
          //         component: 'BILL_DISCOUNT',
          //         discountPercent: 0,
          //         discountValue: this.getDiscountValue(),
          //         isDiscountPercentage: false
          //       }
          //     ]
          //   },
          //   isEdited: false,
          //   refPaymentId: this.isLoadDigiGoldDiscFromCN
          //     ? this.getCreditNotePaymentId()
          //     : this.refPaymentId
          // };
          this.discountFacade.applyTransactionLevelDiscounts({
            discountType: 'GRN_MULTIPLE_DISCOUNT',
            subTxnType: this.subTransactionType,
            transactionId: this.cashMemoId,
            txnType: this.transactionType,
            requestBody: {
              discountDetails: [
                {
                  discountCode: data.discountCode,
                  discountType: data.discountType,
                  discountId: data.discountId,
                  discountValue: Number(
                    this.grnMultipleDiscountObject.discountValue.toFixed(2)
                  ),
                  isEdited: false,
                  refPaymentId: this.getCreditNotePaymentId()
                }
              ]
            }
          });
          // this.discountFacade.applyKaratOrCoinOfferDiscount({
          //   discountType: data.discountType,
          //   subTxnType: this.subTransactionType,
          //   transactionId: this.cashMemoId,
          //   txnType: this.transactionType,
          //   requestBody: {
          //     discountDetails: [modifiedEligibleItem]
          //   }
          // });
        }
      });

    this.discountFacade
      .getAvailableSystemDvDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availabeSystemDvDiscounts = data ? data : [];
        this.addStopTracking('pw.instrumentationMessges.dvDiscMsg');
      });
    this.discountFacade
      .getIsRefresh()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRefresh: boolean) => {
        if (isRefresh) {
          this.reset();
          this.discountFacade.setRefreshDiscountsAndOffersPanel(false);
        }
      });
    this.appliedDiscounts$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.appliedDiscounts = res;
      this.appliedBillLevelDiscount = this.appliedDiscounts.filter(
        data => data.discountType === 'BILL_LEVEL_DISCOUNT'
      );
      this.appliedKaratOfferDiscount = this.appliedDiscounts.filter(
        data => data.discountType === 'KARAT_EXCHANGE_OFFER_DISCOUNT'
      );
      this.appliedCoinOfferDiscount = this.appliedDiscounts.filter(
        data => data.discountType === 'COIN_OFFER_DISCOUNT'
      );
      this.appliedSystemDiscountGepPurity = this.appliedDiscounts.filter(
        data => data.discountType === 'SYSTEM_DISCOUNT_GEP_PURITY'
      );
      this.appliedSystemDvDiscounts = this.appliedDiscounts.filter(
        data => data.discountType === 'SYSTEM_DISCOUNT_DV'
      );
      this.appliedGrnMultipleDiscount = this.appliedDiscounts.filter(
        data => data.discountType === 'GRN_MULTIPLE_DISCOUNT'
      );
      this.appliedSystemGhsBonusDiscounts = this.appliedDiscounts.filter(
        data =>
          data.discountType === 'SYSTEM_DISCOUNT_GHS_BONUS' ||
          data.discountType === DiscountTypeEnum.DIGI_GOLD_DISCOUNT
      );
      this.appliedEmpowermentDiscounts = this.appliedDiscounts.filter(
        data => data.discountType === 'EMPOWERMENT_DISCOUNT'
      );
    });
    this.discountFacade
      .getIsLoadingAvailableDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        //TODO pass to bill levle
        if (data) {
          // this.discountFacade
          //   .getAvailableEmployeeDiscounts()
          //   .pipe(takeUntil(this.destroy$))
          //   .subscribe(data => {
          //     console.log('1111111111111', data);
          //   });
        }
      });
    this.discountFacade
      .getAvailableEmployeeDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.employeeDiscountCheck(data);
        }
      });
    this.discountFacade
      .getAvailableTsssDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.tsssDiscountCheck(data);
        }
      });
    this.discountFacade
      .getAvailableTataEmployeeDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.tataEmployeeDiscountCheck(data);
        }
      });
    this.discountFacade
      .getAvailableEmpowermentDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.empowermentDiscountCheck(data);
        }
      });
    this.discountFacade
      .getTataCompanyList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.tataCompanyList = data;
        }
      });
    this.discountFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.discountFacade.resetAppliedKaratOrCoinOfferDiscount();
          this.discountFacade.resetEligibleItemsForDiscountIds();
          this.errorHandler(error);
        }
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          this.discountType = null;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        if (this.discountType !== 'SYSTEM_DV') {
          this.discountType = null;
          this.onTabChanged(0);
        } else if (this.discountType === 'SYSTEM_DV') {
          this.onTabChanged(5);
        }
        this.cashMemoId = transactionID;
        this.discountFacade.clearTransactionLevelDiscountDetails();
        if (transactionID) {
          this.loadAppliedTransactionLevelDiscounts();
        }
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          this.transactionType = transactionConfig.transactionType?.type;
          this.subTransactionType = transactionConfig.transactionType?.subType;
          this.loadAppliedTransactionLevelDiscounts();
        }
      });

    this.discountFacade
      .getOrderDiscDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.cashMemoDiscountDetails = data?.discountDetails;
        this.appliedEmployeeCouponCode = this.cashMemoDiscountDetails?.data?.employeeDetails?.couponDetails[0]?.couponCode;
        this.appliedRivahCouponCode = this.cashMemoDiscountDetails?.data?.rivaahCardDetails?.couponCode;
        this.appliedTsssCouponCode = this.cashMemoDiscountDetails?.data?.tsssDetails?.couponDetails[0]?.couponCode;
        this.appliedTataEmployeeDiscountDetails = this.cashMemoDiscountDetails?.data?.tataEmployeeDetails;
        this.appliedEmpowermentDiscountDetails = this.cashMemoDiscountDetails?.data?.empowermentDetails?.applyEmpowermentDiscount;
        this.employeeDetails = this.cashMemoDiscountDetails?.data?.employeeDetails;
        this.tsssDetails = this.cashMemoDiscountDetails?.data?.tsssDetails;
        this.tataEmployeeDetails = this.cashMemoDiscountDetails?.data?.tataEmployeeDetails;
        this.empowermentDetails = this.cashMemoDiscountDetails?.data?.empowermentDetails;

        if (
          this.cashMemoDiscountDetails?.data?.rivaahGhsDiscountDetails
            ?.isRivaahDiscountApplicable
        )
          this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
        else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);

        if (this.appliedEmployeeCouponCode)
          this.addStopTracking('pw.instrumentationMessges.employeeDiscMsg');
        if (this.appliedTataEmployeeDiscountDetails)
          this.addStopTracking('pw.instrumentationMessges.tataEmployeeDiscMsg');
        if (this.appliedEmpowermentDiscountDetails)
          this.addStopTracking('pw.instrumentationMessges.empowermentDiscMsg');
        if (this.appliedTsssCouponCode)
          this.addStopTracking('pw.instrumentationMessges.tsssDiscMsg');
      });

    this.paymentFacade
      .getCreditNotePaymentToBeDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedCreditNotePaymentToBeDeleted: PaymentDetails) => {
        if (selectedCreditNotePaymentToBeDeleted) {
          this.selectedCreditNotePaymentToBeDeleted = selectedCreditNotePaymentToBeDeleted;
          console.log(
            'selectedCreditNotePaymentToBeDeleted',
            this.selectedCreditNotePaymentToBeDeleted
          );
          this.paymentFacade.loadDiscountIdsInCreditNote(
            this.selectedCreditNotePaymentToBeDeleted.reference3
          );
        }
      });

    this.paymentFacade
      .getDigiGoldPayment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newPayment: PaymentDetails) => {
        if (newPayment?.paymentCode === PaymentModeEnum.DIGI_GOLD_TANISHQ) {
          this.curentDigiGoldPayment = newPayment.amount;
          this.refPaymentId = newPayment.id;
          this.isLoadDigiGoldDiscFromCN = false;
          this.discountFacade.loadDigiGoldDiscounts({
            businessDate: this.bussinessDay,
            discountType: DiscountTypeEnum.DIGI_GOLD_DISCOUNT
          });
        }
      });

    this.paymentFacade
      .getCreditNotePaymentToBeAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNotePayment: CreditNotePayment) => {
        if (creditNotePayment) {
          this.addedCreditNotePayment = creditNotePayment;
          // this.paymentFacade.resetSelectedCreditNotePaymentToBeAdded();
        }
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        this.paymentDetails = paymentDetails;
        console.log('PaymentDetails :', paymentDetails);
        if (paymentDetails.length > 0) {
          // this.refPaymentId = paymentDetails[paymentDetails.length - 1].id;
          this.tcsPaymentDetail = this.paymentDetails.find(
            value => value.isTcsPayment === true
          );
          this.creditNoteRedeemedAmount =
            paymentDetails[paymentDetails.length - 1].amount;
          this.curentDigiGoldPayment = this.creditNoteRedeemedAmount;
          this.creditNoteActualAmount =
            paymentDetails[
              paymentDetails.length - 1
            ].otherDetails?.data?.cnAmount;
        }
      });

    this.paymentFacade
      .getCreditNotePaymentAddedField()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCreditNoteAdded => {
        if (
          isCreditNoteAdded &&
          this.paymentDetails.length > 0 &&
          !this.paymentDetails.find(
            x => x.reference3 === this.addedCreditNotePayment.payload.reference3
          )?.otherDetails.data.isDiscountPresent
        ) {
          this.paymentFacade.loadCreditNoteDetail(
            this.addedCreditNotePayment.payload.reference3
          );
          this.paymentFacade.resetCreditNotePaymentAddedField();
        }
      });
    this.paymentFacade
      .getCreditNotePaymentAddedRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(creditNotePayment => {
        if (creditNotePayment) {
          let rivaahGHSCNPaymentDetail =
            creditNotePayment?.otherDetails?.data?.discountType ===
            DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
              ? creditNotePayment
              : null;
          if (
            rivaahGHSCNPaymentDetail &&
            rivaahGHSCNPaymentDetail?.otherDetails?.data
              ?.isRivaahDiscountApplicable
          )
            this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
          else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
        }
      });

    this.paymentFacade
      .getCreditNoteDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNoteDetail: CreditNoteDetail) => {
        if (creditNoteDetail) {
          this.selectedCreditNote = creditNoteDetail;
          console.log('Selected Credit Note :', this.selectedCreditNote);
          const discountIdsList = [];
          const bestDiscountInCoinOffer = null;
          let bestDiscountInKaratOffer = null;
          let bestDiscount = null;
          let itemDetails = [];
          if (
            this.selectedItemsDetails &&
            this.selectedItemsDetails.length > 0
          ) {
            itemDetails = this.selectedItemsDetails.map(itemDetail => {
              return {
                itemCode: itemDetail.itemDetails.itemCode,
                itemId: itemDetail.itemDetails.itemId,
                lotNumber: itemDetail.itemDetails.lotNumber,
                productCategoryCode: itemDetail.itemDetails.productCategoryCode,
                productGroupCode: itemDetail.itemDetails.productGroupCode
              };
            });
          }
          if (
            this.selectedCreditNote.creditNoteType ===
              ConfigTypeEnum.DIGI_GOLD_TANISHQ ||
            this.selectedCreditNote?.discountDetails?.data?.digiGoldDiscount
          ) {
            this.isLoadDigiGoldDiscFromCN = true;
            this.discountFacade.loadDigiGoldDiscounts({
              businessDate: this.bussinessDay,
              discountType: DiscountTypeEnum.DIGI_GOLD_DISCOUNT
            });
          }
          if (
            this.selectedCreditNote.discountDetails &&
            this.selectedCreditNote.discountDetails.data &&
            this.selectedCreditNote.discountDetails.data.gepPurityDiscount &&
            !this.selectedCreditNote.discountDetails.data.gepPurityDiscount
              .length
          ) {
            // if (
            //   this.selectedCreditNote.discountDetails &&
            //   this.selectedCreditNote.discountDetails.data &&
            //   this.selectedCreditNote.discountDetails.data.coinOfferDiscount &&
            //   this.selectedCreditNote.discountDetails.data.coinOfferDiscount
            //     .length
            // ) {
            //   bestDiscountInCoinOffer = this.selectedCreditNote.discountDetails.data.coinOfferDiscount.sort(
            //     (a, b) => {
            //       return Number(b.discountValue) - Number(a.discountValue);
            //     }
            //   )[0];
            // }
            if (
              this.selectedCreditNote.discountDetails &&
              this.selectedCreditNote.discountDetails.data &&
              this.selectedCreditNote.discountDetails.data
                .karatageExchangeDiscount &&
              this.selectedCreditNote.discountDetails.data
                .karatageExchangeDiscount.length
            ) {
              bestDiscountInKaratOffer = this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount.sort(
                (a, b) => {
                  return (
                    Number(b.oneKTDiscountValue + b.twoKTDiscountValue) -
                    Number(a.oneKTDiscountValue + a.twoKTDiscountValue)
                  );
                }
              )[0];
            }
            if (bestDiscountInCoinOffer && bestDiscountInKaratOffer) {
              if (
                Number(bestDiscountInKaratOffer.oneKTDiscountValue) +
                  Number(bestDiscountInKaratOffer.twoKTDiscountValue) >
                Number(bestDiscountInCoinOffer.discountValue)
              ) {
                bestDiscount = bestDiscountInKaratOffer;
              } else {
                bestDiscount = bestDiscountInCoinOffer;
              }
            } else if (!bestDiscountInCoinOffer && bestDiscountInKaratOffer) {
              bestDiscount = bestDiscountInKaratOffer;
            } else if (!bestDiscountInKaratOffer && bestDiscountInCoinOffer) {
              bestDiscount = bestDiscountInCoinOffer;
            }
            discountIdsList.push(bestDiscount.discountId);
            if (discountIdsList.length) {
              const requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload = {
                // businessDate: moment(this.bussinessDay).format('YYYY-MM-DD'),
                businessDate: this.bussinessDay,
                itemDetails: itemDetails,
                discountIds: discountIdsList
              };
              this.discountFacade.loadEligibleItemsForDiscountIds(
                bestDiscount.discountType,
                requestPayload
              );
            }
          } else {
            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data.karatageExchangeDiscount &&
              creditNoteDetail.discountDetails.data.karatageExchangeDiscount
                .length > 0
            ) {
              const karatDiscountIdsList = [];
              creditNoteDetail.discountDetails.data.karatageExchangeDiscount.forEach(
                karatDiscount => {
                  karatDiscountIdsList.push(karatDiscount.discountId);
                }
              );
              if (karatDiscountIdsList.length) {
                const requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload = {
                  // businessDate: moment(this.bussinessDay).format('YYYY-MM-DD'),
                  businessDate: this.bussinessDay,
                  itemDetails: itemDetails,
                  discountIds: karatDiscountIdsList
                };
                this.discountFacade.loadEligibleItemsForDiscountIds(
                  DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
                  requestPayload
                );
              }
            }
            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data.coinOfferDiscount &&
              creditNoteDetail.discountDetails.data.coinOfferDiscount.length > 0
            ) {
              const coinOfferDiscountList = [];
              creditNoteDetail.discountDetails.data.coinOfferDiscount.forEach(
                coinOfferDiscount => {
                  coinOfferDiscountList.push(coinOfferDiscount.discountId);
                }
              );
              if (coinOfferDiscountList.length) {
                const requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload = {
                  // businessDate: moment(this.bussinessDay).format('YYYY-MM-DD'),
                  businessDate: this.bussinessDay,
                  itemDetails: itemDetails,
                  discountIds: coinOfferDiscountList
                };
                this.discountFacade.loadEligibleItemsForDiscountIds(
                  DiscountTypeEnum.COIN_OFFER_DISCOUNT,
                  requestPayload
                );
              }
            }

            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data.gepPurityDiscount &&
              creditNoteDetail.discountDetails.data.gepPurityDiscount.length > 0
            ) {
              // const gepConfigId =
              //   creditNoteDetail.discountDetails.data.gepPurityDiscount[0]
              //     .configId;

              const gepConfigId = creditNoteDetail.gepConfigDetailsId;

              const gepPurity =
                creditNoteDetail.discountDetails.data.gepPurityDiscount[0]
                  .gepItemPurity;

              this.gepPurityDiscountObject =
                creditNoteDetail.discountDetails.data.gepPurityDiscount[0];

              if (gepConfigId) {
                const requestPayload: GepPurityConfigIdEligibleItemsRequestPayload = {
                  // businessDate: moment(this.bussinessDay).format('YYYY-MM-DD'),
                  businessDate: this.bussinessDay,
                  itemDetails: itemDetails,
                  gepConfigDetailsId: gepConfigId,
                  gepPurity
                };
                this.discountFacade.loadEligibleItemsForGepPurityOffer(
                  requestPayload
                );
              }
            }

            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data?.ghsAccountDiscount &&
              creditNoteDetail.discountDetails.data?.ghsAccountDiscount
                .discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS
            ) {
              this.ghsAccountDiscountObject =
                creditNoteDetail.discountDetails.data.ghsAccountDiscount;
              this.discountFacade.applyTransactionLevelDiscounts({
                discountType: DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS,
                subTxnType: this.subTransactionType,
                transactionId: this.cashMemoId,
                txnType: this.transactionType,
                requestBody: {
                  discountDetails: [
                    {
                      discountCode: this.ghsAccountDiscountObject.discountCode,
                      discountType: this.ghsAccountDiscountObject.discountType,
                      discountId: this.ghsAccountDiscountObject.discountId,
                      discountValue: Number(
                        this.ghsAccountDiscountObject.discountValue.toFixed(2)
                      ),
                      isEdited: false,
                      refPaymentId: this.getCreditNotePaymentId()
                    }
                  ]
                }
              });
            }

            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data?.systemDiscountDv &&
              creditNoteDetail.discountDetails.data?.systemDiscountDv
                .discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_DV
            ) {
              this.systemDiscountDvObject =
                creditNoteDetail.discountDetails.data.systemDiscountDv;
              this.discountFacade.applyTransactionLevelDiscounts({
                discountType: DiscountTypeEnum.SYSTEM_DISCOUNT_DV,
                subTxnType: this.subTransactionType,
                transactionId: this.cashMemoId,
                txnType: this.transactionType,
                requestBody: {
                  discountDetails: [
                    {
                      discountCode: this.systemDiscountDvObject.discountCode,
                      discountType: this.systemDiscountDvObject.discountType,
                      discountId: this.systemDiscountDvObject.discountId,
                      discountValue: Number(
                        this.systemDiscountDvObject.discountValue.toFixed(2)
                      ),
                      isEdited: false,
                      refPaymentId: this.getCreditNotePaymentId()
                    }
                  ]
                }
              });
            }

            if (
              creditNoteDetail.discountDetails &&
              creditNoteDetail.discountDetails.data &&
              creditNoteDetail.discountDetails.data?.grnMultipleDiscount &&
              creditNoteDetail.discountDetails.data?.grnMultipleDiscount
                .discountType === 'GRN_MULTIPLE_DISCOUNT'
            ) {
              this.discountFacade.loadGrnMultipleDiscounts({
                businessDate: this.bussinessDay,
                discountType: 'GRN_MULTIPLE_DISCOUNT'
              });
              this.grnMultipleDiscountObject =
                creditNoteDetail.discountDetails.data.grnMultipleDiscount;
              // this.discountFacade.applyTransactionLevelDiscounts({
              //   discountType: 'GRN_MULTIPLE_DISCOUNT',
              //   subTxnType: this.subTransactionType,
              //   transactionId: this.cashMemoId,
              //   txnType: this.transactionType,
              //   requestBody: {
              //     discountDetails: [
              //       {
              //         discountCode: this.grnMultipleDiscountObject.discountCode,
              //         discountType: this.grnMultipleDiscountObject.discountType,
              //         discountId: this.grnMultipleDiscountObject.discountId,
              //         discountValue: Number(
              //           this.grnMultipleDiscountObject.discountValue.toFixed(2)
              //         ),
              //         isEdited: false,
              //         refPaymentId: this.getCreditNotePaymentId()
              //       }
              //     ]
              //   }
              // });
            }
          }

          // if (discountIdsList.length) {
          //   const requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload = {
          //     businessDate: moment(this.bussinessDay).format('YYYY-MM-DD'),
          //     itemDetails: itemDetails,
          //     discountIds: discountIdsList
          //   };
          //   this.discountFacade.loadEligibleItemsForDiscountIds(
          //     bestDiscount.discountType,
          //     requestPayload
          //   );
          // }
          this.paymentFacade.resetCreditNoteDetail();
        }
        this.paymentFacade.resetCreditNoteDetail();
      });

    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error && error.code !== ErrorEnums.ERR_SALE_008) {
          this.paymentFacade.resetCreditNoteDetail();
          this.paymentFacade.resetSelectedCreditNotePaymentToBeDeleted();
          this.paymentFacade.resetDiscountIdsInCreditNote();
        }
      });

    this.discountFacade
      .getEligibleItemsResponseForKaratOrCoinOffer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((eligibleItemResponse: any) => {
        if (eligibleItemResponse) {
          if (
            eligibleItemResponse.eligibleItemDetails &&
            eligibleItemResponse.eligibleItemDetails[0] &&
            eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            // eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            //   .basicCriteriaDetails &&
            // eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            //   .discountType === 'COIN_OFFER_DISCOUNT'
          ) {
            let minimumCnUtilizationAmount = 0;
            if (
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .discountType === 'COIN_OFFER_DISCOUNT' &&
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .basicCriteriaDetails
            ) {
              minimumCnUtilizationAmount =
                (eligibleItemResponse.eligibleItemDetails[0]
                  .discountConfigDetails.basicCriteriaDetails
                  .tepCNUtilizationPercent *
                  this.creditNoteActualAmount) /
                100;
            } else if (
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .discountType === 'KARAT_EXCHANGE_OFFER_DISCOUNT' &&
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .exchangeConfigDetails &&
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .exchangeConfigDetails.data &&
              eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
                .exchangeConfigDetails.data.minCNUtilizationPercent
            ) {
              minimumCnUtilizationAmount =
                (+eligibleItemResponse.eligibleItemDetails[0]
                  .discountConfigDetails.exchangeConfigDetails.data
                  .minCNUtilizationPercent *
                  this.creditNoteActualAmount) /
                100;
            }

            if (this.creditNoteRedeemedAmount < minimumCnUtilizationAmount) {
              if (
                eligibleItemResponse.eligibleItemDetails[0]
                  .discountConfigDetails.discountType === 'COIN_OFFER_DISCOUNT'
              ) {
                // this.showNotifications(
                //   `Coin Offer Discount in Credit note could not be applied as the minimum CN utilization is ${eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails.basicCriteriaDetails.tepCNUtilizationPercent}% of Credit note amount.`
                // );
                this.showNotifications(
                  `Coin Offer Discount in Credit note will be given only when the CN is fully redeemed.`
                );
              } else if (
                eligibleItemResponse.eligibleItemDetails[0]
                  .discountConfigDetails.discountType ===
                'KARAT_EXCHANGE_OFFER_DISCOUNT'
              ) {
                // this.showNotifications(
                //   `Karat Exchange Offer Discount in Credit note could not be applied as the minimum CN utilization is ${eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails.exchangeConfigDetails.data.minCNUtilizationPercent}% of Credit note amount.`
                // );
                this.showNotifications(
                  `Karat Exchange Offer Discount in Credit note will be given only when the CN is fully redeemed.`
                );
              }
            } else {
              this.applyKaratOrCoinOfferDiscount(eligibleItemResponse);
            }
          } else {
            this.showNotifications(`Discount config details is not available.`);
          }
        }
      });

    this.discountFacade
      .getEligibleItemsResponseForGepPurityOfferOffer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (eligibleItemResponse: GepPurityConfigIdEligibleItemsResponse) => {
          if (eligibleItemResponse) {
            console.log(
              'eligibleItemResponse For Gep Purity :',
              eligibleItemResponse
            );
            if (
              eligibleItemResponse.eligibleItemDetails[0].gepConfigDetails[0]
                .gepConfigDetails.data.gepAsPayment === false
            ) {
              // let discountTransactionLevelList = [];

              // discountTransactionLevelList = eligibleItemResponse.eligibleItemDetails.map(
              // eligibleItem => {
              console.log(
                'gepPurityDiscountObject :',
                this.gepPurityDiscountObject
              );
              let gepPurityDiscountTotalValue = 0;
              this.selectedCreditNote.discountDetails.data.gepPurityDiscount.forEach(
                gepPurityDiscountItem => {
                  gepPurityDiscountTotalValue =
                    gepPurityDiscountTotalValue +
                    gepPurityDiscountItem.discountValue;
                }
              );
              const modifiedEligibleItem: DiscountTransactionLevelResponse = {
                discountCode: this.gepPurityDiscountObject.discountCode,
                discountType: this.gepPurityDiscountObject.discountType,
                discountId: this.gepPurityDiscountObject.discountId,
                discountValue: Number(gepPurityDiscountTotalValue.toFixed(2)),
                isEdited: false,
                itemDetails: this.gepPurityDiscountObject.itemDetails,
                refPaymentId: this.getCreditNotePaymentId() //this.refPaymentId
              };
              //     return modifiedEligibleItem;
              //   }
              // );
              this.discountFacade.applyKaratOrCoinOfferDiscount({
                discountType: this.gepPurityDiscountObject.discountType,
                subTxnType: this.subTransactionType,
                transactionId: this.cashMemoId,
                txnType: this.transactionType,
                // hasDiscounts: this.appliedBillLevelDiscount.length,
                requestBody: {
                  discountDetails: [modifiedEligibleItem]
                }
              });
              // this.discountFacade.resetEligibleItemsForDiscountIds();
              this.discountFacade.resetEligibleItemsForGepPurityOffer();
            }
          }
        }
      );

    this.paymentFacade
      .getDiscountIdsInCreditNote()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discountIdsInCreditNote: string[]) => {
        console.log('Discount IDs in Credit Note ...', discountIdsInCreditNote);
        if (
          discountIdsInCreditNote.length &&
          !discountIdsInCreditNote.includes('NA')
        ) {
          const deletableDiscountIds = [];
          this.appliedKaratOfferDiscount.forEach(discount => {
            if (discount && discount.discountId) {
              if (discountIdsInCreditNote.includes(discount.discountId)) {
                deletableDiscountIds.push(discount);
              }
            }
          });
          console.log(
            'APPIED COIN OFFER DISCOUNT :',
            this.appliedCoinOfferDiscount
          );
          this.appliedCoinOfferDiscount.forEach(discount => {
            if (discount && discount.discountId) {
              if (discountIdsInCreditNote.includes(discount.discountId)) {
                deletableDiscountIds.push(discount);
              }
            }
          });
          console.log(
            'APPIED SYSTEM DISCOUNT GEP PURITY :',
            this.appliedSystemDiscountGepPurity
          );
          this.appliedSystemDiscountGepPurity.forEach(discount => {
            if (discount && discount.discountId) {
              if (discountIdsInCreditNote.includes(discount.discountId)) {
                deletableDiscountIds.push(discount);
              }
            }
          });
          this.appliedSystemDvDiscounts.forEach(discount => {
            if (
              discount &&
              discount.discountId &&
              discount.discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_DV
            ) {
              if (discountIdsInCreditNote.includes(discount.discountId)) {
                deletableDiscountIds.push(discount);
              }
            }
          });
          this.appliedGrnMultipleDiscount.forEach(discount => {
            if (
              discount &&
              discount.discountId &&
              discount.discountType === 'GRN_MULTIPLE_DISCOUNT'
            ) {
              deletableDiscountIds.push(discount);
            }
          });
          this.appliedSystemGhsBonusDiscounts.forEach(discount => {
            if (
              discount &&
              discount.discountId &&
              discount.discountType ===
                DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS
            ) {
              if (discountIdsInCreditNote.includes(discount.discountId)) {
                deletableDiscountIds.push(discount);
              }
            }
          });
          if (deletableDiscountIds.length) {
            console.log('DELETABLE DISCOUNT IDS :', deletableDiscountIds);
            this.deleteAppliedKaratOfferDiscounts(deletableDiscountIds[0]);
          } else {
            this.paymentFacade.deletePayment({
              paymentId: this.selectedCreditNotePaymentToBeDeleted.id,
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType
            });
            this.selectedCreditNotePaymentToBeDeleted = null;
          }

          this.paymentFacade.resetDiscountIdsInCreditNote();
        } else if (discountIdsInCreditNote.includes('NA')) {
          this.paymentFacade.deletePayment({
            paymentId: this.selectedCreditNotePaymentToBeDeleted.id,
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType
          });
          this.selectedCreditNotePaymentToBeDeleted = null;
          this.paymentFacade.resetDiscountIdsInCreditNote();
        }
      });

    this.discountFacade
      .getDeletedDiscount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RemoveAppliedTransactionLevelDiscountByIDPayload) => {
        if (data?.discountType === DiscountTypeEnum.DIGI_GOLD_DISCOUNT) {
          this.paymentDetails
            .filter(x => x.id.toUpperCase() === data.referenceId.toUpperCase())
            .forEach(x => {
              this.paymentFacade.deletePayment(
                {
                  paymentId: x.id,
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType
                },
                x
              );
            });
        }
      });

    this.discountFacade
      .getDiscountVoucherDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: DiscountVoucherDetailsResponePayload) => {
        console.log(
          'DATA IN GET DISCOUNT VOUCHER DETAILS SUBSCRIBE METHOD :',
          data
        );
        this.discountVoucherDetails = data;
        if (data) {
          this.customerFacade.loadSelectedCustomer(
            String(data.customerId),
            true,
            true
          );
        }
      });

    this.availabeBillLevelDiscounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data)
          this.addStopTracking('pw.instrumentationMessges.billLevelDiscMsg');
      });
  }

  getCreditNotePaymentId(): string {
    let creditNotePaymentId = '';
    const creditNotePaymentObject = this.paymentDetails.filter(
      paymentDetail => {
        return (
          Number(paymentDetail.instrumentNo) ===
            this.selectedCreditNote?.docNo &&
          Number(paymentDetail.reference2) ===
            this.selectedCreditNote?.fiscalYear
        );
      }
    );
    creditNotePaymentId =
      creditNotePaymentObject &&
      creditNotePaymentObject[0] &&
      creditNotePaymentObject[0].id
        ? creditNotePaymentObject[0].id
        : '';
    console.log('CREDIT NOTE PAYMENT ID :', creditNotePaymentId);
    return creditNotePaymentId;
  }

  componentInit() {
    this.paymentFacade
      .getIsAddGhsPaymentSuccess()
      .pipe(
        withLatestFrom(this.paymentFacade.getGhsResponse()),
        takeUntil(this.destroy$)
      )
      .subscribe(([val1, val2]) => {
        if (
          val1 &&
          val2?.instrumentType === PaymentModeEnum.RIVAAH_ACCOUNT &&
          (val2?.otherDetails?.data?.discountMcPct > 0 ||
            val2?.otherDetails?.data?.discountUcpPct > 0)
        ) {
          if (val2?.otherDetails?.data?.isRivaahDiscountApplicable)
            this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
          else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
        }
      });

    this.discountFacade
      .getRivaahGHSDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.discountFacade.saveRivaahGHSDiscounts({
            discountType: DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
            subTxnType: this.subTransactionType,
            transactionId: this.cashMemoId,
            txnType: this.transactionType,
            requestBody: {
              discountDetails:
                data.clubDiscountDetails && data.clubDiscountDetails.length
                  ? data.clubDiscountDetails
                  : data.discountDetails && data.discountDetails.length
                  ? data.discountDetails
                  : [],
              employeeDetails: {
                couponDetails: [
                  {
                    couponCode: this.selectedEmployeeCouponCode
                      ? this.selectedEmployeeCouponCode
                      : null
                  }
                ]
              },
              empowermentDetails: this.empowermentDetails
                ? this.empowermentDetails
                : null,
              tataEmployeeDetails: this.tataEmployeeDetails
                ? this.tataEmployeeDetails
                : null,
              tsssDetails: this.tsssDetails ? this.tsssDetails : null
            }
          });
        }
      });

    this.discountFacade
      .getEnableCalculateRivaahGHSDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.enableCalculateRivaahGhsDiscount = data;
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFocus']) {
      if (
        (this.setFocus === 3 &&
          this.subTransactionType === SubTransactionTypeEnum.NEW_CM) ||
        (this.setFocus === 4 &&
          this.subTransactionType === SubTransactionTypeEnum.MANUAL_CM)
      ) {
        this.pannel.open();
        setTimeout(() => {
          this.viewButton.nativeElement.focus();
        }, 100);
      }
    }
  }

  deleteAppliedKaratOfferDiscounts(discountDetailToBeDeleted: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message:
          'Discounts applied from this Credit Note will also be deleted. Do you want to continue ?'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          // const removeAllAppliedTransactionLevelDiscountsPayload: RemoveAllAppliedTransactionLevelDiscountsPayload = {
          //   discountType: discountDetailToBeDeleted.discountType,
          //   txnType: this.transactionType,
          //   subTxnType: this.subTransactionType,
          //   transactionId: this.cashMemoId
          // };

          const removeAppliedTransactionLevelDiscountByIDPayload: RemoveAppliedTransactionLevelDiscountByIDPayload = {
            discountType: discountDetailToBeDeleted.discountType,
            txnType: this.transactionType,
            subTxnType: this.subTransactionType,
            transactionId: this.cashMemoId,
            discountId: discountDetailToBeDeleted.discountTxnId
          };
          console.log('discountDetailToBeDeleted :', discountDetailToBeDeleted);
          console.log(
            'removeAppliedTransactionLevelDiscountByIDPayload :',
            removeAppliedTransactionLevelDiscountByIDPayload
          );
          // this.discountFacade.removeAllAppliedTransactionLevelDiscounts(
          //   removeAllAppliedTransactionLevelDiscountsPayload
          // );
          this.discountFacade.removeSelectedTransactionLevelDiscount(
            removeAppliedTransactionLevelDiscountByIDPayload
          );
        } else {
          this.paymentFacade.resetDiscountIdsInCreditNote();
          this.paymentFacade.resetSelectedCreditNotePaymentToBeDeleted();
        }
      });
  }

  createDiscountValueDetailsObject(
    discountId: string,
    creditNoteDetail: CreditNoteDetail
  ) {
    let discountValueDetailsObject = null;
    if (
      creditNoteDetail.discountDetails &&
      creditNoteDetail.discountDetails.data &&
      creditNoteDetail.discountDetails.data.karatageExchangeDiscount
    ) {
      const discountDetail = creditNoteDetail.discountDetails.data.karatageExchangeDiscount.filter(
        karatDiscount => {
          return karatDiscount.discountId === discountId;
        }
      );
      if (discountDetail.length > 0) {
        discountValueDetailsObject = {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: {
            discountValueDetails: [
              {
                component: 'KARATAGE_DISCOUNT_1KT',
                discountPercent: null,
                // discountValue: discountDetail[0].oneKTDiscountValue.toString(),
                discountValue: Number(
                  (
                    (Number(
                      (
                        (this.creditNoteRedeemedAmount /
                          this.creditNoteActualAmount) *
                        100
                      ).toFixed(2)
                    ) *
                      Number(discountDetail[0].oneKTDiscountValue)) /
                    100
                  ).toFixed(2)
                ).toString(),
                isDiscountPercentage: false
              },
              {
                component: 'KARATAGE_DISCOUNT_2KT',
                discountPercent: null,
                // discountValue: discountDetail[0].twoKTDiscountValue.toString(),
                discountValue: Number(
                  (
                    (Number(
                      (
                        (this.creditNoteRedeemedAmount /
                          this.creditNoteActualAmount) *
                        100
                      ).toFixed(2)
                    ) *
                      Number(discountDetail[0].twoKTDiscountValue)) /
                    100
                  ).toFixed(2)
                ).toString(),
                isDiscountPercentage: false
              }
            ]
          }
        };
      }
      return discountValueDetailsObject;
    }
  }

  // createPayload(creditNoteDetail: CreditNoteDetail) {
  //   return {
  //     discountId: creditNoteDetail.discountDetails.data.karatageExchangeDiscount[0].discountId,
  //     discountType: creditNoteDetail.discountDetails.data.karatageExchangeDiscount[0].discountType,
  //     // discountValue:
  //     //   discount.isBillValue === true ? discount.selectedDiscountValue : 0,
  //     discountCode: creditNoteDetail.discountDetails.data.karatageExchangeDiscount[0].discountCode,
  //     discountValueDetails: {
  //       type: 'DISCOUNT_VALUE_DETAILS',
  //       data: {
  //         discountValueDetails: [
  //           {
  //             component: 'BILL_DISCOUNT',
  //             discountPercent:
  //               discount.isBillValue !== true
  //                 ? discount.selectedDiscountValue
  //                 : null,
  //             discountValue:
  //               discount.isBillValue === true
  //                 ? discount.selectedDiscountValue
  //                 : null,
  //             isDiscountPercentage: discount.isBillValue ? false : true
  //           }
  //         ]
  //       }
  //     },
  //     isEdited: discount.ucpValue !== discount.selectedDiscountValue
  //   };
  // }
  onTabChanged(newDiscountIndex: number) {
    this.reset();
    // if (this.discountType !== newDiscount) {
    if (newDiscountIndex === 0) {
      this.discountType = 'BILL_LEVEL';
      this.addStartTracking('pw.instrumentationMessges.billLevelDiscMsg');
      this.discountFacade.loadAvailableTransactionLevelDiscounts({
        businessDate: this.bussinessDay,
        discountType: 'BILL_LEVEL_DISCOUNT'
      });
    } else if (newDiscountIndex === 2) {
      this.discountType = 'TATA_EMPLOYEE';
      this.discountFacade.loadTataCompanyList(TATA_COMPANY_LIST_PAYLOAD);
    } else if (newDiscountIndex === 4) {
      this.discountType = 'SYSTEM_DV';
      this.discountFacade.loadAvailableSystemDvDiscount({
        businessDate: this.bussinessDay,
        discountType: 'SYSTEM_DISCOUNT_DV'
      });
    }
    // }
  }
  applyBillLevelDiscount(data: any) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else if (
      this.isRsoSelected === false &&
      this.appliedBillLevelDiscount.length === 0
    ) {
      this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
    } else {
      this.discountFacade.applyTransactionLevelDiscounts({
        discountType: 'BILL_LEVEL_DISCOUNT',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType,
        hasDiscounts: this.appliedBillLevelDiscount.length,
        requestBody: {
          discountDetails: data
        }
      });
    }
  }

  loadAvailableEmployeeDiscount(couponCode: string) {
    this.employeeDetails = {
      couponDetails: [
        {
          couponCode: couponCode
        }
      ]
    };
    this.addStartTracking('pw.instrumentationMessges.employeeDiscMsg');
    this.selectedEmployeeCouponCode = couponCode;
    this.discountFacade.loadAvailableEmployeeDiscounts({
      businessDate: this.bussinessDay,
      discountType: 'EMPLOYEE_DISCOUNT',
      employeeDetails: {
        couponDetails: [
          {
            couponCode: couponCode
          }
        ]
      },
      itemDetails: this.getSelectedProductDetails()
    });
  }
  employeeDiscountCheck(
    availableEmployeeDiscounts: DiscountTransactionLevelResponse[]
  ) {
    if (availableEmployeeDiscounts.length === 0) {
      this.showNoDiscountsAvailableForCouponMsg(
        'No Discounts Available for Selected Coupon Code'
      );
    } else {
      let hasItemDetails = false;
      for (const discount of availableEmployeeDiscounts) {
        if (discount?.itemDetails?.length > 0) {
          hasItemDetails = true;
          break;
        }
      }
      if (hasItemDetails) {
        this.applyEmployeeDiscount(availableEmployeeDiscounts);
      } else {
        this.showNoItemsEligibleForCouponMsg(
          'No Items for Selected Coupon Code'
        );
      }
    }
  }
  applyEmployeeDiscount(
    availableEmployeeDiscounts: DiscountTransactionLevelResponse[]
  ) {
    const applicableEmployeeDiscount = availableEmployeeDiscounts.filter(
      data => data?.itemDetails && data?.itemDetails.length > 0
    );
    this.discountFacade.applyTransactionLevelDiscounts({
      discountType: 'EMPLOYEE_DISCOUNT',
      subTxnType: this.subTransactionType,
      transactionId: this.cashMemoId,
      txnType: this.transactionType,
      hasDiscounts: false,
      requestBody: {
        discountDetails: this.createEmployeeDiscountDetailsPayload(
          applicableEmployeeDiscount
        ),
        employeeDetails: {
          couponDetails: [
            {
              couponCode: this.selectedEmployeeCouponCode
            }
          ]
        },
        empowermentDetails: this.empowermentDetails
          ? this.empowermentDetails
          : null,
        tataEmployeeDetails: this.tataEmployeeDetails
          ? this.tataEmployeeDetails
          : null,
        tsssDetails: this.tsssDetails ? this.tsssDetails : null
      }
    });
  }

  applyRivaah(value: string) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.applyTransactionLevelDiscounts({
        discountType: DiscountTypeEnum.RIVAAH_CARD_DISCOUNT,
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType,
        hasDiscounts: false,
        requestBody: {
          discountDetails: [
            {
              discountCode: 'RIVAAH',
              discountId: this.cashMemoId,
              discountType: DiscountTypeEnum.RIVAAH_CARD_DISCOUNT
            }
          ],
          rivaahCardDetails: {
            couponCode: value
          }
        }
      });
    }
  }
  createEmployeeDiscountDetailsPayload(
    discounts: DiscountTransactionLevelResponse[]
  ) {
    const payload = [];
    discounts.forEach(details => {
      payload.push({
        discountCode: details.discountCode,
        discountId: details.discountId,
        discountType: details.discountType,
        itemDetails: details.itemDetails
      });
    });
    return payload;
  }
  removeAppliedEmployeeDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
        discountType: 'EMPLOYEE_DISCOUNT',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }

  removeAppliedRivaahDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
        discountType: DiscountTypeEnum.RIVAAH_CARD_DISCOUNT,
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }

  loadAvailableEmpowermentDiscount(value: boolean) {
    this.empowermentDetails = {
      applyEmpowermentDiscount: value
    };
    this.addStartTracking('pw.instrumentationMessges.empowermentDiscMsg');
    this.isEmpowermentDiscountSelected = value;
    this.discountFacade.loadAvailableEmpowermentDiscount({
      businessDate: this.bussinessDay,
      discountType: 'EMPOWERMENT_DISCOUNT',
      empowermentDetails: {
        applyEmpowermentDiscount: value
      },
      itemDetails: this.getSelectedProductDetails()
    });
  }
  empowermentDiscountCheck(
    availableEmpowermentDiscounts: DiscountTransactionLevelResponse[]
  ) {
    if (availableEmpowermentDiscounts.length === 0) {
      this.showNoDiscountsAvailableForCouponMsg(
        'Empowerment Discount Not Available'
      );
    } else {
      let hasItemDetails = false;
      for (const discount of availableEmpowermentDiscounts) {
        if (discount?.itemDetails?.length > 0) {
          hasItemDetails = true;
          break;
        }
      }
      if (hasItemDetails) {
        this.applyEmpowermentDiscount(availableEmpowermentDiscounts);
      } else {
        this.showNoItemsEligibleForCouponMsg(
          'No Items for Eligible for Empowerment Discount'
        );
      }
    }
  }
  applyEmpowermentDiscount(
    availableEmpowermentDiscounts: DiscountTransactionLevelResponse[]
  ) {
    const applicableEmpowermentDiscount = availableEmpowermentDiscounts.filter(
      data => data?.itemDetails && data?.itemDetails.length > 0
    );
    this.discountFacade.applyTransactionLevelDiscounts({
      discountType: 'EMPOWERMENT_DISCOUNT',
      subTxnType: this.subTransactionType,
      transactionId: this.cashMemoId,
      txnType: this.transactionType,
      hasDiscounts: false,
      requestBody: {
        discountDetails: this.createEmployeeDiscountDetailsPayload(
          applicableEmpowermentDiscount
        ),
        empowermentDetails: {
          applyEmpowermentDiscount: this.isEmpowermentDiscountSelected
        },
        employeeDetails: this.employeeDetails ? this.employeeDetails : null,
        tsssDetails: this.tsssDetails ? this.tsssDetails : null,
        tataEmployeeDetails: this.tataEmployeeDetails
          ? this.tataEmployeeDetails
          : null
      }
    });
  }
  removeAppliedEmpowermentDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
        discountType: 'EMPOWERMENT_DISCOUNT',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }

  removeAppliedTSSSDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
        discountType: 'TSSS_DISCOUNT',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }

  loadAvailableTsssDiscount(couponCode: string) {
    this.tsssDetails = {
      couponDetails: [
        {
          couponCode: couponCode
        }
      ]
    };
    this.addStartTracking('pw.instrumentationMessges.tsssDiscMsg');
    this.selectedTsssCouponCode = couponCode;
    this.discountFacade.loadAvailableTsssDiscounts({
      businessDate: this.bussinessDay,
      discountType: 'TSSS_DISCOUNT',
      tsssDetails: {
        couponDetails: [
          {
            couponCode: couponCode
          }
        ]
      },
      itemDetails: this.getSelectedProductDetails()
    });
  }
  tsssDiscountCheck(
    availableTsssDiscounts: DiscountTransactionLevelResponse[]
  ) {
    if (availableTsssDiscounts.length === 0) {
      this.showNoDiscountsAvailableForCouponMsg(
        'No Discounts Available for Selected Coupon Code'
      );
    } else {
      let hasItemDetails = false;
      for (const discount of availableTsssDiscounts) {
        if (discount?.itemDetails?.length > 0) {
          hasItemDetails = true;
          break;
        }
      }
      if (hasItemDetails) {
        this.applyTsssDiscount(availableTsssDiscounts);
      } else {
        this.showNoItemsEligibleForCouponMsg(
          'No Items for Selected Coupon Code'
        );
      }
    }
  }
  applyTsssDiscount(
    availableTsssDiscounts: DiscountTransactionLevelResponse[]
  ) {
    const applicableTsssDiscount = availableTsssDiscounts.filter(
      data => data?.itemDetails && data?.itemDetails.length > 0
    );
    this.discountFacade.applyTransactionLevelDiscounts({
      discountType: 'TSSS_DISCOUNT',
      subTxnType: this.subTransactionType,
      transactionId: this.cashMemoId,
      txnType: this.transactionType,
      hasDiscounts: false,
      requestBody: {
        discountDetails: this.createEmployeeDiscountDetailsPayload(
          applicableTsssDiscount
        ),
        tsssDetails: {
          couponDetails: [
            {
              couponCode: this.selectedTsssCouponCode
            }
          ]
        },
        empowermentDetails: this.empowermentDetails
          ? this.empowermentDetails
          : null,
        employeeDetails: this.employeeDetails ? this.employeeDetails : null,
        tataEmployeeDetails: this.tataEmployeeDetails
          ? this.tataEmployeeDetails
          : null
      }
    });
  }
  //////////////////////////////////////

  loadAvailableTataEmployeeDiscount(payload: any) {
    this.tataEmployeeDetails = payload;
    this.addStartTracking('pw.instrumentationMessges.tataEmployeeDiscMsg');
    this.selectedTataEmployeeDiscountDetails = payload;
    this.discountFacade.loadAvailableTataEmployeeDiscounts({
      businessDate: this.bussinessDay,
      discountType: 'TATA_EMPLOYEE_DISCOUNT',
      tataEmployeeDetails: payload,
      itemDetails: this.getSelectedProductDetails()
    });
  }
  tataEmployeeDiscountCheck(
    availableEmployeeDiscounts: DiscountTransactionLevelResponse[]
  ) {
    if (availableEmployeeDiscounts.length === 0) {
      this.showNoDiscountsAvailableForCouponMsg('No Discounts Available');
    } else {
      let hasItemDetails = false;
      for (const discount of availableEmployeeDiscounts) {
        if (discount?.itemDetails?.length > 0) {
          hasItemDetails = true;
          break;
        }
      }
      if (hasItemDetails) {
        this.applyTataEmployeeDiscount(availableEmployeeDiscounts);
      } else {
        this.showNoItemsEligibleForCouponMsg(
          'No Items Eligible for Tata Employee Discount'
        );
      }
    }
  }
  applyTataEmployeeDiscount(
    availableEmployeeDiscounts: DiscountTransactionLevelResponse[]
  ) {
    const applicableEmployeeDiscount = availableEmployeeDiscounts.filter(
      data => data?.itemDetails && data?.itemDetails.length > 0
    );
    this.discountFacade.applyTransactionLevelDiscounts({
      discountType: 'TATA_EMPLOYEE_DISCOUNT',
      subTxnType: this.subTransactionType,
      transactionId: this.cashMemoId,
      txnType: this.transactionType,
      hasDiscounts: false,
      requestBody: {
        discountDetails: this.createEmployeeDiscountDetailsPayload(
          applicableEmployeeDiscount
        ),
        tataEmployeeDetails: this.selectedTataEmployeeDiscountDetails,
        employeeDetails: this.employeeDetails ? this.employeeDetails : null,
        empowermentDetails: this.empowermentDetails
          ? this.empowermentDetails
          : null,
        tsssDetails: this.tsssDetails ? this.tsssDetails : null,
        rivaahGhsDetails: this.cashMemoDiscountDetails?.data
          ?.rivaahGhsDiscountDetails
          ? this.cashMemoDiscountDetails?.data?.rivaahGhsDiscountDetails
          : null
      }
    });
  }
  removeAppliedTataEmployeeDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
        discountType: 'TATA_EMPLOYEE_DISCOUNT',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }
  //Discount Voucher
  loadDiscountVoucherDetails(event: DiscountVoucherDetailsRequestPayload) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      console.log('LOAD DISCOUNT VOUCHER details method :', event);
      this.discountFacade.loadAvailableSystemDvDiscount({
        businessDate: this.bussinessDay,
        discountType: 'SYSTEM_DISCOUNT_DV'
      });
      this.addStartTracking('pw.instrumentationMessges.dvDiscMsg');
      this.discountFacade.loadDiscountVoucherDetails(event);
    }
  }
  applyDiscountVoucherDiscount(
    discountDetails: DiscountVoucherDetailsResponePayload
  ) {
    console.log('APPLY DISOCUNT VOUCHER METHOD CALLED :', discountDetails);
    if (this.isRsoSelected === false) {
      console.log('IF CONDITION CALLED');
      this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
    } else {
      console.log('ELSE CONDITION CLD');
      this.discountFacade.applyTransactionLevelDiscounts({
        discountType: 'SYSTEM_DISCOUNT_DV',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType,
        hasDiscounts: false,
        requestBody: {
          discountDetails: [
            {
              discountCode: this.availabeSystemDvDiscounts[0]?.discountCode,
              discountId: this.availabeSystemDvDiscounts[0]?.discountId,
              discountType: this.availabeSystemDvDiscounts[0]?.discountType,
              discountValue: discountDetails.discountAmount,
              isEdited: true,
              discountValueDetails: {
                data: discountDetails,
                type: 'SYSTEM_DISCOUNT_DV'
              }
            }
          ],
          ghsDiscountDetails: {
            accountNo: discountDetails.accountNo.toString(),
            discountTxnId: discountDetails.id,
            isSameCustomer: true,
            redeemStatus: discountDetails.status,
            voucherNo: discountDetails.voucherNo.toString()
          }
        }
      });
    }
  }
  removeDvDiscount(discountTxnId: string) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.removeSelectedTransactionLevelDiscount({
        discountId: discountTxnId,
        discountType: 'SYSTEM_DISCOUNT_DV',
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }
  getSelectedProductDetails() {
    this.selectedItemDetailsPayload = [];
    this.selectedItemsDetails.forEach(item => {
      this.selectedItemDetailsPayload.push({
        makingChargePerGram:
          item.itemDetails.priceDetails?.makingChargeDetails?.makingChargePgram,
        complexityPercent:
          item.itemDetails.priceDetails?.makingChargeDetails?.wastagePct,
        itemCode: item.itemDetails.itemCode,
        lotNumber: item.itemDetails.lotNumber,
        itemId: item?.itemDetails?.itemId ? item.itemDetails.itemId : null,
        productCategoryCode: item?.itemDetails?.productCategoryCode
          ? item.itemDetails.productCategoryCode
          : null,
        productGroupCode: item?.itemDetails?.productGroupCode
          ? item.itemDetails.productGroupCode
          : null
      });
    });
    return this.selectedItemDetailsPayload;
  }
  openViewAllBillLevelDiscountsPopup() {
    const dialogRef = this.dialog.open(ViewTransactionLevelDiscountsComponent, {
      width: '776px',
      // height: 'auto',
      data: {
        billLevelDiscounts: this.appliedBillLevelDiscount,
        appliedCoinOfferDiscount: this.appliedCoinOfferDiscount,
        appliedKaratOfferDiscount: this.appliedKaratOfferDiscount,
        ghsDVDiscount: this.appliedSystemDvDiscounts,
        ghsBonusDiscount: this.appliedSystemGhsBonusDiscounts,
        appliedSystemDiscountGepPurity: this.appliedSystemDiscountGepPurity
      },
      disableClose: true
    });
  }
  showNotifications(key: string) {
    const selectErrorkey = key;
    this.translate
      .get(selectErrorkey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.reset();
          });
      });
  }
  showNoDiscountsAvailableForCouponMsg(key: string) {
    const selectErrorkey = key;
    // this.translate
    //   .get(selectErrorkey)
    //   .pipe(take(1))
    //   .subscribe((translatedMsg: any) => {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message: key,
        // message: 'No Discounts Available for Selected Coupon Code',
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.reset();
      });
  }
  showNoItemsEligibleForCouponMsg(key: string) {
    const selectErrorkey = key;
    // this.translate
    //   .get(selectErrorkey)
    //   .pipe(take(1))
    //   .subscribe((translatedMsg: any) => {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message: key,
        // message: 'No Items for Selected Coupon Code',
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.reset();
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_ENG_040) {
      if (this.selectedItemsDetails.length > 0) {
        const selectedItem = this.selectedItemsDetails.find(
          val => val.itemId === this.selectedItemId
        );
        if (selectedItem) {
          if (
            selectedItem?.itemDetails?.discountDetails?.data
              ?.validDiscountDetails[DiscountTypeEnum.SLAB_BASED_DISCOUNT]
              ?.isExclude === true ||
            selectedItem?.itemDetails?.discountDetails?.data
              ?.validDiscountDetails[DiscountTypeEnum.HIGH_VALUE_DISCOUNT]
              ?.isExclude === true
          ) {
            this.discountFacade.saveExcludeSlabItemDiscount({
              subTxnType: this.subTransactionType,
              transactionId: this.cashMemoId,
              txnType: this.transactionType,
              itemId: this.selectedItemId
            });
          }
        }
        console.log(this.selectedItemsDetails, 'this.selectedItemsDetails');
      }
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          this.reset();
        });
    }
  }
  loadAppliedTransactionLevelDiscounts() {
    if (this.cashMemoId && this.transactionType && this.subTransactionType) {
      this.discountFacade.loadAppliedTransactionLevelDiscounts({
        subTxnType: this.subTransactionType,
        transactionId: this.cashMemoId,
        txnType: this.transactionType
      });
    }
  }
  reset() {
    this.resetForm$.next(true);
  }

  confirmPopupToApplyEmpowermentDiscount(event: any) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else if (this.isABInvokedFirstTime && this.isABDiscountsSelected) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discount.abDiscountRefreshMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.loadAvailableEmpowermentDiscount(event);
          } else {
            this.reset();
          }
        });
    } else {
      this.loadAvailableEmpowermentDiscount(event);
    }
  }

  confirmPopupToApplyEmployeeDiscount(event: any) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else if (this.isABInvokedFirstTime && this.isABDiscountsSelected) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discount.abDiscountRefreshMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.loadAvailableEmployeeDiscount(event);
          } else {
            this.reset();
          }
        });
    } else {
      this.loadAvailableEmployeeDiscount(event);
    }
  }

  confirmPopupToApplyTataEmployeeDiscount(event: any) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else if (this.isABInvokedFirstTime && this.isABDiscountsSelected) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discount.abDiscountRefreshMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.loadAvailableTataEmployeeDiscount(event);
          } else {
            this.reset();
          }
        });
    } else {
      this.loadAvailableTataEmployeeDiscount(event);
    }
  }

  confirmPopupToApplyTsssDiscount(event: any) {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else if (this.isABInvokedFirstTime && this.isABDiscountsSelected) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discount.abDiscountRefreshMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.loadAvailableTsssDiscount(event);
          } else {
            this.reset();
          }
        });
    } else {
      this.loadAvailableTsssDiscount(event);
    }
  }

  applyKaratOrCoinOfferDiscount(eligibleItemResponse) {
    console.log('INSIDE APPLY KARAT OR COIN OFFER DISCOUNT');
    let discountTransactionLevelList = [];
    discountTransactionLevelList = eligibleItemResponse.eligibleItemDetails.map(
      eligibleItem => {
        let discountDetail: any;
        let coinOfferDiscountValue: any;
        if (
          this.selectedCreditNote.discountDetails.data &&
          this.selectedCreditNote.discountDetails.data.coinOfferDiscount
        ) {
          discountDetail = this.selectedCreditNote.discountDetails.data.coinOfferDiscount.filter(
            coinOfferDiscount => {
              return (
                coinOfferDiscount.discountId ===
                eligibleItem.discountConfigDetails.discountId
              );
            }
          );

          if (discountDetail && discountDetail.length > 0) {
            coinOfferDiscountValue = Number(
              (
                (Number(
                  (
                    (this.creditNoteRedeemedAmount /
                      this.creditNoteActualAmount) *
                    100
                  ).toFixed(2)
                ) *
                  Number(discountDetail[0].discountValue)) /
                100
              ).toFixed(2)
            );
            console.log('COIN OFFER DISCOUNT VALUE :', coinOfferDiscountValue);
          }
        }
        const modifiedEligibleItem: DiscountDetail = {
          discountCode: eligibleItem.discountConfigDetails.discountCode,
          discountType: eligibleItem.discountConfigDetails.discountType,
          discountId: eligibleItem.discountConfigDetails.discountId,
          isEdited: false,
          itemDetails: eligibleItem.itemDetails,
          discountValue:
            eligibleItem.discountConfigDetails.discountType ===
            'COIN_OFFER_DISCOUNT'
              ? // ? Number(discountDetail[0].discountValue)
                coinOfferDiscountValue
              : 0,
          refPaymentId: this.getCreditNotePaymentId(), //this.refPaymentId
          discountValueDetails: this.createDiscountValueDetailsObject(
            eligibleItem.discountConfigDetails.discountId,
            this.selectedCreditNote
          )
        };
        return modifiedEligibleItem;
      }
    );

    console.log(
      'DISCOUNT TRANSACTION LEVEL LIST :',
      discountTransactionLevelList
    );

    if (
      discountTransactionLevelList &&
      discountTransactionLevelList.length &&
      discountTransactionLevelList[0].itemDetails &&
      discountTransactionLevelList[0].itemDetails.length > 0
    ) {
      if (
        eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType === 'KARAT_EXCHANGE_OFFER_DISCOUNT'
      ) {
        this.karatExchangeOfferEligibleItems =
          discountTransactionLevelList[0].itemDetails;
      } else if (
        eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType === 'COIN_OFFER_DISCOUNT'
      ) {
        this.coinOfferEligibleItems =
          discountTransactionLevelList[0].itemDetails;
      }
      const coinOfferDiscountValueInCreditNote =
        this.selectedCreditNote.discountDetails.data.coinOfferDiscount &&
        this.selectedCreditNote.discountDetails.data.coinOfferDiscount.length >
          0
          ? Number(
              this.selectedCreditNote.discountDetails.data.coinOfferDiscount[0]
                .discountValue
            )
          : 0;
      let oneKtDiscountValueInCreditNote =
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount &&
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount
          .length > 0
          ? Number(
              this.selectedCreditNote.discountDetails.data
                .karatageExchangeDiscount[0].oneKTDiscountValue
            )
          : 0;
      let twoKtDiscountValueInCreditNote =
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount &&
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount
          .length > 0
          ? Number(
              this.selectedCreditNote.discountDetails.data
                .karatageExchangeDiscount[0].twoKTDiscountValue
            )
          : 0;

      console.log(
        'this.karatExchangeOfferEligibleItems :',
        this.karatExchangeOfferEligibleItems
      );
      if (
        eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType === 'COIN_OFFER_DISCOUNT' &&
        this.karatExchangeOfferEligibleItems.length === 0
      ) {
        oneKtDiscountValueInCreditNote = 0;
        twoKtDiscountValueInCreditNote = 0;
      }
      console.log(
        'DISCOUNT TYPE :',
        eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType
      );
      if (
        (eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType === 'COIN_OFFER_DISCOUNT' &&
          coinOfferDiscountValueInCreditNote > oneKtDiscountValueInCreditNote &&
          coinOfferDiscountValueInCreditNote >
            twoKtDiscountValueInCreditNote) ||
        (eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
          .discountType === 'KARAT_EXCHANGE_OFFER_DISCOUNT' &&
          (oneKtDiscountValueInCreditNote >
            coinOfferDiscountValueInCreditNote ||
            twoKtDiscountValueInCreditNote >
              coinOfferDiscountValueInCreditNote))
      ) {
        this.discountFacade.applyKaratOrCoinOfferDiscount({
          discountType:
            eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
              .discountType,
          subTxnType: this.subTransactionType,
          transactionId: this.cashMemoId,
          txnType: this.transactionType,
          // hasDiscounts: this.appliedBillLevelDiscount.length,
          requestBody: {
            discountDetails: discountTransactionLevelList
          }
        });
        if (
          eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            .discountType === 'COIN_OFFER_DISCOUNT'
        ) {
          this.karatExchangeOfferEligibleItems = [];
          this.coinOfferEligibleItems = [];
        }
      }
    } else {
      if (
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount &&
        this.selectedCreditNote.discountDetails.data.karatageExchangeDiscount
          .length > 0 &&
        this.selectedCreditNote.discountDetails.data.coinOfferDiscount &&
        this.selectedCreditNote.discountDetails.data.coinOfferDiscount.length >
          0
      ) {
        if (
          eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            .discountType === 'KARAT_EXCHANGE_OFFER_DISCOUNT'
        ) {
          this.karatExchangeOfferEligibleItems = [];
        } else if (
          eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            .discountType === 'COIN_OFFER_DISCOUNT'
        ) {
          this.coinOfferEligibleItems = [];
        }
        if (
          eligibleItemResponse.eligibleItemDetails[0].discountConfigDetails
            .discountType === 'COIN_OFFER_DISCOUNT' &&
          this.karatExchangeOfferEligibleItems.length === 0 &&
          this.coinOfferEligibleItems.length === 0
        ) {
          this.showNotifications(
            'As per the configuration, added items in product grid are not eligible for the discount available in credit note.'
          );
        }
      } else {
        this.showNotifications(
          'As per the configuration, added items in product grid are not eligible for the discount available in credit note.'
        );
      }
    }
    // this.refPaymentId = '';
    this.discountFacade.resetEligibleItemsForDiscountIds();
  }

  calculateRivaahGhsDiscount() {
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      this.tcsPaymentDetail
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !this.tcsPaymentDetail
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.discountFacade.loadRivaahGHSDiscounts({
        businessDate: this.bussinessDay,
        itemDetails: [],
        discountType: DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
      });
    }
  }

  resetTcsAmountPopup() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        this.reset();
        if (res) {
          this.commonFacade.setTcsTcsAmountNeedToReset(true);
        }
      });
  }

  deleteTcsAmountPopup() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.payment.deleteTcsPaymentLabel'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.reset();
      });
  }

  // Instrmentation
  addStartTracking(actionName) {
    const key1 = 'pw.instrumentationMessges.billLevelMsg';
    this.translate
      .get([key1, actionName])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.startTracking(
          translatedMsgs[key1] + ' - ' + translatedMsgs[actionName]
        );
      });
  }

  calculateDiscount() {
    this.paymentDetails.forEach(payment => {
      if (payment.otherDetails.data.isDiscountPresent) {
        this.paymentFacade.loadCreditNoteDetail(payment.reference3);
      }
    });
  }

  isEnableCalculateDiscount(): boolean {
    return this.paymentDetails.some(
      x => x?.otherDetails?.data?.isDiscountPresent
    );
  }

  addStopTracking(actionName) {
    const key1 = 'pw.instrumentationMessges.billLevelMsg';
    this.translate
      .get([key1, actionName])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.stopTracking(
          translatedMsgs[key1] + ' - ' + translatedMsgs[actionName]
        );
      });
  }

  getBadgeNumber(subTxnType) {
    if (subTxnType === SubTransactionTypeEnum.NEW_CM) return 3;
    else if (subTxnType === SubTransactionTypeEnum.MANUAL_CM) return 4;
  }

  ngOnDestroy(): void {
    this.discountFacade.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
