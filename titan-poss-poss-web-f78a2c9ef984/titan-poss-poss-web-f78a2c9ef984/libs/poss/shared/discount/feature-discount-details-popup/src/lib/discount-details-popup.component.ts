import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  AdvanceBookingDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreatedCustomerResponse,
  CustomErrors,
  DiscountCalculationItemDetails,
  DiscountConfigDetailsResponse,
  DiscountDetailsPopupTabEnum,
  DiscountHeaders,
  DiscountPopupAbstractionPayload,
  DiscountPopupPayload,
  DiscountsResponse,
  ItemLevelDiscountDetails,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  TransactionTypeEnum,
  SharedBodEodFeatureServiceAbstraction,
  AlertPopupServiceAbstraction,
  DiscountPopupEnum,
  DiscountTypeEnum,
  CashMemoItemDetailsResponse,
  LovMasterEnum,
  Lov,
  PaymentDetails,
  AlertPopupTypeEnum,
  SelectedDiscountTypeAndIdMap
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DiscountDetailsItemLevelDiscountComponent } from './discount-details-item-level-discount/discount-details-item-level-discount.component';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';

@Component({
  selector: 'poss-web-discount-details-popup',
  templateUrl: './discount-details-popup.component.html',
  styleUrls: ['./discount-details-popup.component.scss']
})
export class DiscountDetailsPopupComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  cashMemoDiscountDetails: any;
  appliedEmployeeCouponCode = null;
  appliedTsssCouponCode = null;
  ulpID: string;
  enrolmentDate: Moment;
  appliedTataEmployeeDiscountDetails = null;
  appliedGhsDvDiscountDetails = null;
  appliedEmpowermentDiscountDetails = null;
  appliedRivaahGhsDiscountDetails = null;
  appliedRivaahGhsDiscSaved = null;
  appliedRivaahGhsDiscNew = null;
  frozenAB: boolean;
  isLoading: boolean;
  prodCategoryDesc: string;
  prodGroupDesc: string;

  discountTabRef = DiscountDetailsPopupTabEnum;
  @ViewChild('itemLevelDiscount')
  itemLevelDiscountComponent: DiscountDetailsItemLevelDiscountComponent;
  @ViewChild('karatExchangeTab')
  karatExchangeTab: ElementRef;
  @ViewChild('gepPurityTab')
  gepPurityTab: ElementRef;
  isLoading$: Observable<boolean>;
  isDropdownLoading$: Observable<boolean>;
  isAlreadyAddedDiscountsLoading$: Observable<boolean>;
  isDiscountDetailsLoading$: Observable<boolean>;
  isAutoDiscLoading$: Observable<boolean>;
  isABDropdownLoading$: Observable<boolean>;

  itemDetails: DiscountCalculationItemDetails;

  totalDiscountData: {
    totalDiscount: number;
    totalItemLevelDiscount: number;
    totalBillLevelDiscount: number;
    totalRivaahDiscount: number;
    totalSystemDiscount: number;
    totalCoinOfferDiscount: number;
    totalExchangeOfferDiscount: number;
    totalKaratOfferDiscount: number;
    totalGepPurityDiscount: number;
  } = {
    totalDiscount: 0,
    totalItemLevelDiscount: 0,
    totalBillLevelDiscount: 0,
    totalSystemDiscount: 0,
    totalCoinOfferDiscount: 0,
    totalRivaahDiscount: 0,
    totalExchangeOfferDiscount: 0,
    totalKaratOfferDiscount: 0,
    totalGepPurityDiscount: 0
  };

  showMoreThanTotalError = false;
  showCellValidationError = false;
  showRowValidationError = false;
  showZeroDiscountError = false;
  showErrors = false;
  itemLevelDiscounts: ItemLevelDiscountDetails[] = [];
  billLevelDiscounts: any[] = [];
  karatOfferDiscounts: any[] = [];
  gepPurityDiscounts: any[] = [];
  systemDiscounts: any[] = [];
  rivaahDiscounts: any[] = [];
  rivaahDiscountsGep: any[] = [];
  coinOfferDiscounts: any[] = [];
  exchangeOfferDiscounts: any[] = [];
  discountOptions: DiscountHeaders = {
    discounts: [],
    clubDiscounts: [],
    cummulativeDiscountWithExcludeDetails: null
  };

  reasonsForDiscountChange: SelectDropDownOption[] = [];
  reasonsForNoDiscounts: SelectDropDownOption[] = [];

  showNoDiscountReason = false;
  enableReasonForNoDiscount = false;
  enablereasonForDiscountChange = false;
  reason;
  destroy$ = new Subject();
  bussinessDay: number;
  itemLevelDiscountsData;
  itemLevelDiscountsLength = 0;
  existingDiscounts: DiscountsResponse[] = [];
  selectedItemIds = [];
  addedDiscountIds = [];
  isRefresh: boolean;
  isDelete: boolean;
  isBillLevelDiscountsAdded: boolean;
  selectedTabName = '';

  discountDetails: DiscountPopupPayload;
  isPopupReadOnly = false;
  selectedClubbingId: string;
  // invoke ab to cm
  ABDiscountOptions: DiscountHeaders = {
    discounts: [],
    clubDiscounts: []
  };
  isCMDiscount = false;
  isABDiscount = false;
  onFirstLoad = false;
  isAllowedToChangeAB = true;
  discountType = TransactionTypeEnum.CM;
  txnType: TransactionTypeEnum;
  typeOfCMByRefTxnId = null;
  isFrozenABinCM = false;
  typeOfItemByOrderItemId = null;
  ABCODiscountDetails = null;
  autoDiscounts = [];
  autoDiscountsIds = [];
  abDiscounts = [];
  abDiscountsIds = [];
  selectedDiscounts = [];
  selectedDiscountsIds = [];
  setFlagForSelectedDiscounts = false;
  // discount id, club id
  autoSelectedId = null;
  isExistingDisc: boolean;
  discountDataPayload = null;
  isRefreshAfterLoading = false;
  discountsReload = false;
  selectedDiscountReason = null;
  tcsToBeCollectedAtCM: number;
  paymentDetails: PaymentDetails[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DiscountPopupAbstractionPayload,
    public dialogRef: MatDialogRef<DiscountDetailsPopupComponent>,
    private discountFacade: DiscountFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private paymentFacade: PaymentFacade,
    private dialog: MatDialog
  ) {
    super(timeTrackingLog);
    this.discountDetails = this.data.itemData;
    this.isPopupReadOnly = this.data.readOnly;
    if (
      this.discountDetails?.headerDetails?.selectedAutoDiscounts &&
      this.discountDetails?.headerDetails?.selectedAutoDiscounts?.length !== 0
    ) {
      if (
        this.discountDetails?.headerDetails?.selectedAutoDiscounts?.length < 1
      ) {
        this.autoSelectedId = this.discountDetails?.headerDetails?.selectedAutoDiscounts[0]?.clubbedDiscountId;
      } else {
        this.autoSelectedId = this.discountDetails?.headerDetails?.selectedAutoDiscounts[0]?.discountId;
      }
    }
  }

  onTabChange(event: any) {
    console.log('EVENT ON TAB SELECTION : ', event);
    if (event) {
      this.selectedTabName = event.tab.textLabel;
    }
  }

  totalUpdate(total, type: DiscountDetailsPopupTabEnum) {
    switch (type) {
      case DiscountDetailsPopupTabEnum.ITEM_LEVEL_DISCOUNT:
        this.totalDiscountData.totalItemLevelDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.BILL_LEVEL_DISCOUNT:
        this.totalDiscountData.totalBillLevelDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.COIN_OFFER_DISCOUNT:
        this.totalDiscountData.totalCoinOfferDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.SYSTEM_DISCOUNT_GEP_PURITY:
        this.totalDiscountData.totalGepPurityDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.EXCHANGE_OFFER_DISCOUNT:
        this.totalDiscountData.totalExchangeOfferDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.SYSTEM_DISCOUNT:
        this.totalDiscountData.totalSystemDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.RIVAAH_CARD_DISCOUNT:
        this.totalDiscountData.totalRivaahDiscount = total;
        break;

      case DiscountDetailsPopupTabEnum.KARAT_EXCHANGE_OFFER_DISCOUNT:
        this.totalDiscountData.totalKaratOfferDiscount = total;
        break;
    }

    this.totalDiscountData.totalDiscount =
      this.totalDiscountData.totalItemLevelDiscount +
      this.totalDiscountData.totalBillLevelDiscount +
      this.totalDiscountData.totalCoinOfferDiscount +
      this.totalDiscountData.totalExchangeOfferDiscount +
      this.totalDiscountData.totalSystemDiscount +
      this.totalDiscountData.totalKaratOfferDiscount +
      this.totalDiscountData.totalRivaahDiscount +
      this.totalDiscountData.totalGepPurityDiscount;
  }

  ngOnInit(): void {
    this.discountFacade.clear();
    this.txnType = this.discountDetails.itemData.txnType;
    this.typeOfCMByRefTxnId = this.discountDetails.itemData.refTxnId;
    this.typeOfItemByOrderItemId = this.discountDetails.itemData.itemDetails.orderItemId;
    this.selectedDiscountReason = this.discountDetails.itemData.itemDetails.discountDetails?.data?.remarks;
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.AB_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data !== null) this.isFrozenABinCM = data.isFrozenRate;
      });

    console.log(
      'details of order',
      this.txnType,
      this.discountDetails.itemData.itemDetails.orderItemId,
      this.discountDetails.itemData.refTxnId,
      this.isFrozenABinCM,
      this.discountDetails
    );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.FROZEN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.frozenAB = data;
      });

    this.itemDetails = {
      isUcp: this.discountDetails?.itemData?.itemDetails?.priceDetails?.isUcp,
      ucpValue: this.discountDetails?.itemData?.itemDetails?.totalValue,
      // ucpValue: this.discountDetails?.itemData?.itemDetails?.priceDetails?.isUcp
      //   ? this.discountDetails?.itemData?.itemDetails?.finalValue
      //   : 0,
      makingCharge: this.discountDetails?.itemData?.itemDetails?.priceDetails
        ?.makingChargeDetails?.preDiscountValue,
      stoneCharge: this.discountDetails?.itemData?.itemDetails?.priceDetails
        ?.stonePriceDetails?.preDiscountValue,
      goldCharge: this.discountDetails?.itemData?.itemDetails?.priceDetails
        ?.metalPriceDetails?.preDiscountValue,
      weight: this.discountDetails?.itemData?.itemDetails?.priceDetails
        ?.netWeight
    };

    if (
      this.txnType === TransactionTypeEnum.CM &&
      this.typeOfCMByRefTxnId !== null
    ) {
      if (this.isPopupReadOnly) {
        this.discountFacade.loadGetItemLevelDiscounts({
          txnType: this.discountDetails.itemData.txnType,
          subTxnType: this.discountDetails.itemData.subTxnType,
          transactionId: this.discountDetails.itemData.id,
          itemId: this.discountDetails.itemData.itemDetails.itemId
        });
      } else {
        if (this.typeOfItemByOrderItemId === null) {
          if (this.isFrozenABinCM) {
            this.discountFacade.loadNewABCODiscounts({
              txnType: this.discountDetails.itemData.txnType,
              subTxnType: this.discountDetails.itemData.subTxnType,
              transactionId: this.discountDetails.itemData.id,
              itemProductGroupCode: this.discountDetails.itemData.itemDetails
                .productGroupCode
            });
          } else {
            this.discountFacade.loadGetItemLevelDiscounts({
              txnType: this.discountDetails.itemData.txnType,
              subTxnType: this.discountDetails.itemData.subTxnType,
              transactionId: this.discountDetails.itemData.id,
              itemId: this.discountDetails.itemData.itemDetails.itemId
            });
          }
        } else if (this.typeOfItemByOrderItemId !== null) {
          this.discountFacade.loadABCODiscounts({
            txnType: this.discountDetails.itemData.txnType,
            subTxnType: this.discountDetails.itemData.subTxnType,
            transactionId: this.discountDetails.itemData.id,
            itemId: this.discountDetails.itemData.itemDetails.orderItemId,
            itemProductGroupCode: this.discountDetails.itemData.itemDetails
              .productGroupCode
          });
        }
      }
    }

    this.discountFacade
      .getOrderDiscDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.cashMemoDiscountDetails = data?.discountDetails;
        this.appliedEmployeeCouponCode = this.cashMemoDiscountDetails?.data?.employeeDetails?.couponDetails[0]?.couponCode;
        this.appliedTsssCouponCode = this.cashMemoDiscountDetails?.data?.tsssDetails?.couponDetails[0]?.couponCode;
        this.appliedTataEmployeeDiscountDetails = this.cashMemoDiscountDetails?.data?.tataEmployeeDetails;
        this.appliedGhsDvDiscountDetails = this.cashMemoDiscountDetails?.data?.ghsDiscountDetails;
        this.appliedEmpowermentDiscountDetails = this.cashMemoDiscountDetails?.data?.empowermentDetails?.applyEmpowermentDiscount;
        this.appliedRivaahGhsDiscountDetails = this.cashMemoDiscountDetails?.data?.rivaahGhsDiscountDetails;
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });
    this.customerFacade
      .getSelectedCustomerDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CreatedCustomerResponse) => {
        if (response) {
          this.ulpID = response.ulpId;
          this.enrolmentDate = response.enrollmentDate;
        }
      });

    let payload = {
      businessDate: this.bussinessDay,
      itemDetails: {
        itemCode: this.discountDetails.itemData.itemDetails.itemCode,
        discountTypeAndIdAppliedOnItem: this.getDiscountTypeAndIdMap(
          this.discountDetails.itemData
        ),
        totalDiscount: this.discountDetails.itemData.itemDetails.totalDiscount,
        lotNumber: this.discountDetails.itemData.itemDetails.lotNumber,
        mfgDate: this.discountDetails.itemData.itemDetails.itemDetails?.data
          ? this.discountDetails.itemData.itemDetails.itemDetails?.data[
              this.discountDetails?.itemData?.itemDetails?.inventoryId
            ]?.mfgDate
          : null,
        stockInwardDate: this.discountDetails.itemData.itemDetails.itemDetails
          ?.data
          ? this.discountDetails.itemData.itemDetails.itemDetails?.data[
              this.discountDetails.itemData.itemDetails?.inventoryId
            ]?.stockInwardDate
          : null,
        totalTax: this.discountDetails.itemData.itemDetails.totalTax,
        totalWeight: this.discountDetails.itemData.itemDetails.totalWeight,
        netWeight: this.discountDetails.itemData.itemDetails.priceDetails
          .netWeight,
        totalValue: this.discountDetails.itemData.itemDetails.totalValue,
        complexityPercent: this.discountDetails?.itemData?.itemDetails
          ?.priceDetails?.makingChargeDetails?.wastagePct,
        makingChargePerGram: this.discountDetails?.itemData?.itemDetails
          ?.priceDetails?.makingChargeDetails?.makingChargePgram,
        productCategoryCode: this.discountDetails.itemData.itemDetails
          .productCategoryCode,
        productGroupCode: this.discountDetails.itemData.itemDetails
          .productGroupCode,
        isUcp: this.discountDetails.itemData.itemDetails.priceDetails.isUcp
      },
      itemDetailsForCummulativeCal: this.sendCumulativeDiscountDetails(
        this.data.itemData.otherThanSelectedRow
      ),
      transactionDetails: {
        transactionType: this.discountDetails.itemData.txnType,
        subTransactionType: this.discountDetails.itemData.subTxnType,
        isFrozenRate: this.frozenAB
      },
      encircleDiscount: {},
      employeeDetails: this.appliedEmployeeCouponCode
        ? {
            couponDetails: [
              {
                couponCode: this.appliedEmployeeCouponCode
              }
            ]
          }
        : null,
      tsssDetails: this.appliedTsssCouponCode
        ? {
            couponDetails: [
              {
                couponCode: this.appliedTsssCouponCode
              }
            ]
          }
        : null,
      tataEmployeeDetails: this.appliedTataEmployeeDiscountDetails
        ? this.appliedTataEmployeeDiscountDetails
        : null,
      empowermentDetails: this.appliedEmpowermentDiscountDetails
        ? {
            applyEmpowermentDiscount: this.appliedEmpowermentDiscountDetails
          }
        : null,
      rivaahGhsDetails: this.appliedRivaahGhsDiscountDetails
        ? this.appliedRivaahGhsDiscountDetails
        : this.discountDetails?.itemData?.discountTxnDetails?.data
            ?.rivaahGhsDiscountDetails
        ? this.discountDetails?.itemData?.discountTxnDetails?.data
            ?.rivaahGhsDiscountDetails
        : null
    };

    this.discountFacade
      .getIsEncircleDiscDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(addedEncircle => {
        if (addedEncircle) {
          payload = {
            ...payload,
            encircleDiscount: {
              discountType: addedEncircle
            }
          };
        }
      });

    this.discountDataPayload = payload;

    if (!this.isPopupReadOnly) {
      this.discountFacade.loadItemLevelDiscounts(payload);
    }
    if (this.typeOfCMByRefTxnId === null) {
      this.discountFacade.loadGetItemLevelDiscounts({
        txnType: this.discountDetails.itemData.txnType,
        subTxnType: this.discountDetails.itemData.subTxnType,
        transactionId: this.discountDetails.itemData.id,
        itemId: this.discountDetails.itemData.itemDetails.itemId
      });
    }

    this.discountFacade
      .getIsDescLoaded()
      .pipe(takeUntil(this.destroy$))
      .subscribe(desc => {
        if (!desc) {
          this.discountFacade.loadPcDesc();
          this.discountFacade.loadPgDesc();
        }
      });

    this.isLoading$ = this.discountFacade.getIsLoading();
    this.isDropdownLoading$ = this.discountFacade.getIsDropdownLoading();
    this.isAlreadyAddedDiscountsLoading$ = this.discountFacade.getIsAlreadyAddedDiscountsLoading();
    this.isDiscountDetailsLoading$ = this.discountFacade.getIsDiscountDetailsLoading();
    this.isABDropdownLoading$ = this.discountFacade.getIsABDropdownLoading();
    this.isAutoDiscLoading$ = this.discountFacade.getIsAutoDiscLoading();
    this.componentInit();
    this.discountFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.discountFacade
      .getPcDesc()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pc => {
        if (this.discountDetails.headerDetails.productCategory) {
          if (pc !== null) {
            this.prodCategoryDesc =
              pc[`${this.discountDetails.headerDetails.productCategory}`];
          } else {
            this.prodCategoryDesc = this.discountDetails.headerDetails.productCategory;
          }
        }
      });

    this.discountFacade
      .getPgDesc()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pg => {
        if (this.discountDetails.headerDetails.productGroup) {
          if (pg !== null) {
            this.prodGroupDesc =
              pg[`${this.discountDetails.headerDetails.productGroup}`];
          } else {
            this.prodGroupDesc = this.discountDetails.headerDetails.productGroup;
          }
        }
      });

    this.discountFacade
      .getItemLevelDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountHeaders) => {
        if (discounts !== null) this.discountOptions = discounts;
      });

    this.discountFacade
      .getItemLevelDiscountsDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (discounts: {
          discountConfigDetails: DiscountConfigDetailsResponse[];
          clubbingId: string;
        }) => {
          if (
            discounts &&
            discounts !== null
            // discounts.length !== 0 &&
            // this.itemLevelDiscountsLength === discounts.length
          ) {
            let tempArray = [];
            tempArray = this.itemLevelDiscDetailsMapping(
              discounts.discountConfigDetails
            );

            this.itemLevelDiscounts = tempArray;
            if (this.setFlagForSelectedDiscounts) {
              this.selectedDiscounts = tempArray;
              this.setFlagForSelectedDiscounts = false;
            }
          }
        }
      );

    this.discountFacade
      .getItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        if (discounts !== null) {
          if (discounts.length !== 0) {
            this.existingDiscounts = [];
            const itemIds = [];
            const itemDetails = [];
            this.addedDiscountIds = [];
            let clubbedDiscountId = null;
            let discountId = null;
            discounts.forEach(element => {
              if (
                element.discountType === DiscountTypeEnum.BILL_LEVEL_DISCOUNT
              ) {
                this.billLevelDiscounts.push({
                  discountType: element.occasion,
                  total: element.discountValue
                });
              } else if (
                element.discountType ===
                DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT
              ) {
                this.karatOfferDiscounts.push({
                  discountType: element.discountType,
                  total: element.discountValue,
                  data: element
                });
              } else if (
                element.discountType ===
                DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY
              ) {
                this.gepPurityDiscounts.push({
                  discountType: element.discountType,
                  total: element.discountValue,
                  data: element
                });
              } else if (
                element.discountType === DiscountTypeEnum.COIN_OFFER_DISCOUNT
              ) {
                this.coinOfferDiscounts.push({
                  discountType: element.discountType,
                  total: element.discountValue,
                  data: element
                });
              } else if (
                element.discountType === DiscountTypeEnum.RIVAAH_CARD_DISCOUNT
              ) {
                if (
                  element?.discountSubType ===
                  DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY
                ) {
                  this.rivaahDiscountsGep.push({
                    discountType: element.discountType,
                    total: element.discountValue,
                    data: element
                  });
                } else {
                  this.rivaahDiscounts = [...this.rivaahDiscounts, element];
                }
              } else if (element.discountType === 'GRN_MULTIPLE_DISCOUNT') {
                this.systemDiscounts.push({
                  discountType: element.discountType + ' ' + element.occasion,
                  total: element.discountValue,
                  data: element
                });
              } else if (
                element.discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_DV
              ) {
                this.systemDiscounts.push({
                  discountType: element.discountType + ' ' + element.occasion,
                  total: element.discountValue,
                  data: element
                });
              } else if (
                element.discountType ===
                  DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS ||
                element.discountType === DiscountTypeEnum.DIGI_GOLD_DISCOUNT
              ) {
                this.systemDiscounts.push({
                  discountType: element.discountType + ' ' + element.occasion,
                  total: element.discountValue,
                  data: element
                });
              } else {
                if (
                  element.discountType ===
                  DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
                ) {
                  this.appliedRivaahGhsDiscSaved =
                    element?.txnLevelDiscountValueDetails?.data;
                }
                this.discountFacade.clearItemLevelDiscountDetails();
                this.clearItemLevel();
                itemIds.push(
                  element.clubbedDiscountId
                    ? element.clubbedDiscountId
                    : element.referenceId
                    ? element.referenceId
                    : element.discountId
                );
                this.addedDiscountIds.push(element.discountId);
                itemDetails.push(element);
                if (element.referenceId !== null)
                  this.discountType = TransactionTypeEnum.AB;
                else this.discountType = TransactionTypeEnum.CM;
                this.existingDiscounts.push(element);
                this.isExistingDisc = true;
                // ab discount
                this.selectedItemIds = itemIds;
                this.itemLevelDiscountsLength = this.existingDiscounts.length;
                this.selectedDiscountsIds = itemIds;
                this.setFlagForSelectedDiscounts = true;
                discountId =
                  this.discountType === TransactionTypeEnum.AB
                    ? element.referenceId
                    : element.discountId;
                clubbedDiscountId = element.clubbedDiscountId
                  ? element.clubbedDiscountId
                  : null;
              }
            });
            if (this.existingDiscounts.length) {
              if (this.discountType === TransactionTypeEnum.AB) {
                // ab order && ab item
                if (
                  this.typeOfCMByRefTxnId &&
                  this.typeOfCMByRefTxnId !== null
                ) {
                  if (this.isPopupReadOnly) {
                    this.itemLevelDiscounts = this.itemLevelDiscMapping(
                      this.existingDiscounts
                    );
                  } else {
                    if (
                      this.typeOfItemByOrderItemId &&
                      this.typeOfItemByOrderItemId !== null
                    ) {
                      this.loadABCOConfigDetails(
                        clubbedDiscountId === null ? discountId : null,
                        clubbedDiscountId
                      );
                    } else {
                      if (
                        !(
                          this.typeOfItemByOrderItemId &&
                          this.typeOfItemByOrderItemId !== null
                        )
                      ) {
                        if (this.isFrozenABinCM) {
                          this.loadABCOConfigDetails(
                            clubbedDiscountId === null ? discountId : null,
                            clubbedDiscountId
                          );
                        }
                      }
                    }
                  }
                }
              } else {
                if (this.isPopupReadOnly) {
                  this.itemLevelDiscounts = this.itemLevelDiscMapping(
                    this.existingDiscounts
                  );
                } else {
                  this.itemLevelDiscounts = this.itemLevelDiscMapping(
                    this.existingDiscounts
                  );
                  this.discountFacade.loadItemLevelDiscountsDetails({
                    requestBody: {
                      businessDate: this.bussinessDay,
                      cummulativeDiscountWithExcludeDetails: this
                        .existingDiscounts[0]
                        .cummulativeDiscountWithExcludeDetails,
                      itemDetails: {
                        itemCode: this.discountDetails.itemData.itemDetails
                          .itemCode,
                        lotNumber: this.discountDetails.itemData.itemDetails
                          .lotNumber,
                        productCategoryCode: this.discountDetails.itemData
                          .itemDetails.productCategoryCode,
                        productGroupCode: this.discountDetails.itemData
                          .itemDetails.productGroupCode,
                        priceDetails: this.discountDetails.itemData.itemDetails
                          .priceDetails,
                        totalQuantity: this.discountDetails.itemData.itemDetails
                          .totalQuantity,
                        totalValue: this.discountDetails.itemData.itemDetails
                          .totalValue,
                        totalWeight: this.discountDetails.itemData.itemDetails
                          .totalWeight,
                        netWeight: this.discountDetails.itemData.itemDetails
                          .priceDetails.netWeight,
                        totalTax: this.discountDetails.itemData.itemDetails
                          .totalTax
                      },
                      customerDetails: {
                        enrollmentDate: this.enrolmentDate,
                        ulpId: this.ulpID
                      },
                      transactionDetails: {
                        transactionType: this.discountDetails.itemData.txnType,
                        subTransactionType: this.discountDetails.itemData
                          .subTxnType,
                        isFrozenRate: this.frozenAB
                      },
                      eligibleRivaahGhsDetails: this.appliedRivaahGhsDiscSaved
                        ? this.appliedRivaahGhsDiscSaved
                        : null
                    },
                    discountId: clubbedDiscountId === null ? discountId : null,
                    discountClubId: clubbedDiscountId,
                    existingDiscounts: this.existingDiscounts
                  });
                }
              }
            }
          }
        }
      });

    this.discountFacade
      .saveItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discounts => {
        if (discounts.response.length !== 0) {
          this.discountsReload = true;
          this.showNotifications(
            'pw.discountDetailsPopup.discountUpdateSuccessMsg'
          );
          this.addStopTracking(
            'pw.instrumentationMessges.selectItemLevelDiscountMsg'
          );
        }
      });

    this.discountFacade
      .updateItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        // console.log('CashMemo: update discounts:', discounts);
        if (discounts.length !== 0) {
          this.showNotifications(
            'pw.discountDetailsPopup.discountUpdateSuccessMsg'
          );
          // this.dialogRef.close({
          //   type: 'EDIT',
          //   data: {
          //     reason: this.reason
          //   }
          // });
        }
      });

    this.discountFacade
      .deleteItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discounts => {
        // console.log(
        //   'CashMemo: deleted discounts:',
        //   discounts,
        //   this.itemLevelDiscountsData
        // );
        if (discounts.response) {
          // if (
          //   discounts.data.itemData.filter(
          //     discount =>
          //       discount.discountType ===
          //         DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
          //       discount.discountType ===
          //         DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
          //       discount.discountType === DiscountTypeEnum.BEST_DEAL_DISCOUNT
          //   ).length > 0
          // )
          this.discountFacade.loadReloadDiscountsGrid(true);
          if (this.isRefresh) {
            this.discountFacade.clear();
            this.selectedItemIds = [];
            this.addedDiscountIds = [];
            this.discountType = null;
            this.clearItemLevel();
            this.showNotifications(
              'pw.discountDetailsPopup.discountUpdateSuccessMsg'
            );
            this.addStopTracking(
              'pw.instrumentationMessges.unselectItemLevelDiscountMsg'
            );
          } else {
            const tempArray = [];
            this.itemLevelDiscountsData.forEach(element => {
              tempArray.push({
                clubbedDiscountId: this.selectedClubbingId,
                cummulativeDiscountWithExcludeDetails: this.discountOptions
                  ?.cummulativeDiscountWithExcludeDetails,
                discountCode: element.discountCode,
                discountId: element.discountId,
                discountType: element.discountType,
                discountValue: element.discountValue,
                discountValueDetails: {
                  data: { discountValueDetails: element.discountValueDetails },
                  type: DiscountPopupEnum.DISCOUNT_VALUE_DETAILS
                },
                isEdited: element.isEdited,
                referenceId:
                  this.typeOfCMByRefTxnId && this.typeOfCMByRefTxnId !== null
                    ? element.refDiscountTxnId
                    : null,
                referenceType: null,
                rivaahGhsDiscountDetails: element.rivaahGhsDetails
                // refPaymentId: element?.rivaahGhsDetails?.refPaymentId
                //   ? element?.rivaahGhsDetails?.refPaymentId
                //   : null
              });
            });
            const savePayload = {
              txnType: this.discountDetails.itemData.txnType,
              subTxnType: this.discountDetails.itemData.subTxnType,
              transactionId: this.discountDetails.itemData.id,
              itemId: this.discountDetails.itemData.itemDetails.itemId,
              requestBody: tempArray
            };
            this.discountFacade.loadSaveItemLevelDiscounts({
              request: savePayload,
              data: null
            });
          }
        }
      });

    this.discountFacade
      .getAppliedBillLevelTransactionLevelDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(disounts => {
        this.isBillLevelDiscountsAdded = disounts.length > 0 ? true : false;
        if (this.isBillLevelDiscountsAdded) {
          this.showErrors = true;
        }
      });

    this.discountFacade
      .getLoadABCODiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountHeaders) => {
        if (discounts !== null) {
          this.ABDiscountOptions = discounts;
          const itemIds = [];
          if (discounts.discounts !== null) {
            for (const disc of discounts.discounts) {
              itemIds.push(disc.refDiscountTxnId);
              if (
                disc.orderConfigDetails.isAllowedToChangeAB === false &&
                disc.discountType !== DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
              ) {
                this.isAllowedToChangeAB = false;
                break;
              } else {
                this.isAllowedToChangeAB = true;
              }
            }
          }

          if (discounts.clubDiscounts !== null) {
            for (const clubDisc of discounts.clubDiscounts) {
              for (const disc of clubDisc.discounts) {
                itemIds.push(clubDisc.clubDiscountId);
                if (
                  disc.orderConfigDetails.isAllowedToChangeAB === false &&
                  disc.discountType !==
                    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
                ) {
                  this.isAllowedToChangeAB = false;
                  break;
                } else {
                  this.isAllowedToChangeAB = true;
                }
              }
            }
          }

          this.abDiscountsIds = itemIds;
          this.discountFacade.loadGetItemLevelDiscounts({
            txnType: this.discountDetails.itemData.txnType,
            subTxnType: this.discountDetails.itemData.subTxnType,
            transactionId: this.discountDetails.itemData.id,
            itemId: this.discountDetails.itemData.itemDetails.itemId
          });
          // if (this.ABCODiscountDetails !== null)
          //   this.loadABDiscountDetails(this.ABCODiscountDetails);
        }
      });

    this.discountFacade
      .getLoadNewABCODiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountHeaders) => {
        if (discounts !== null) {
          this.ABDiscountOptions = discounts;
          this.discountFacade.loadGetItemLevelDiscounts({
            txnType: this.discountDetails.itemData.txnType,
            subTxnType: this.discountDetails.itemData.subTxnType,
            transactionId: this.discountDetails.itemData.id,
            itemId: this.discountDetails.itemData.itemDetails.itemId
          });
        }
      });

    this.discountFacade
      .getCheckABCOEligibilityRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: any) => {
        if (
          discounts &&
          discounts !== null
          // && this.itemLevelDiscountsLength === discounts.length
        ) {
          if (discounts === 'no-response') {
            this.showSimpleNotifications(
              'pw.discountDetailsPopup.discountNotEligibleMsg'
            );
          } else {
            const tempArray = [];
            // discounts.forEach(disc => {
            discounts.discountConfigDetails.forEach(element => {
              tempArray.push({
                discountDescription:
                  element.discountConfigDetails.discountAttributes.occasion,
                clubbingDiscountType:
                  element.discountConfigDetails.discountAttributes
                    .clubbingDiscountType,
                isEdited: false,
                discountValueDetails:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountValueDetails.data
                    : element.discountValueDetails,
                discountCode: element.discountConfigDetails.discountCode,
                discountId: element.discountConfigDetails.discountId,
                discountType: element.discountConfigDetails.discountType,
                discountTxnId:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountTxnId
                    : null,
                discountValue:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountValue
                    : element.discountValue,
                refDiscountTxnId:
                  element.discountConfigDetails.refDiscountTxnId,
                basicCriteriaDetails: {
                  maxDiscount:
                    element.discountConfigDetails.basicCriteriaDetails
                      .maxDiscount,
                  isEditable:
                    element.discountConfigDetails.basicCriteriaDetails
                      .isEditable
                },
                rivaahGhsDetails: element.rivaahGhsDetails
              });
            });
            // });

            this.itemLevelDiscounts = tempArray;
            if (this.setFlagForSelectedDiscounts) {
              this.selectedDiscounts = tempArray;
              this.setFlagForSelectedDiscounts = false;
            }
          }
        }
      });

    this.discountFacade
      .getLoadABCODiscountDetailsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (discounts: {
          discountConfigDetails: DiscountConfigDetailsResponse[];
          clubbingId: string;
        }) => {
          if (
            discounts &&
            discounts !== null
            // discounts &&
            // discounts.length !== 0 &&
            // this.itemLevelDiscountsLength === discounts.length
          ) {
            if (discounts.discountConfigDetails.length === 0) {
              this.showSimpleNotifications(
                'pw.discountDetailsPopup.discountNotEligibleMsg'
              );
            } else {
              const tempArray = [];
              const itemIds = [];
              // discounts.forEach(element => {
              discounts.discountConfigDetails.forEach(element => {
                itemIds.push(
                  discounts.clubbingId !== null
                    ? discounts.clubbingId
                    : element.discountConfigDetails.refDiscountTxnId
                );
                tempArray.push({
                  discountDescription:
                    element.discountConfigDetails.discountAttributes.occasion,
                  clubbingDiscountType:
                    element.discountConfigDetails.discountAttributes
                      .clubbingDiscountType,
                  isEdited: false,
                  discountValueDetails:
                    element.existingDiscounts !== null
                      ? element.existingDiscounts.discountValueDetails.data
                      : element.discountValueDetails,
                  discountCode: element.discountConfigDetails.discountCode,
                  discountId: element.discountConfigDetails.discountId,
                  discountType: element.discountConfigDetails.discountType,
                  discountTxnId:
                    element.existingDiscounts !== null
                      ? element.existingDiscounts.discountTxnId
                      : null,
                  discountValue:
                    element.existingDiscounts !== null
                      ? element.existingDiscounts.discountValue
                      : element.discountValue,
                  refDiscountTxnId:
                    element.discountConfigDetails.refDiscountTxnId,
                  basicCriteriaDetails: {
                    maxDiscount:
                      element.discountConfigDetails.basicCriteriaDetails
                        .maxDiscount,
                    isEditable:
                      element.discountConfigDetails.basicCriteriaDetails
                        .isEditable
                  },
                  rivaahGhsDetails: element.rivaahGhsDetails
                });
              });
              this.itemLevelDiscounts = tempArray;
              this.abDiscounts = tempArray;
              // this.abDiscountsIds = itemIds;
              this.discountType = TransactionTypeEnum.AB;
              if (this.isRefreshAfterLoading) {
                this.refresh();
                // this.isRefreshAfterLoading = false;
              }
            }
          }
        }
      );

    this.discountFacade
      .getLoadAutoDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (discounts: {
          response: {
            discountConfigDetails: DiscountConfigDetailsResponse[];
            clubbingId: string;
          };
          data: CashMemoItemDetailsResponse;
        }) => {
          // if (this.loadAutoDiscForFirstTime) {
          //   if (discounts.response && discounts.response !== null) {
          //     if (discounts.response.clubbingId !== null) {
          //       this.autoSelectedId = discounts.response.clubbingId;
          //     } else {
          //       this.autoSelectedId =
          //         discounts?.response?.discountConfigDetails[0]?.discountConfigDetails.discountId;
          //     }
          //   }
          //   this.loadAutoDiscForFirstTime = false;
          // } else {
          if (
            discounts.response &&
            discounts.response !== null
            // && this.itemLevelDiscountsLength === discounts.length
          ) {
            const tempArray = [];
            const itemIds = [];
            if (discounts.response.clubbingId !== null) {
              this.autoSelectedId = discounts.response.clubbingId;
            } else {
              this.autoSelectedId =
                discounts?.response?.discountConfigDetails[0]?.discountConfigDetails.discountId;
            }
            // discounts.forEach(disc => {
            discounts.response.discountConfigDetails.forEach(element => {
              itemIds.push(
                discounts.response.clubbingId !== null
                  ? discounts.response.clubbingId
                  : element.discountConfigDetails.discountId
              );
              tempArray.push({
                discountDescription:
                  element.discountConfigDetails.discountAttributes.occasion,
                clubbingDiscountType:
                  element.discountConfigDetails.discountAttributes
                    .clubbingDiscountType,
                isEdited: false,
                discountValueDetails:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountValueDetails.data
                    : element.discountValueDetails,
                discountCode: element.discountConfigDetails.discountCode,
                discountId: element.discountConfigDetails.discountId,
                discountType: element.discountConfigDetails.discountType,
                discountTxnId:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountTxnId
                    : null,
                discountValue:
                  element.existingDiscounts !== null
                    ? element.existingDiscounts.discountValue
                    : element.discountValue,
                refDiscountTxnId:
                  element.discountConfigDetails.refDiscountTxnId,
                basicCriteriaDetails: {
                  maxDiscount:
                    element.discountConfigDetails.basicCriteriaDetails
                      .maxDiscount,
                  isEditable:
                    element.discountConfigDetails.basicCriteriaDetails
                      .isEditable
                },
                rivaahGhsDetails: element.rivaahGhsDetails
              });
              // if (
              //   element.discountConfigDetails.discountType ===
              //     EncircleTypesEnum.ULP_DISCOUNT_ANNIVERSARY ||
              //   element.discountConfigDetails.discountType ===
              //     EncircleTypesEnum.ULP_DISCOUNT_BIRTHDAY ||
              //   element.discountConfigDetails.discountType ===
              //     EncircleTypesEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY
              // ) {
              //   this.isAutoEncircleSelected = true;
              // }
            });
            // });
            // this.selectedItemIds = itemIds;
            // this.itemLevelDiscounts = tempArray;
            this.autoDiscountsIds = itemIds;
            this.autoDiscounts = tempArray;
            this.refreshAutoDiscounts();
          } else console.log('no auto discounts');
          // }
        }
      );

    this.discountFacade
      .getLoadABCOConfigDetailsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountHeaders) => {
        if (discounts !== null) {
          if (this.typeOfItemByOrderItemId !== null) {
            this.loadABDiscountDetails(discounts);
          } else this.filterEligibleABDiscounts(discounts);
        }
      });
  }

  sendCumulativeDiscountDetails(otherItemSelected) {
    const otherItemSendToItemLevel = [];
    if (otherItemSelected?.length > 0) {
      otherItemSelected.map(eachVal => {
        if (eachVal?.selectedDiscounts?.length > 0) {
          eachVal.selectedDiscounts.forEach(val => {
            if (
              val.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
              DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
              DiscountTypeEnum.BEST_DEAL_DISCOUNT
            ) {
              otherItemSendToItemLevel.push(eachVal);
            }
          });
        } else if (eachVal.productType !== 'FOC') {
          otherItemSendToItemLevel.push(eachVal);
        }
      });
    }
    if (otherItemSendToItemLevel?.length > 0) {
      const itemDetailsArray = [];

      otherItemSendToItemLevel.forEach(val => {
        itemDetailsArray.push({
          itemCode: val.responseData.itemDetails.itemCode,
          discountTypeAndIdAppliedOnItem: this.getDiscountTypeAndIdMapForOtherItem(
            val
          ),
          totalDiscount: val.responseData.itemDetails.totalDiscount,
          lotNumber: val.responseData.itemDetails.lotNumber,
          mfgDate:
            val.responseData.itemDetails.itemDetails?.data[
              val.responseData.itemDetails.inventoryId
            ]?.mfgDate,
          stockInwardDate:
            val.responseData.itemDetails.itemDetails?.data[
              val.responseData.itemDetails.inventoryId
            ]?.stockInwardDate,
          totalTax: val.responseData.itemDetails.totalTax,
          totalWeight: val.responseData.itemDetails.totalWeight,
          netWeight: val.responseData.itemDetails.priceDetails.netWeight,
          totalValue: val.responseData.itemDetails.totalValue,
          complexityPercent:
            val?.responseData?.itemDetails?.priceDetails?.makingChargeDetails
              ?.wastagePct,
          makingChargePerGram:
            val?.responseData?.itemDetails?.priceDetails?.makingChargeDetails
              ?.makingChargePgram,
          productCategoryCode: val.responseData.itemDetails.productCategoryCode,
          productGroupCode: val.responseData.itemDetails.productGroupCode,
          isUcp: val.responseData.itemDetails.priceDetails.isUcp
        });
      });
      return itemDetailsArray;
    } else {
      return [];
    }
  }

  getDiscountTypeAndIdMap(selctedDiscountVal) {
    const discountTypeAndIdAppliedOnItem = new Map();
    if (selctedDiscountVal?.discountDetails?.length > 0) {
      const slectedDiscountTypesAndId = selctedDiscountVal.discountDetails.filter(
        val =>
          val.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
          DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
          DiscountTypeEnum.BEST_DEAL_DISCOUNT
      );
      if (slectedDiscountTypesAndId.length > 0) {
        slectedDiscountTypesAndId.forEach(obj => {
          discountTypeAndIdAppliedOnItem.set(obj.discountType, obj.discountId);
        });
      }
    }

    if (
      discountTypeAndIdAppliedOnItem !== null &&
      discountTypeAndIdAppliedOnItem !== undefined &&
      discountTypeAndIdAppliedOnItem.size !== 0
    ) {
      return this.convertMapToObject(discountTypeAndIdAppliedOnItem);
    } else {
      return null;
    }
  }

  getDiscountTypeAndIdMapForOtherItem(selctedDiscountVal) {
    const discountTypeAndIdAppliedOnItem = new Map();
    if (selctedDiscountVal?.selectedDiscounts?.length > 0) {
      const slectedDiscountTypesAndId = selctedDiscountVal.selectedDiscounts.filter(
        val =>
          val.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
          DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
          DiscountTypeEnum.BEST_DEAL_DISCOUNT
      );
      if (slectedDiscountTypesAndId.length > 0) {
        slectedDiscountTypesAndId.forEach(obj => {
          discountTypeAndIdAppliedOnItem.set(obj.discountType, obj.discountId);
        });
      }
    }

    if (
      discountTypeAndIdAppliedOnItem !== null &&
      discountTypeAndIdAppliedOnItem !== undefined &&
      discountTypeAndIdAppliedOnItem.size !== 0
    ) {
      return this.convertMapToObject(discountTypeAndIdAppliedOnItem);
    } else {
      return null;
    }
  }

  convertMapToObject(pairs) {
    return Array.from(pairs).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }

  componentInit() {
    this.discountFacade.loadReasonForChangingDiscounts(
      LovMasterEnum.REASON_FOR_CHANGING_DISCOUNT
    );
    this.discountFacade.loadReasonForNotGivingDiscounts(
      LovMasterEnum.REASON_FOR_NOT_GIVING_DISCOUNT
    );
    this.discountFacade
      .getReasonForChangingDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Lov[]) => {
        this.reasonsForDiscountChange = [];
        if (response.length) {
          response.map(element =>
            this.reasonsForDiscountChange.push({
              value: element.value,
              description: element.value
            })
          );
        }
      });

    this.discountFacade
      .getReasonForNotGivingDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Lov[]) => {
        this.reasonsForNoDiscounts = [];
        if (response.length) {
          response.map(element =>
            this.reasonsForNoDiscounts.push({
              value: element.value,
              description: element.value
            })
          );
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsAmount => {
        this.tcsToBeCollectedAtCM = tcsAmount;
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        this.paymentDetails = paymentDetails;
      });
  }

  loadSelectedDiscountDetails(discountIDs: string[]) {
    this.showErrors = false;
    this.reason = null;
    if (discountIDs && discountIDs.length) {
      // todo : clear method
      this.itemLevelDiscountComponent.selectABDiscountFormControl.reset();
      // const clubDiscountIds = [];
      // this.discountOptions.clubDiscounts.map(d =>
      //   d.discounts.map(data => {
      //     clubDiscountIds.push(data.discountId);
      //     for (let i = 0; i < discountIDs.length; i++) {
      //       const element = clubDiscountIds.includes(discountIDs[i]);
      //       if (element) {
      //         this.selectedClubbingId =
      //           clubDiscountIds.length === discountIDs.length
      //             ? d.clubDiscountId
      //             : null;
      //       }
      //       break;
      //     }
      //   })
      // );

      if (discountIDs.length === 1) {
        this.selectedClubbingId = null;
        const selectedDisc = this.discountOptions.discounts.filter(
          d => d.discountId === discountIDs[0]
        );
        this.appliedRivaahGhsDiscNew = selectedDisc[0].rivaahGhsDetails;
      } else {
        this.selectedClubbingId = discountIDs[0];
        const selectedClubbingDisc = this.discountOptions.clubDiscounts.filter(
          d => d.clubDiscountId === discountIDs[0]
        );
        selectedClubbingDisc[0]?.discounts.forEach(element => {
          if (
            element.discountType === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
          )
            this.appliedRivaahGhsDiscNew = element.rivaahGhsDetails;
        });
      }
      if (this.autoSelectedId !== null) {
        if (discountIDs.length === 1) {
          if (this.autoSelectedId !== discountIDs[0]) {
            this.enablereasonForDiscountChange = true;
          } else {
            this.enablereasonForDiscountChange = false;
          }
        } else {
          if (this.autoSelectedId !== this.selectedClubbingId) {
            this.enablereasonForDiscountChange = true;
          } else {
            this.enablereasonForDiscountChange = false;
          }
        }
      }

      this.discountFacade.clearItemLevelDiscountDetails();
      this.clearItemLevel();
      this.itemLevelDiscountsLength = discountIDs.length;
      this.addStartTracking(
        'pw.instrumentationMessges.selectItemLevelDiscountMsg'
      );
      // discountIDs.forEach(element => {
      this.discountFacade.loadItemLevelDiscountsDetails({
        requestBody: {
          businessDate: this.bussinessDay,
          cummulativeDiscountWithExcludeDetails: this.discountOptions
            ?.cummulativeDiscountWithExcludeDetails,
          itemDetails: {
            itemCode: this.discountDetails.itemData.itemDetails.itemCode,
            lotNumber: this.discountDetails.itemData.itemDetails.lotNumber,
            productCategoryCode: this.discountDetails.itemData.itemDetails
              .productCategoryCode,
            productGroupCode: this.discountDetails.itemData.itemDetails
              .productGroupCode,
            priceDetails: this.discountDetails.itemData.itemDetails
              .priceDetails,
            totalQuantity: this.discountDetails.itemData.itemDetails
              .totalQuantity,
            totalValue: this.discountDetails.itemData.itemDetails.totalValue,
            totalWeight: this.discountDetails.itemData.itemDetails.totalWeight,
            netWeight: this.discountDetails.itemData.itemDetails.priceDetails
              .netWeight,
            totalTax: this.discountDetails.itemData.itemDetails.totalTax
          },
          customerDetails: {
            enrollmentDate: this.enrolmentDate,
            ulpId: this.ulpID
          },
          transactionDetails: {
            transactionType: this.discountDetails.itemData.txnType,
            subTransactionType: this.discountDetails.itemData.subTxnType,
            isFrozenRate: this.frozenAB
          },
          eligibleRivaahGhsDetails: this.appliedRivaahGhsDiscNew
            ? this.appliedRivaahGhsDiscNew
            : null
        },
        discountClubId: this.selectedClubbingId,
        discountId: this.selectedClubbingId === null ? discountIDs[0] : null
      });
      // });
      this.isCMDiscount = true;
      // this.enableReasonForNoDiscount = false;
    } else {
      this.isCMDiscount = false;
      // this.enableReasonForNoDiscount = true;
      console.log('none');
      // todo: delete the existing dsicount from apply, clear state
      this.clearItemLevel();
      // this.isDelete = true;
    }

    if (
      this.isCMDiscount === false &&
      this.isABDiscount === false
      // && this.onFirstLoad === false
    ) {
      this.enableReasonForNoDiscount = true;
      this.enablereasonForDiscountChange = false;
      this.isDelete = true;
    } else {
      // if (this.onFirstLoad) this.onFirstLoad = false;
      // else this.enableReasonForNoDiscount = false;
      this.enableReasonForNoDiscount = false;
      this.isDelete = false;
    }
  }

  filterEligibleABDiscounts(ABDiscountOptions) {
    let discountABDataPayload;
    const discountABData = [];
    const discountRefTxnId = [];
    let typeOfDiscount;
    let clubbingId;

    // discountIds.forEach(discountId => {
    if (
      ABDiscountOptions.discounts &&
      ABDiscountOptions.discounts !== null &&
      ABDiscountOptions.discounts.length !== 0
    ) {
      for (const disc of ABDiscountOptions.discounts) {
        // if (disc.discountId === discountId) {
        discountABData.push({
          discountConfigDetails: disc,
          rivaahGhsDetails: disc.rivaahGhsDetails ? disc.rivaahGhsDetails : null
        });
        discountRefTxnId.push(disc.refDiscountTxnId);
        // break;
        // }
      }
      typeOfDiscount = 'single';
      // discountABData = ABDiscountOptions.discounts;
      discountABDataPayload = discountABData;
    }

    if (
      ABDiscountOptions.clubDiscounts &&
      ABDiscountOptions.clubDiscounts !== null &&
      ABDiscountOptions.clubDiscounts.length !== 0
    ) {
      for (const clubDisc of ABDiscountOptions.clubDiscounts) {
        for (const disc of clubDisc.discounts) {
          // if (disc.discountId === discountId) {
          discountABData.push({
            discountConfigDetails: disc,
            rivaahGhsDetails: disc.rivaahGhsDetails
              ? disc.rivaahGhsDetails
              : null
          });
          discountRefTxnId.push(disc.refDiscountTxnId);
          // break;
          // }
        }
        // discountABData = clubDisc.discounts;
        clubbingId = clubDisc.clubDiscountId;
      }
      typeOfDiscount = 'clubbed';
      discountABDataPayload = [
        {
          clubbingId: clubbingId,
          discounts: discountABData
        }
      ];
    }
    // });

    const abCoValidateDiscountRequestDto = {
      businessDate: this.bussinessDay,
      clubDiscounts:
        typeOfDiscount === 'clubbed' ? discountABDataPayload : null,
      customerDetails: {
        enrollmentDate: this.enrolmentDate,
        ulpId: this.ulpID
      },
      discounts: typeOfDiscount === 'single' ? discountABDataPayload : null,
      itemDetails: {
        itemCode: this.discountDetails.itemData.itemDetails.itemCode,
        lotNumber: this.discountDetails.itemData.itemDetails.lotNumber,
        productCategoryCode: this.discountDetails.itemData.itemDetails
          .productCategoryCode,
        productGroupCode: this.discountDetails.itemData.itemDetails
          .productGroupCode,
        priceDetails: this.discountDetails.itemData.itemDetails.priceDetails,
        totalQuantity: this.discountDetails.itemData.itemDetails.totalQuantity,
        totalValue: this.discountDetails.itemData.itemDetails.totalValue,
        totalWeight: this.discountDetails.itemData.itemDetails.totalWeight,
        netWeight: this.discountDetails.itemData.itemDetails.priceDetails
          .netWeight,
        totalTax: this.discountDetails.itemData.itemDetails.totalTax
      },
      transactionDetails: {
        transactionType: this.discountDetails.itemData.txnType,
        subTransactionType: this.discountDetails.itemData.subTxnType,
        isFrozenRate: this.frozenAB,
        refTxnType: TransactionTypeEnum.AB
      }
    };

    this.discountFacade.checkABCOEligibility({
      data: abCoValidateDiscountRequestDto,
      existingDiscounts: this.isExistingDisc ? this.existingDiscounts : null,
      id: discountRefTxnId
    });
  }

  loadABDiscountDetails(ABDiscountOptions, existingDisc?: any) {
    let discountABData;
    let clubDiscountId = null;
    const discountABConfigData = [];
    const discountRefTxnId = [];
    if (
      ABDiscountOptions.discounts &&
      ABDiscountOptions.discounts !== null &&
      ABDiscountOptions.discounts.length !== 0
    ) {
      // for (const disc of this.ABDiscountOptions.discounts) {
      // if (disc.discountId === discountId) {
      //   discountABData = disc;
      //   break;
      // }
      // }
      discountABData = ABDiscountOptions.discounts;
    }
    if (
      ABDiscountOptions.clubDiscounts &&
      ABDiscountOptions.clubDiscounts !== null &&
      ABDiscountOptions.clubDiscounts.length !== 0
    ) {
      for (const clubDisc of ABDiscountOptions.clubDiscounts) {
        // for (const disc of clubDisc.discounts) {
        // if (disc.discountId === discountId) {
        discountABData = clubDisc.discounts;
        clubDiscountId = clubDisc.clubDiscountId;
        //   break;
        // }
        // }
      }
    }

    if (discountABData?.length === 1) {
      this.appliedRivaahGhsDiscNew = discountABData[0].rivaahGhsDetails;
    } else {
      const selectedClubbingDisc = ABDiscountOptions?.clubDiscounts?.filter(
        d => d.clubDiscountId === clubDiscountId
      );
      if (selectedClubbingDisc) {
        selectedClubbingDisc[0]?.discounts.forEach(element => {
          if (
            element.discountType === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
          )
            this.appliedRivaahGhsDiscNew = element.rivaahGhsDetails;
        });
      }
    }

    discountABData?.forEach(discountAB => {
      discountRefTxnId.push(discountAB?.refDiscountTxnId);
      discountABConfigData.push({
        appliedDiscountComponent: discountAB?.appliedDiscountComponent,
        appliedDiscountComponentType: discountAB?.appliedDiscountComponentType,
        appliedDiscountMaster: discountAB?.appliedDiscountMaster,
        discountId: discountAB?.discountId,
        discountType: discountAB?.discountType,
        locationOfferDetails: discountAB?.locationOfferDetails,
        orderConfigDetails: discountAB?.orderConfigDetails,
        regularDiscountComponent: discountAB?.regularDiscountComponent,
        slabConfigDetails: discountAB?.slabConfigDetails,
        slabDiscountComponents: discountAB?.slabDiscountComponents
      });
    });

    this.discountFacade.loadABCODiscountDetails({
      data: {
        businessDate: this.bussinessDay,
        eligibleRivaahGhsDetails: this.appliedRivaahGhsDiscNew
          ? this.appliedRivaahGhsDiscNew
          : null,
        cummulativeDiscountWithExcludeDetails: this.existingDiscounts[0]
          .cummulativeDiscountWithExcludeDetails,
        itemDetails: {
          itemCode: this.discountDetails.itemData.itemDetails.itemCode,
          lotNumber: this.discountDetails.itemData.itemDetails.lotNumber,
          productCategoryCode: this.discountDetails.itemData.itemDetails
            .productCategoryCode,
          productGroupCode: this.discountDetails.itemData.itemDetails
            .productGroupCode,
          priceDetails: this.discountDetails.itemData.itemDetails.priceDetails,
          totalQuantity: this.discountDetails.itemData.itemDetails
            .totalQuantity,
          totalValue: this.discountDetails.itemData.itemDetails.totalValue,
          totalWeight: this.discountDetails.itemData.itemDetails.totalWeight,
          netWeight: this.discountDetails.itemData.itemDetails.priceDetails
            .netWeight,
          totalTax: this.discountDetails.itemData.itemDetails.totalTax
        },
        clubDiscountId: clubDiscountId,
        discountDetilsConfigRequestDto: discountABConfigData
      },
      existingDiscounts: this.isExistingDisc ? this.existingDiscounts : null,
      id: discountRefTxnId
    });
  }

  loadSelectedABDiscountDetails(discountIDs: string[]) {
    this.showErrors = false;
    this.reason = null;
    this.isExistingDisc = false;
    if (discountIDs && discountIDs.length) {
      this.itemLevelDiscountComponent.selectDiscountFormControl.reset();
      // todo : clear method
      // const clubDiscountIds = [];
      // this.ABDiscountOptions?.clubDiscounts?.map(d =>
      //   d.discounts.map(data => {
      //     clubDiscountIds.push(data.discountId);
      //     for (let i = 0; i < discountIDs.length; i++) {
      //       const element = clubDiscountIds.includes(discountIDs[i]);
      //       if (element) {
      //         this.selectedClubbingId =
      //           clubDiscountIds.length === discountIDs.length
      //             ? d.clubDiscountId
      //             : null;
      //         break;
      //       }
      //     }
      //   })
      // );
      if (discountIDs.length === 1) {
        this.selectedClubbingId = null;
      } else {
        this.selectedClubbingId = discountIDs[0];
      }

      this.discountFacade.clearItemLevelDiscountDetails();
      this.clearItemLevel();
      this.itemLevelDiscountsLength = discountIDs.length;

      // if (this.typeOfItemByOrderItemId !== null) {
      // discountIDs.forEach(id => {
      this.loadABCOConfigDetails(
        this.selectedClubbingId === null ? discountIDs[0] : null,
        this.selectedClubbingId
      );
      // this.loadABDiscountDetails(id);
      // });
      // } else {
      // this.filterEligibleABDiscounts(discountIDs);
      // }

      this.isABDiscount = true;
      // this.enableReasonForNoDiscount = false;
    } else {
      this.isABDiscount = false;
      // this.enableReasonForNoDiscount = true;
      console.log('none');
      // todo: delete the existing dsicount from apply, clear state
      this.clearItemLevel();
      // this.isDelete = true;
    }
    if (
      this.isCMDiscount === false &&
      this.isABDiscount === false
      // && this.onFirstLoad === false
    ) {
      this.enableReasonForNoDiscount = true;
      this.enablereasonForDiscountChange = false;
      this.isDelete = true;
    } else {
      // if (this.onFirstLoad) this.onFirstLoad = false;
      // else this.enableReasonForNoDiscount = false;
      this.enableReasonForNoDiscount = false;
      this.isDelete = false;
      this.addStartTracking(
        'pw.instrumentationMessges.unselectItemLevelDiscountMsg'
      );
    }
  }

  loadABCOConfigDetails(discountId: string, clubDiscountId: string) {
    this.discountFacade.loadABCOConfigDetails({
      txnType: this.discountDetails.itemData.txnType,
      subTxnType: this.discountDetails.itemData.subTxnType,
      transactionId: this.discountDetails.itemData.id,
      itemId: this.discountDetails.itemData.itemDetails.orderItemId,
      discountTxnId: clubDiscountId === null ? discountId : null,
      clubbedDiscountId: clubDiscountId,
      itemProductGroupCode: this.discountDetails.itemData.itemDetails
        .productGroupCode
    });
  }

  reasonChange(reason) {
    this.showErrors = false;
    this.reason = reason;
  }

  close() {
    this.dialogRef.close({
      type: 'CLOSE',
      data: {}
    });
  }

  reset() {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );

    if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.itemLevelDiscounts = [...this.itemLevelDiscounts];
      this.showErrors = false;
    }
  }

  refreshDiscounts() {
    this.showErrors = false;
    console.log('refresh called');
    this.isRefresh = true;
    if (this.existingDiscounts.length !== 0) {
      // this.existingDiscounts.forEach(element => {
      this.discountFacade.loadDeleteItemLevelDiscounts({
        request: {
          txnType: this.discountDetails.itemData.txnType,
          subTxnType: this.discountDetails.itemData.subTxnType,
          transactionId: this.discountDetails.itemData.id,
          itemId: this.discountDetails.itemData.itemDetails.itemId
          // discountTxnId: element.discountTxnId
        },
        data: this.existingDiscounts
      });
      // });
    }
  }

  loadAutoDiscAndRefresh() {
    this.discountFacade.loadAutoDiscounts({
      request: {
        customerDetails: {
          enrollmentDate: this.enrolmentDate,
          ulpId: this.ulpID
        },
        discountRequestDto: this.discountDataPayload,
        itemDetails: {
          itemCode: this.discountDetails.itemData.itemDetails.itemCode,
          lotNumber: this.discountDetails.itemData.itemDetails.lotNumber,
          productCategoryCode: this.discountDetails.itemData.itemDetails
            .productCategoryCode,
          productGroupCode: this.discountDetails.itemData.itemDetails
            .productGroupCode,
          priceDetails: this.discountDetails.itemData.itemDetails.priceDetails,
          totalQuantity: this.discountDetails.itemData.itemDetails
            .totalQuantity,
          totalValue: this.discountDetails.itemData.itemDetails.totalValue,
          totalWeight: this.discountDetails.itemData.itemDetails.totalWeight,
          netWeight: this.discountDetails.itemData.itemDetails.priceDetails
            .netWeight,
          totalTax: this.discountDetails.itemData.itemDetails.totalTax
        },
        itemDetailsForCummulativeCal: this.sendCumulativeDiscountDetails(
          this.data.itemData.otherThanSelectedRow
        )
      }
    });
  }

  refresh() {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );

    if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.showErrors = false;
      // this.isRefresh = true;
      this.enablereasonForDiscountChange = false;
      this.enableReasonForNoDiscount = false;

      // todo: update after auto discount impl
      if (this.typeOfCMByRefTxnId !== null) {
        if (this.abDiscountsIds.length !== 0) {
          const tempId = this.selectedItemIds;
          this.selectedItemIds = [];
          setTimeout(() => {
            this.selectedItemIds = this.abDiscountsIds;
          }, 10);
          if (this.abDiscounts.length && this.isRefreshAfterLoading) {
            this.itemLevelDiscounts = this.abDiscounts;
            // if (this.compareIDValues(tempId, this.abDiscountsIds))
            this.addDiscount(this.itemLevelDiscounts);
            this.isRefreshAfterLoading = false;
          } else {
            this.isRefreshAfterLoading = true;
            this.getABDiscounts(this.abDiscountsIds);
          }
        } else {
          this.loadAutoDiscAndRefresh();
        }
        // else if (this.selectedDiscountsIds.length !== 0) {
        //   setTimeout(() => {
        //     this.selectedItemIds = this.selectedDiscountsIds;
        //   }, 10);
        //   this.itemLevelDiscounts = this.selectedDiscounts;
        // }
      } else {
        this.loadAutoDiscAndRefresh();
        // } else if (this.selectedDiscountsIds.length !== 0) {
        //   setTimeout(() => {
        //     this.selectedItemIds = this.selectedDiscountsIds;
        //   }, 10);
        //   this.itemLevelDiscounts = this.selectedDiscounts;
        // }
      }

      // if (this.existingDiscounts.length !== 0) {
      // this.existingDiscounts.forEach(element => {
      //   this.discountFacade.loadDeleteItemLevelDiscounts({
      //     txnType: this.discountDetails.itemData.txnType,
      //     subTxnType: this.discountDetails.itemData.subTxnType,
      //     transactionId: this.discountDetails.itemData.id,
      //     itemId: this.discountDetails.itemData.itemDetails.itemId
      // discountTxnId: element.discountTxnId
      //   });
      // });
      // }
    }
  }

  getABDiscounts(abDiscounts) {
    this.loadSelectedABDiscountDetails(abDiscounts);
  }

  refreshAutoDiscounts() {
    const tempId = this.selectedItemIds;
    const isEdited =
      this.existingDiscounts.filter(disc => disc.isEdited === true).length > 0;
    this.selectedItemIds = [];

    if (this.autoDiscountsIds.length !== 0) {
      setTimeout(() => {
        this.selectedItemIds = this.autoDiscountsIds;
      }, 10);
      this.itemLevelDiscounts = this.autoDiscounts;
      if (this.compareIDValues(tempId, this.autoDiscountsIds) || isEdited)
        this.addDiscount(this.itemLevelDiscounts);
    }
  }

  compareIDValues(exitingData, newData) {
    if (exitingData.length === 0) return true;
    const compareRes = exitingData.filter(
      exitingDataItem => !newData.includes(exitingDataItem)
    );
    if (newData.length === 1) {
      this.selectedClubbingId = null;
    } else {
      this.selectedClubbingId = newData[0];
    }
    if (compareRes.length === 0) return false;
    else return true;
  }

  editing() {
    this.showErrors = false;
  }

  apply() {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );

    if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.txnType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      if (this.itemLevelDiscountComponent.isEditing()) {
        this.itemLevelDiscountComponent.stopEditing();
      }
      this.showErrors = false;
      this.showMoreThanTotalError = false;
      this.showCellValidationError = false;
      this.showRowValidationError = false;
      this.showZeroDiscountError = false;
      setTimeout(() => {
        if (this.isDelete) {
          if (
            (this.enableReasonForNoDiscount ||
              this.enablereasonForDiscountChange) &&
            !this.reason
          ) {
            this.showErrors = true;
            this.showNoDiscountReason = true;
            this.itemLevelDiscountComponent.showErrors();
          } else {
            this.showNoDiscountReason = false;
            this.refreshDiscounts();
            this.isDelete = false;
          }
        } else {
          if (this.validate()) {
            const itemLevelDiscounts = this.itemLevelDiscountComponent.getItemLevelDiscounts();
            const newItemIds = [];
            const isEdited =
              itemLevelDiscounts.filter(disc => disc.isEdited === true).length >
              0;
            itemLevelDiscounts.forEach(element => {
              newItemIds.push(element.discountId);
            });
            if (itemLevelDiscounts[0]?.discountTxnId === null) {
              if (
                !(
                  JSON.stringify(this.addedDiscountIds) ===
                  JSON.stringify(newItemIds)
                ) ||
                isEdited
              ) {
                this.addDiscount(itemLevelDiscounts);
              }
            } else {
              this.editDiscount(itemLevelDiscounts);
            }
          }
        }
      }, 0.01);
    }
  }

  validate() {
    this.showErrors = true;
    this.showCellValidationError = false;
    this.showMoreThanTotalError = false;
    this.showRowValidationError = false;
    this.showZeroDiscountError = false;
    if (!this.itemLevelDiscountComponent.isAllCellEditValid()) {
      this.showCellValidationError = true;
      return false;
    } else if (
      !this.itemLevelDiscountComponent.isRowDiscountGreaterThanZero()
    ) {
      this.showZeroDiscountError = true;
      return false;
    } else if (!this.itemLevelDiscountComponent.isAllRowEditValid()) {
      this.showRowValidationError = true;
      return false;
    } else if (
      this.totalDiscountData?.totalDiscount >
      this.discountDetails?.itemData?.itemDetails?.totalValue
    ) {
      this.showMoreThanTotalError = true;
      return false;
    } else {
      return true;
    }
  }

  addDiscount(itemLevelDiscounts) {
    if (
      (this.enableReasonForNoDiscount || this.enablereasonForDiscountChange) &&
      !this.reason
    ) {
      this.showErrors = true;
      this.showNoDiscountReason = true;
      this.itemLevelDiscountComponent.showErrors();
    } else {
      // Action : Send add action
      this.showNoDiscountReason = false;
      this.itemLevelDiscountsData = itemLevelDiscounts;
      if (this.existingDiscounts.length !== 0) {
        // this.existingDiscounts.forEach(element => {
        this.discountFacade.loadDeleteItemLevelDiscounts({
          request: {
            txnType: this.discountDetails.itemData.txnType,
            subTxnType: this.discountDetails.itemData.subTxnType,
            transactionId: this.discountDetails.itemData.id,
            itemId: this.discountDetails.itemData.itemDetails.itemId
            // discountTxnId: element.discountTxnId
            // });
          },
          data: this.existingDiscounts
        });
        this.existingDiscounts = [];
      } else {
        const tempArray = [];
        this.itemLevelDiscountsData.forEach(element => {
          console.log('element while saving', element);
          tempArray.push({
            clubbedDiscountId: this.selectedClubbingId,
            cummulativeDiscountWithExcludeDetails: this.discountOptions
              ?.cummulativeDiscountWithExcludeDetails,
            discountCode: element.discountCode,
            discountId: element.discountId,
            discountType: element.discountType,
            discountValue: element.discountValue,
            discountValueDetails: {
              data: { discountValueDetails: element.discountValueDetails },
              type: DiscountPopupEnum.DISCOUNT_VALUE_DETAILS
            },
            isEdited: element.isEdited,
            referenceId:
              this.typeOfCMByRefTxnId && this.typeOfCMByRefTxnId !== null
                ? element.refDiscountTxnId
                : null,
            referenceType: null,
            rivaahGhsDiscountDetails: element.rivaahGhsDetails
            // refPaymentId: element?.rivaahGhsDetails?.refPaymentId
            //   ? element?.rivaahGhsDetails?.refPaymentId
            //   : null
          });
        });
        const payload = {
          txnType: this.discountDetails.itemData.txnType,
          subTxnType: this.discountDetails.itemData.subTxnType,
          transactionId: this.discountDetails.itemData.id,
          itemId: this.discountDetails.itemData.itemDetails.itemId,

          requestBody: tempArray
        };
        this.discountFacade.loadSaveItemLevelDiscounts({
          request: payload,
          data: null
        });
      }
    }
  }

  editDiscount(itemLevelDiscounts) {
    console.log('edit', itemLevelDiscounts);
    if (this.enablereasonForDiscountChange && !this.reason) {
    } else {
      itemLevelDiscounts?.forEach(element => {
        if (element.isEdited) {
          this.discountFacade.loadUpdateItemLevelDiscounts({
            txnType: this.discountDetails.itemData.txnType,
            subTxnType: this.discountDetails.itemData.subTxnType,
            transactionId: this.discountDetails.itemData.id,
            itemId: this.discountDetails.itemData.itemDetails.itemId,
            discountTxnId: element.discountTxnId,
            requestBody: {
              discountCode: element.discountCode,
              discountId: element.discountId,
              discountType: element.discountType,
              discountValue: element.discountValue,
              discountValueDetails: {
                data: { discountValueDetails: element.discountValueDetails },
                type: DiscountPopupEnum.DISCOUNT_VALUE_DETAILS
              },
              isEdited: element.isEdited,
              referenceId:
                this.typeOfCMByRefTxnId && this.typeOfCMByRefTxnId !== null
                  ? element.refDiscountTxnId
                  : null,
              referenceType: null,
              rivaahGhsDiscountDetails: element.rivaahGhsDetails
              // refPaymentId: element?.rivaahGhsDetails?.refPaymentId
              //   ? element?.rivaahGhsDetails?.refPaymentId
              //   : null
            }
          });
        }
      });
    }
  }

  clearItemLevel() {
    this.itemLevelDiscounts = [];
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.dialogRef.close({
                type: 'APPLY',
                data: {
                  reason: this.reason,
                  discountsReload: this.discountsReload
                }
              });
            }
          });
      });
  }

  showSimpleNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
            }
          });
      });
  }

  itemLevelDiscMapping(discounts) {
    const tempArray = [];
    discounts.forEach(element => {
      tempArray.push({
        discountDescription: element.discountAttributes.occasion,
        clubbingDiscountType: element.discountAttributes.clubbingDiscountType,
        isEdited: false,
        discountValueDetails:
          element.discountValueDetails.data?.discountValueDetails,
        discountCode: element.discountCode,
        discountId: element.discountId,
        discountType: element.discountType,
        discountTxnId: element.discountTxnId,
        discountValue: element.discountValue,
        refDiscountTxnId: element.referenceId,
        basicCriteriaDetails: {
          maxDiscount: element.basicCriteriaDetails.maxDiscount,
          isEditable: element.basicCriteriaDetails.isEditable
        },
        rivaahGhsDetails: element.rivaahGhsDetails
      });
    });

    console.log('temp array', tempArray);
    return tempArray;
  }

  itemLevelDiscDetailsMapping(discounts) {
    const tempArray = [];
    discounts.forEach(element => {
      tempArray.push({
        discountDescription:
          element.discountConfigDetails.discountAttributes.occasion,
        clubbingDiscountType:
          element.discountConfigDetails.discountAttributes.clubbingDiscountType,
        isEdited: false,
        discountValueDetails:
          element.existingDiscounts !== null
            ? element.existingDiscounts.discountValueDetails.data
            : element.discountValueDetails,
        discountCode: element.discountConfigDetails.discountCode,
        discountId: element.discountConfigDetails.discountId,
        discountType: element.discountConfigDetails.discountType,
        discountTxnId:
          element.existingDiscounts !== null
            ? element.existingDiscounts.discountTxnId
            : null,
        discountValue:
          element.existingDiscounts !== null
            ? element.existingDiscounts.discountValue
            : element.discountValue,
        refDiscountTxnId: element.discountConfigDetails.refDiscountTxnId,
        basicCriteriaDetails: {
          maxDiscount:
            element.discountConfigDetails.basicCriteriaDetails.maxDiscount,
          isEditable:
            element.discountConfigDetails.basicCriteriaDetails.isEditable
        },
        rivaahGhsDetails: element.rivaahGhsDetails
      });
    });

    return tempArray;
  }

  // Instrmentation
  addStartTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.startTracking(translatedMsg);
      });
  }

  addStopTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.stopTracking(translatedMsg);
      });
  }

  resetTcsAmountPopup() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.resetTcs();
        }
      });
  }

  resetTcs() {
    this.commonFacade.setTcsTcsAmountNeedToReset(true);
  }

  deleteTcsAmountPopup() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: 'pw.payment.deleteTcsPaymentLabel'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.discountFacade.clear();
  }
}
