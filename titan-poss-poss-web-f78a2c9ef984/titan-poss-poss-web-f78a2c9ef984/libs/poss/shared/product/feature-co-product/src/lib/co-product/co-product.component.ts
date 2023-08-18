import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  COItemDetails,
  COItemDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  RsoDetailsPayload,
  SetCOTotalProductValuesPayload,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';

const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-co-product',
  templateUrl: './co-product.component.html',
  styleUrls: ['./co-product.component.scss']
})
export class CoProductComponent implements OnInit, OnDestroy {
  rsoDetails$: Subject<RsoDetailsPayload[]> = new Subject<
    RsoDetailsPayload[]
  >();
  rsoDetails: RsoDetailsPayload[] = [];
  noOfProducts: number;
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  customerOrderId = null;
  taxAmt = 0;
  finalAmt = 0;
  totalAmt = 0;
  roundOff = 0;
  totalGrossWeight = 0;
  totalOrderValue = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  weightUnit = 'gms';
  coProducts: COItemDetailsResponse;
  isLoading$: Observable<boolean>;
  businessDate: Moment;
  isDeleteFlag = false;
  COItemDetails = [];
  isRsoSelected = true;
  clearAllData$: Subject<null> = new Subject<null>();
  deleteSuccessResponse$: Subject<COItemDetails> = new Subject<COItemDetails>();
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private productFacade: ProductFacade,
    private commonFacade: CommonFacade,
    private paymentFacade: PaymentFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    public discountFacade: DiscountFacade
  ) {}

  ngOnInit(): void {
    this.componentInit();
    this.getCommonRes();
    this.getProductsRes();
  }

  componentInit() {
    this.productFacade.loadRSODetails(RSOCode);
    this.productFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoDetailsPayload[]) => {
        this.rsoDetails = [];
        if (rsoDetails.length) {
          rsoDetails.forEach(element =>
            this.rsoDetails.push({ code: element.code, name: element.name })
          );
          this.rsoDetails$.next(this.rsoDetails);
        }
      });
    this.isLoading$ = this.productFacade.getIsLoading();
    this.productFacade
      .getClearCOProductGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.clearPage(true);
        }
      });
  }

  getProductsRes() {
    this.productFacade
      .getItemIDList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemIDInfo: any) => {
        console.log('coitemIDInfo', itemIDInfo);
        if (itemIDInfo) {
          this.noOfProducts = itemIDInfo?.item?.itemIdList?.length;
          itemIDInfo?.item?.itemIdList?.forEach(element => {
            this.productFacade.getItemFromCO({
              id: this.customerOrderId,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              itemId: element,
              headerData: itemIDInfo?.item,
              loadHeaderInfo: itemIDInfo?.isGetHeaderDetails ? true : false,
              isAddItem: !itemIDInfo?.isUpdate
            });
          });
        }
      });

    this.productFacade
      .getCOItemDetails()
      .pipe(
        withLatestFrom(this.productFacade.getSpecificCOItemId()),
        takeUntil(this.destroy$)
      )
      .subscribe(([COItems, COItemId]) => {
        console.log('co items', COItems, COItemId);
        let specificCOItem;
        this.COItemDetails = COItems;
        if (COItems.length && !this.isDeleteFlag) {
          specificCOItem = COItems.filter(
            item => item?.itemDetails?.itemId === COItemId.id
          )[0];
          this.coProducts = {
            ...specificCOItem,
            itemDetails: {
              ...specificCOItem.itemDetails,
              priceBreakUp: calculatePriceBreakup(
                specificCOItem.itemDetails?.priceDetails,
                specificCOItem.itemDetails?.taxDetails?.data,
                {
                  isUcp: specificCOItem.itemDetails?.priceDetails?.isUcp,
                  totalValue: specificCOItem.itemDetails?.totalValue,
                  weightUnit: this.weightUnit,
                  weight: specificCOItem.itemDetails?.totalWeight
                },
                specificCOItem.itemDetails.totalDiscount
              ),
              isAdd: COItemId.isAdd
            }
          };

          for (const element of this.COItemDetails) {
            if (element.itemDetails.employeeCode === null) {
              this.isRsoSelected = false;
              this.discountFacade.setIsRsoSelected(this.isRsoSelected);
              break;
            } else {
              this.isRsoSelected = true;
            }
            this.discountFacade.setIsRsoSelected(this.isRsoSelected);
          }
          this.getTotalProductValues(COItems, null, COItemId.id);
        } else {
          this.isRsoSelected = true;
          this.discountFacade.setIsRsoSelected(this.isRsoSelected);
        }
      });

    this.productFacade
      .getDeleteItemFromCOResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (COItem: {
          responseData: COItemDetailsResponse;
          coItemDetails: COItemDetails;
        }) => {
          console.log(COItem, 'deleted item co');
          if (COItem && this.isDeleteFlag) {
            this.getTotalProductValues(
              this.COItemDetails,
              COItem.responseData,
              null
            );
            this.deleteSuccessResponse$.next(COItem.coItemDetails);
          }
        }
      );
  }

  getCommonRes() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        if (transactionID) {
          this.clearPage(false);
          this.customerOrderId = transactionID;
          this.productFacade.loadRSODetails(RSOCode);
        } else {
          this.customerOrderId = null;
          this.paymentFacade.clearPaymentDetails();
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
        }
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });
    this.discountFacade.setIsRsoSelected(this.isRsoSelected);
  }

  updateSelectedRsoForCO(event) {
    console.log('selected rso for co', event);
    this.productFacade.partialUpdateItemInCO({
      id: this.customerOrderId,
      itemId: event.oldData.itemId,
      itemDetails: {
        employeeCode: event.selectedData === null ? '' : event.selectedData
      },
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      oldData: event.oldData
    });
  }

  getTotalProductValues(
    COItemDetails: COItemDetailsResponse[],
    headerResponse?: COItemDetailsResponse,
    COItemId?: string
  ) {
    console.log('getTotalProductValues Data', COItemDetails, headerResponse);
    let productQty = 0;
    let productWeight = 0;
    let productDisc = 0;
    let productAmt = 0;
    let specificCOItem;

    if (COItemDetails.length !== 0) {
      if (this.isDeleteFlag && headerResponse) {
        this.taxAmt = headerResponse?.totalTax;
        this.totalAmt = headerResponse?.totalValue;
        this.finalAmt = headerResponse?.finalValue;
        this.roundOff = headerResponse?.roundingVariance;
        this.totalGrossWeight = headerResponse?.totalGrossWeight;
        this.totalOrderValue = headerResponse?.totalOrderValue;
        this.hallmarkCharges = headerResponse?.hallmarkCharges;
        this.hallmarkDiscount = headerResponse?.hallmarkDiscount;
        this.commonFacade.setMinCOValue(
          headerResponse.minOrderPayment > headerResponse.minDiscountPayment
            ? headerResponse.minOrderPayment
            : headerResponse.minDiscountPayment
        );
      } else if (!this.isDeleteFlag) {
        specificCOItem = COItemDetails.filter(
          x => x?.itemDetails?.itemId === COItemId
        )[0];
        console.log('specificCOItem', specificCOItem);
        this.taxAmt = specificCOItem?.totalTax;
        this.finalAmt = specificCOItem?.finalValue;
        this.totalAmt = specificCOItem?.totalValue;
        this.roundOff = specificCOItem?.roundingVariance;
        this.totalGrossWeight = specificCOItem?.totalGrossWeight;
        this.totalOrderValue = specificCOItem?.totalOrderValue;
        this.hallmarkCharges = specificCOItem?.hallmarkCharges;
        this.hallmarkDiscount = specificCOItem?.hallmarkDiscount;
        this.productFacade.setMetalRate(specificCOItem.metalRateList);
      }
      COItemDetails.forEach(element => {
        productQty = productQty + element?.itemDetails?.totalQuantity;
        productWeight = productWeight + element?.itemDetails?.totalWeight;
        productDisc = productDisc + element?.itemDetails?.totalDiscount;
        productAmt = productAmt + element?.itemDetails?.totalValue;
      });
    } else {
      this.taxAmt = 0;
      this.finalAmt = 0;
      this.totalAmt = 0;
      this.roundOff = 0;
      this.totalGrossWeight = 0;
      this.totalOrderValue = 0;
      this.commonFacade.setMinCOValue(0);
    }

    const totalValues: SetCOTotalProductValuesPayload = {
      productQty: productQty,
      productWeight: productWeight,
      productDisc: productDisc,
      productAmt: productAmt,
      taxAmt: this.taxAmt,
      finalAmt: this.finalAmt,
      roundOff: this.roundOff,
      totalGrossWeight: this.totalGrossWeight,
      totalOrderValue: this.totalOrderValue,
      coinQty: 0,
      coinDisc: 0,
      totalAmt: this.totalAmt,
      hallmarkCharges: this.hallmarkCharges,
      hallmarkDiscount: this.hallmarkDiscount
    };

    console.log('totalValues', totalValues);
    this.commonFacade.setCOTotalProductValues(totalValues);
  }

  deleteItemFromCustomerOrder(deleteEvent) {
    this.isDeleteFlag = true;
    this.productFacade.deleteItemFromCO({
      id: this.customerOrderId,
      itemId: deleteEvent.itemId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      itemDetails: deleteEvent
    });
  }

  clearPage(isClearAll: boolean) {
    if (isClearAll) {
    }
    this.productFacade.resetCOValues();
    this.clearAllData$.next();
    this.isDeleteFlag = false;
    this.taxAmt = 0;
    this.finalAmt = 0;
    this.roundOff = 0;
    this.totalGrossWeight = 0;
    this.totalOrderValue = 0;
    this.commonFacade.setMinCOValue(0);
    this.customerOrderId = null;
    this.noOfProducts = 0;
    this.COItemDetails = [];
    this.isRsoSelected = true;
    this.hallmarkCharges = 0;
    this.hallmarkDiscount = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
