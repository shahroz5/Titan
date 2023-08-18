import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CODetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CommonCOEnum,
  CustomErrors,
  Customers,
  CustomerServiceAbstraction,
  CUSTOMER_TYPE_ENUM,
  DiscountsResponse,
  FreezeRateEnum,
  LocationSettingAttributesEnum,
  Lov,
  MetalPrice,
  NomineeDetails,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PanCardPopupAbstraction,
  PaymentDetails,
  PaymentModeEnum,
  PaymentStatusEnum,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateOrderDetails
} from '@poss-web/shared/models';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { CustomerOrderFacade } from '@poss-web/poss/customer-order/data-access-co';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { getCustomerOrderNewUrl } from '@poss-web/shared/util-site-routes';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import * as moment from 'moment';
import { Moment } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

@Component({
  selector: 'poss-web-new-customer-order',
  templateUrl: './new-customer-order.component.html',
  styleUrls: ['./new-customer-order.component.scss']
})
export class NewCustomerOrderComponent implements OnInit, OnDestroy {
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CO,
    subTxnType: SubTransactionTypeEnum.NEW_CO,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  summaryBarRemarks$ = new Subject<string>();
  isLoggedIn: boolean;
  customerOrderId = null;
  isLoading$: Observable<boolean>;
  CODetailsRes = null;
  businessDate: Moment;
  bgrAllowed = false;
  relationshipTypes = [];
  totalGrossWeight = 0;
  totalOrderValue = 0;
  totalQty = 0;
  paidValue = 0;
  finalAmt = 0;
  totalDisc = 0;
  totalTax = 0;
  totalWeight = 0;
  totalAmt = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  refundAmountAsCash = 0;
  metalRate: any;
  destroy$: Subject<null> = new Subject<null>();
  confirmRemarks: any;
  currencyCode: string;
  maxAllowedAmount: number;
  customerType: any;
  form60Submitted: boolean;
  gstNumber: string;
  idProof: string;
  customerPAN: any;
  customerId = null;
  customer: Customers = null;
  minCOValue: number;
  paymentDetails: PaymentDetails[];
  isCnRedeemed: boolean;
  newlyGeneratedCn: any;
  updateGridData = false;
  reloadCOFlag = false;
  isLoadPriceFlag: boolean;
  creditNotePaymentToBeDeleted: PaymentDetails = null;
  isNarrationMandatory = false;
  isLoadingOrder$: Observable<boolean>;
  reloadCustomerForGHS = false;
  enableCalculateRivaahGhsDiscount = false;
  currentCustomerOrderDetailsResponse: CODetailsResponse;
  confirmedCashmemoDoc = 0;
  orderStatus = null;
  creditnote = [];
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  coHoldTimeInMinutes: number;
  isBestGoldRateType: boolean;
  MinCOFrozenAmount: number;
  frozenCO: boolean;
  standardPrice: any;
  status: StatusTypesEnum;
  isLastTransactionPrint = false;

  constructor(
    private toolbarFacade: ToolbarFacade,
    private commonFacade: CommonFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    public customerFacade: CustomerFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customerOrderFacade: CustomerOrderFacade,
    private authFacade: AuthFacade,
    private productFacade: ProductFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    private currencyFormatterService: CurrencyFormatterService,
    private locationSettingsFacade: LocationSettingsFacade,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private orderService: OrderService,
    private discountFacade: DiscountFacade,
    private weightFormatterService: WeightFormatterService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {}

  ngOnInit(): void {
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.clearPage(true);
    this.componentInit();
    this.getCORes();
    this.showSummaryBar();
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const id = this.activatedRoute.snapshot.params['_id'];
        if (id !== 'new') {
          this.clearPage(false);
          this.isLoadPriceFlag = true;
          this.customerOrderFacade.viewCO({
            id: id,
            txnType: TransactionTypeEnum.CO,
            subTxnType: SubTransactionTypeEnum.NEW_CO
          });
          this.commonFacade.setTransactionTD(
            this.activatedRoute.snapshot.params['_id']
          );
        } else this.clearPage(true);
      });

    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      this.clearPage(true);
      this.isLoadPriceFlag = true;
      this.customerOrderFacade.viewCO({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.CO,
        subTxnType: SubTransactionTypeEnum.NEW_CO
      });
      this.commonFacade.setTransactionTD(
        this.activatedRoute.snapshot.params['_id']
      );
    }

    this.discountFacade
      .getIsTransactionLevelDiscountApplied()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.reloadCO();
        }
      });

    this.discountFacade
      .getIsAllAppliedTransactionLevelDiscountsDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted.isDeleted) {
          this.reloadCO();
        }
      });

    this.discountFacade
      .getIsSelectedTransactionLevelDiscountDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted) {
          if (this.creditNotePaymentToBeDeleted) {
            this.paymentFacade.deletePayment({
              paymentId: this.creditNotePaymentToBeDeleted.id,
              transactionType: TransactionTypeEnum.CO,
              subTransactionType: SubTransactionTypeEnum.NEW_CO
            });
            this.creditNotePaymentToBeDeleted = null;
          }
          this.reloadCO();
        }
      });

    this.paymentFacade
      .getCreditNotePaymentToBeDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNotePaymentToBeDeleted: PaymentDetails) => {
        this.creditNotePaymentToBeDeleted = creditNotePaymentToBeDeleted;
      });

    this.discountFacade
      .getAppliedKaratorCoinOfferDiscountResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(appliedDiscount => {
        if (appliedDiscount) {
          this.reloadCO();
        }
      });

    this.discountFacade
      .getAppliedTransactionLevelDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        if (discounts.length > 0) {
          const narrationMandatory = discounts.filter(
            data => data.isNarationMandatory === true
          );
          if (narrationMandatory.length > 0) {
            this.isNarrationMandatory = true;
          } else {
            this.isNarrationMandatory = false;
          }
        }
      });

    this.commonFacade.loadCOStandardMetalPriceDetails();
  }

  componentInit() {
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.CO,
        subType: SubTransactionTypeEnum.NEW_CO
      }
    });
    this.isLoading$ = this.customerOrderFacade.getIsLoading();
    this.customerOrderFacade.loadRelationshipTypes(
      CommonCOEnum.RELATIONSHIP_TYPE
    );

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.CO_HOLD_TIME)
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          this.coHoldTimeInMinutes = Number(configDetails);

          this.commonFacade.setConfigHoldTime(this.coHoldTimeInMinutes);
        }
      });

    this.productFacade
      .getDiscountSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.reloadCO();
        }
      });

    this.discountFacade
      .getIsReloadDiscountsGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReload => {
        if (isReload) {
          this.reloadCO();
          this.discountFacade.loadReloadDiscountsGrid(false);
        }
      });

    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();

    this.paymentFacade
      .getIsAddGhsPaymentSuccess()
      .pipe(
        withLatestFrom(this.paymentFacade.getGhsResponse()),
        takeUntil(this.destroy$)
      )
      .subscribe(([val1, val2]) => {
        if (val1) {
          if (
            (val2?.otherDetails?.data?.isSameCustomerAccount &&
              val2?.otherDetails?.data?.customerId !== this.customerId) ||
            (val2?.instrumentType === PaymentModeEnum.RIVAAH_ACCOUNT &&
              val2?.otherDetails?.data?.isRivaahDiscountApplicable) ||
            (val2?.instrumentType !== PaymentModeEnum.RIVAAH_ACCOUNT &&
              val2?.otherDetails?.data?.bonus !== 0)
          ) {
            this.reloadCustomerForGHS = true;
            this.reloadCO();
          }

          // if (val2?.otherDetails?.data?.isRivaahDiscountApplicable)
          //   this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
          // else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
        }
      });

    this.discountFacade
      .getSaveRivaahGHSDiscountsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (data.length !== 0) {
            this.reloadCO();
          } else {
            this.updateCustomerOrderNotification(
              'pw.discount.noRivaahGhsDiscountsMsg'
            );
            this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
          }
        }
      });

    this.discountFacade
      .getEnableCalculateRivaahGHSDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.enableCalculateRivaahGhsDiscount = data;
      });

    this.customerOrderFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.orderConfirmationFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.productFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });

    // todo: to be changed according to CO Tolerance Impl.
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((offerDetails: any) => {
        if (offerDetails && offerDetails?.data) {
          if (
            moment(this.businessDate) >=
              moment(offerDetails.data.bgrOfferFromDate) &&
            moment(this.businessDate) <=
              moment(offerDetails.data.bgrOfferToDate)
          ) {
            this.bgrAllowed = true;
          }
        } else {
          this.bgrAllowed = false;
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

    this.toolbarFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: MetalPrice[]) => {
        if (data.length !== 0 && this.customerOrderId !== null) {
          this.updatePrice();
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.commonFacade.setTransactionTotalAmount(amt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        this.totalQty = quantity;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_GROSS_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (totalGrossWeight: number) => (this.totalGrossWeight = totalGrossWeight)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_ORDER_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (totalOrderValue: number) => (this.totalOrderValue = totalOrderValue)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.finalAmt = amt;
        this.commonFacade.setTransactionTotalAmount(amt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_DISCOUNT
      )
      .subscribe(disc => {
        this.totalDisc = disc;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tax => {
        this.totalTax = this.currencyRoundOff(tax);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(weight => {
        this.totalWeight = Number(this.weightFormatterService.format(weight));
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.totalAmt = this.currencyRoundOff(amt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.MIN_CO_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.minCOValue = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.CO_ORDER_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.currentCustomerOrderDetailsResponse = {
            ...this.currentCustomerOrderDetailsResponse,
            orderWeightDetails: data
          };
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.MIN_FROZEN_CO_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.MinCOFrozenAmount = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.FROZEN_CO_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.frozenCO = data;
      });

    this.customerOrderFacade
      .getUpdateCORes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CODetailsResponse) => {
        if (data) {
          const successKey1 = 'pw.newCustomerOrder.updateCOSuccessMessage1';

          this.updateHoldCustomerOrderNotification(successKey1, data.docNo);
          this.loadHoldValues();
        }
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CODetailsResponse) => {
        if (data && data.status === StatusTypesEnum.CONFIRMED) {
          this.confirmedCashmemoDoc = data.docNo;
          this.orderStatus = StatusTypesEnum.CONFIRMED;
          this.creditnote = data.creditNotes;
          this.reloadOpenAndHoldValues();
          this.showSuccessMessageNotification();
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkCharges => {
        this.hallmarkCharges = hallmarkCharges;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkDiscount => {
        this.hallmarkDiscount = hallmarkDiscount;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.standardPrice = data;
          this.productFacade.setStandardPrice(data);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });

    this.productFacade
      .getMetalRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.metalRate = data;
        }
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
        this.isCnRedeemed = false;
        this.isCnRedeemed = payments.some(
          x => x.otherDetails?.data?.isRateProtectedCN
        );
        this.newlyGeneratedCn = this.paymentDetails.filter(
          cn =>
            cn.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
            cn.otherDetails.data.newCNNumber !== null
        );
        this.refundAmountAsCash = this.paymentDetails.reduce(
          (sum, b) => sum + b.refundAmount,
          0
        );
      });

    this.paymentFacade
      .getIsGRFCNAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGRFCNAdded: boolean) => {
        if (isGRFCNAdded) {
          this.updatePrice();
          this.updateGridData = true;
          this.paymentFacade.resetIsGRFCNAdded();
        }
      });

    this.paymentFacade
      .getDeletedPayment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PaymentDetails) => {
        if (
          res?.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
          res?.otherDetails?.data?.isRateProtectedCN
        ) {
          this.updatePrice();
          this.updateGridData = true;
        }

        if (
          res?.paymentCode === PaymentModeEnum.GHS_ACCOUNT ||
          res?.otherDetails?.data?.isRivaahGhsDiscountRefresh
        ) {
          this.reloadCO();
        }
      });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerId = customer.customerId;
          this.customer = customer;
          this.customerPAN = customer.custTaxNo;
          this.customerType = customer.customerType;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
        } else {
          this.customerId = null;
          this.customer = null;
          this.customerPAN = null;
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail?.panCardDetails?.data?.configurationAmountForCO;
        }
      });

    this.customerOrderFacade
      .getRelationshipTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((relationshipTypes: Lov[]) => {
        this.relationshipTypes = [];
        if (relationshipTypes.length) {
          relationshipTypes.forEach(element => {
            this.relationshipTypes.push({
              value: element.code,
              description: element.value
            });
          });
        }
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        if (totalValue) {
          this.paidValue = this.currencyRoundOff(totalValue);
        } else {
          this.paidValue = 0;
        }
      });

    this.discountFacade
      .getConfimrationDiscountState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discountStatus => {
        if (discountStatus) {
          discountStatus === PaymentStatusEnum.COMPLETED
            ? this.confirmCustomerOrder(this.confirmRemarks)
            : this.discountsRemoveAlert(discountStatus);
        }
      });
  }

  discountsRemoveAlert(discountType: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message:
          'No Products have availed ' +
          discountType +
          ' discounts, Please Remove ' +
          discountType +
          ' discounts at Order level to Proceed further'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  updatePrice() {
    this.customerOrderFacade.updatePriceDetails({
      id: this.customerOrderId,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO
    });
  }

  reloadCO() {
    if (this.customerOrderId) {
      const tempId = this.customerOrderId;

      this.reloadCOFlag = true;
      this.commonFacade.clearTransactionTD();
      this.customerOrderFacade.viewCO({
        id: tempId,
        txnType: TransactionTypeEnum.CO,
        subTxnType: SubTransactionTypeEnum.NEW_CO
      });
      this.commonFacade.setTransactionTD(tempId);
    }
  }

  confirmCustomerOrder(event) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.customerOrderId,
      orderDetails: {
        customerId: this.customerId,
        metalRateList: this.metalRate,
        finalValue: this.finalAmt,
        otherCharges: null,
        paidValue: this.paidValue,
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: this.currencyRoundOff(this.totalDisc),
        totalQuantity: this.totalQty,

        totalTax: this.totalTax,

        totalWeight: this.totalWeight,
        totalValue: this.totalAmt,

        minValue: this.minCOValue,
        hallmarkCharges: this.currencyRoundOff(this.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(this.hallmarkDiscount)
      },
      status: StatusTypesEnum.CONFIRMED,
      transactionType: TransactionTypeEnum.CO,
      subTransactionType: SubTransactionTypeEnum.NEW_CO
    };

    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetails,
      TransactionTypeEnum.CO
    );

    if (msg) {
      this.updateCustomerOrderNotification(msg);
    }
  }

  getCORes() {
    this.customerOrderFacade
      .getViewCORes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log('view data', data);
          this.CODetailsRes = data;
          // this.discountFacade.clearOrderDiscDetails();
          // this.discountFacade.setOrderDiscDetails(data);
          if (this.reloadCOFlag) {
            if (
              data.status === StatusTypesEnum.HOLD ||
              data.status === StatusTypesEnum.OPEN
            ) {
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                false
              );
            }

            this.productFacade.setItemIDList({
              item: data,
              isUpdate: false,
              isGetHeaderDetails: true
            });
            this.reloadCOFlag = false;
          } else {
            this.currentCustomerOrderDetailsResponse = data;
            this.productFacade.setStandardPrice(
              data?.metalRateList?.metalRates
            );

            this.customerOrderId = data.id;

            this.commonFacade.setTransactionTD(data.id);
            this.commonFacade.setCOOrderNumber({
              orderNo: data.docNo,
              status: data.status
            });

            if (data.status === StatusTypesEnum.HOLD) {
              this.summaryBarRemarks$.next(data.remarks);
              if (data.customerId) {
                this.customerFacade.loadSelectedCustomer(
                  String(data.customerId),
                  false
                );
              }

              if (
                this.isLoadPriceFlag &&
                this.expireTime(data.lastHoldTime) === 'Expired'
              ) {
                this.isLoadPriceFlag = false;
                const goldRateChangeMsg =
                  'Hold time expired. Customer Order will be updated with latest price';
                this.updateCustomerOrderNotification(goldRateChangeMsg);

                this.updatePrice();
              } else {
                this.isLoadPriceFlag = false;
                this.loadItemsInCustomerOrder(data);
              }
            } else if (data.status === StatusTypesEnum.OPEN) {
              if (this.isLoadPriceFlag) {
                this.isLoadPriceFlag = false;
                this.updatePrice();
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId),
                    false
                  );
                }
              } else {
                this.loadItemsInCustomerOrder(data);
              }
            }
          }

          // if (
          //   data.status === StatusTypesEnum.HOLD ||
          //   data.status === StatusTypesEnum.OPEN
          // ) {
          //   this.customerFacade.loadSelectedCustomer(
          //     String(data.customerId),
          //     false
          //   );
          // }
          // this.productFacade.setStandardPrice(data?.metalRateList?.metalRates);
          // this.commonFacade.setTransactionTD(data.id);
          // this.currentCustomerOrderDetailsResponse = data;
          // this.commonFacade.setCOOrderNumber({
          //   orderNo: data.docNo,
          //   status: data.status
          // });

          // this.productFacade.setItemIDList({
          //   item: data,
          //   isUpdate: false,
          //   isGetHeaderDetails: true
          // });
          // this.reloadOpenAndHoldValues(false);
        }
      });

    this.customerOrderFacade
      .getPartialUpdateCORes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.CODetailsRes = data;
          const successKey = 'pw.newCustomerOrder.updateCOSuccessMessage';
          this.updateCustomerOrderNotification(successKey);
        }
      });

    this.customerOrderFacade
      .getMinCOValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.commonFacade.setMinCOValue(data);
      });

    this.customerOrderFacade
      .getMinFrozenCOAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setminFrozenCOVAlue(data);
      });

    this.customerOrderFacade
      .getFrozenCOValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.commonFacade.setFrozenCOVAlue(data);
      });

    this.customerOrderFacade
      .getBestGoldRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isBestGoldRateType = data;
      });

    this.customerOrderFacade
      .getDeleteCORes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const successKey = 'pw.newCustomerOrder.deleteCOSuccessMessage';
          this.deleteCustomerOrderNotification(successKey);
          this.reloadOpenAndHoldValues();
        }
      });
  }

  expireTime(time) {
    const momentTime = moment(time);
    const currentTime = moment();
    const leftOverMinutes = moment().diff(moment(momentTime), 'minutes');

    if (leftOverMinutes <= this.coHoldTimeInMinutes) {
      return currentTime
        .add(this.coHoldTimeInMinutes - leftOverMinutes, 'minutes')
        .format('hh:mm A');
    } else {
      return 'Expired';
    }
  }

  loadItemsInCustomerOrder(data) {
    if (data) {
      this.status = data.status;
      if (!this.updateGridData) this.productFacade.resetItemIdList();
      this.productFacade.setItemIDList({
        item: data,
        isUpdate: this.updateGridData
      });
      this.updateGridData = false;
    }
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.CO, {
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearPage(true);
            this.router.navigate([getCustomerOrderNewUrl()]);
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if(this.customerId !== null){
              let isFormValidated = this.validateCustomerService.validateCustomer(this.customer)
              if(isFormValidated){
                this.confirmRemarks = event;
    
                // if (
                //   this.totalQty !== 0 &&
                //   this.paidValue > this.maxAllowedAmount &&
                //   ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                //     !this.form60Submitted) ||
                //     (this.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME &&
                //       !this.form60Submitted &&
                //       !this.customerPAN) ||
                //     (this.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
                //       !this.gstNumber &&
                //       !this.customerPAN) ||
                //     (this.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
                //       !this.customerPAN &&
                //       !this.idProof))
                // ) {
                //   this.openPanCardPopUp();
                // } else {
                this.confirmCOWithFreezeCheck();
                //  if (this.enableCalculateRivaahGhsDiscount) {
                //   this.calculateRivaahGHSAlert();
                // } else {
                //   this.confirmABWithFreezeCheck();
                // }
                // }
              } else {
                this.customerService.open({customerType: this.customerType, customerId: this.customerId})
              }
            }
            break;
          }
          case SummaryBarEventType.HOLD: {
            if (this.customerId === null) {
              const customerErr = 'pw.regularCashMemo.selectCustomerMsg';
              this.updateCustomerOrderNotification(customerErr);
            } else{
              let isFormValidated = this.validateCustomerService.validateCustomer(this.customer)
              if(isFormValidated){
                if (this.totalQty === 0) {
                  const addItemMessage = 'pw.newCustomerOrder.addItemToGridMessage';
                  this.updateCustomerOrderNotification(addItemMessage);
                } else {
                  this.customerOrderFacade.updateCO({
                    id: this.customerOrderId,
                    status: StatusTypesEnum.HOLD,
    
                    requestDetails: {
                      customerId: this.customerId,
                      metalRateList: this.metalRate,
                      finalValue: this.finalAmt,
                      otherChargesList: null,
                      paidValue: this.paidValue,
                      remarks: event.remarks ? event.remarks : null,
                      totalDiscount: this.currencyRoundOff(this.totalDisc),
                      totalQuantity: this.totalQty,
                      totalTax: this.totalTax,
    
                      totalWeight: this.totalWeight,
                      totalValue: this.totalAmt,
                      hallmarkCharges: this.currencyRoundOff(this.hallmarkCharges),
                      hallmarkDiscount: this.currencyRoundOff(this.hallmarkDiscount)
                    },
                    txnType: TransactionTypeEnum.CO,
                    subTxnType: SubTransactionTypeEnum.NEW_CO
                  });
                }
              }
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.isLastTransactionPrint = true;
            break;
          }
          case SummaryBarEventType.DELETE: {
            if (this.customerOrderId) {
              this.customerOrderFacade.deleteCO({
                id: this.customerOrderId,
                txnType: TransactionTypeEnum.CO,
                subTxnType: SubTransactionTypeEnum.NEW_CO
              });
            }
            break;
          }
        }
      });
  }

  openErrorMsgForOrder(message) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
        }
      });
  }

  confirmCOWithFreezeCheck() {
    if (
      !this.frozenCO &&
      this.MinCOFrozenAmount !== 0 &&
      !this.isBestGoldRateType &&
      this.paidValue >= this.MinCOFrozenAmount
    ) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message:
            'Order is eligible for freezing rate. Do you want to proceed without gold rate Freeze ?'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.confirmCustomerOrder(this.confirmRemarks);
            // this.orderService.ConfirmAllBillLevelDiscounsts(
            //   this.customerOrderId,
            //   TransactionTypeEnum.CO,
            //   SubTransactionTypeEnum.NEW_CO,
            //   null
            // );
          }
        });
    } else {
      this.confirmCustomerOrder(this.confirmRemarks);
      // this.orderService.ConfirmAllBillLevelDiscounsts(
      //   this.customerOrderId,
      //   TransactionTypeEnum.CO,
      //   SubTransactionTypeEnum.NEW_CO,
      //   null
      // );
    }
  }

  clearPage(isClearAll: boolean) {
    if (isClearAll) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearCOProductGrid(true);
    }
    this.customerOrderId = null;
    this.CODetailsRes = null;
    this.totalOrderValue = 0;
    this.totalGrossWeight = 0;
    this.updateGridData = false;
    this.reloadCOFlag = false;
    this.customerOrderFacade.resetCORes();
    this.customerFacade.clearCustomerSearch();
    this.commonFacade.clearCustomerOrder();
    this.commonFacade.setCOOrderNumber({ orderNo: 0, status: null });
    this.reloadCustomerForGHS = false;
    this.confirmedCashmemoDoc = 0;
    this.orderStatus = null;
    this.creditnote = [];
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.reloadOpenAndHoldValues();
    this.orderConfirmationFacade.resetValues();
    this.productFacade.resetValues();
    // this.customerOrderFacade.resetValues();
    this.customerId = null;
    this.customer = null;
    this.customerFacade.clearSelectedCustomer();
    this.overlayNotification.close();
    this.currentCustomerOrderDetailsResponse = null;
    // this.commonFacade.setCOMinCOVAlue(0);
    this.summaryBarRemarks$.next('');
    this.reloadCustomerForGHS = false;
    this.discountFacade.clearOrderDiscDetails();
  }

  addNomineeDetails(event: NomineeDetails) {
    const nomineeDetails = {
      nomineeDetails: {
        data: {
          nomineeName: event.nomineeName,
          address: event.address,
          mobileNumber: event.mobileNumber,
          relationship: event.relationship
        },
        type: CommonCOEnum.NOMINEE_DETAILS
      }
    };

    this.customerOrderFacade.partialUpdateCO({
      id: this.customerOrderId,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      requestDetails: nomineeDetails
    });
  }

  bestRate(event) {
    const request = {
      isBestRate: event,
      isFrozenRate: false
    };
    this.customerOrderFacade.partialUpdateCO({
      id: this.customerOrderId,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      requestDetails: request
    });
  }

  freeze(event) {
    const request = {
      isFrozenRate: event === FreezeRateEnum.YES ? true : false,
      isBestRate: false
    };
    this.customerOrderFacade.partialUpdateCO({
      id: this.customerOrderId,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      requestDetails: request
    });
  }

  prodToBeCollectedBy(event) {
    const request = {
      collectedBy: event
    };
    this.customerOrderFacade.partialUpdateCO({
      id: this.customerOrderId,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      requestDetails: request
    });
  }

  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.clearPage(true);

        this.router.navigate([getCustomerOrderNewUrl()]);
      });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  updateCustomerOrderNotification(successKey: string) {
    this.translate
      .get(successKey)
      .pipe(take(1))
      .subscribe((translatedMessage: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }

  updateHoldCustomerOrderNotification(successKey: string, docNo?: number) {
    this.translate
      .get(successKey)
      .pipe(take(1))
      .subscribe((translatedMessage: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage + docNo,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.clearPage(true);
              this.router.navigate([getCustomerOrderNewUrl()]);
            }
          });
      });
  }

  deleteCustomerOrderNotification(successKey: string) {
    this.translate
      .get(successKey)
      .pipe(take(1))
      .subscribe((translatedMessage: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.clearPage(true);
              this.router.navigate([getCustomerOrderNewUrl()]);
            }
          });
      });
  }

  reloadOpenAndHoldValues(holdReload = true) {
    this.loadOpenValues();
    if (holdReload) this.loadHoldValues();
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      pageIndex: 0,
      pageSize: 10
    });
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  expireNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.updatePrice();
              this.isLoadPriceFlag = false;
            }
          });
      });
  }

  printError(msg) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: msg,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (!this.isLastTransactionPrint) this.showSuccessMessageNotification();
      });
  }

  openConfirmDialogForPayment(customerDependentPayments?: []) {
    const message1 = 'pw.regularCashMemo.customerDependentErrorMsg1';
    const message2 = 'pw.regularCashMemo.customerDependentErrorMsg2';

    this.translate
      .get([message1, message2])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.INFO,
          message:
            translatedMsgs[message1] +
            customerDependentPayments +
            translatedMsgs[message2]
        });
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_SALE_045) {
      const key = 'pw.regularCashMemo.holdExpiredMsg';
      this.expireNotifications(key);
    } else if (error.code === ErrorEnums.ERR_SALE_008) {
      const key = 'pw.regularCashMemo.metalRateChangedMsg';
      this.expireNotifications(key);
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else if (error.code === ErrorEnums.ERR_SALE_084) {
      this.openConfirmDialogForPayment(error.dynamicValues?.paymentCodes);
      this.commonFacade.setCMErrorInUpdatePrice(true);
      this.productFacade.resetItemIdList();
      this.productFacade.setItemIDList({
        item: this.currentCustomerOrderDetailsResponse,
        isUpdate: false
      });
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({customerType: this.customerType, customerId: this.customerId})
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.orderStatus === StatusTypesEnum.CONFIRMED) {
            this.showSuccessMessageNotification();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.clearPage(true);
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.orderStatus = null;
    // this.commonFacade.setCOMinCOVAlue(0);
    this.commonFacade.setCOOrderNumber({
      orderNo: 0,
      status: null
    });
    this.orderConfirmationFacade.resetValues();
    this.overlayNotification.close();
    // this.customerOrderFacade.resetValues();
    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTolerance();
    // this.commonFacade.clearCOGrfTolerance();
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.paymentFacade.resetDeletedPayment();
  }
}
