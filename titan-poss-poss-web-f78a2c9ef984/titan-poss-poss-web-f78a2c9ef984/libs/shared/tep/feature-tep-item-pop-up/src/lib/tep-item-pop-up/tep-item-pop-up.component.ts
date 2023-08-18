import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  CashMemoTaxDetails,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreateTepTypesEnum,
  CustomErrors,
  CUSTOMER_TYPE_ENUM,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  GoldPlusLocation,
  LocationSettingAttributesEnum,
  MetalTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SaveTepDataType,
  StoneDetail,
  StoneList,
  TaxTypesEnum,
  TepCashMemoResponseItem
} from '@poss-web/shared/models';
import { TepFacade } from '@poss-web/shared/tep/data-access-direct-tep';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-item-pop-up',
  templateUrl: './tep-item-pop-up.component.html',
  styleUrls: ['./tep-item-pop-up.component.scss']
})
export class TepItemPopUpComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  tepItemDetailsFormGroup: FormGroup;
  currentYear = moment().year();
  currentMonth = moment().month();
  cmItemsList = [];
  selectedDataFromCmList: any;
  isItemCodeMisMatched = false;
  isShowValuationDetails = false;
  isConfirmDisabled = false;
  isLoading$: Observable<boolean>;
  standardMetalPriceDetails: any;
  itemPriceDetails: GetTepPriceDetailsResponse;
  stonesDetailList: StoneDetail[] = [];
  isExceptionScenario: boolean;
  isWeightToleranceAllowedInExceptionScenario: boolean;
  standardGoldRate: number;
  standardPlatinumRate: number;
  standardSilverRate: number;
  createTepTypesEnum = CreateTepTypesEnum;
  customerTypesEnum = CUSTOMER_TYPE_ENUM;
  lotNumberNotMandatoryProductGroupCodes = ['71', '73', '74'];
  selectedCustomer: any;
  isCmMandatory: boolean;
  metalTypeEnumRef = MetalTypeEnum;
  goldPlusLocations = [];
  ucpProductGroupCodes = ['B1', 'B2', 'B3'];
  cashMemoDetailsId = null;
  currentFiscalYear: string;
  totalUcpValue = 0;
  proportionedExchangeValueLabel = '';
  fullValueExchangeValueLabel = '';
  overridingExchangeValueLabel = '';
  isNoOfStonesReturnedGreaterThanMeasuredNoOfStones = false;
  prevGrossWeight = null;
  reducedStoneWeight;
  cmDetailsDoesNotContainItemCodesAlertMsg = '';
  selectedProductIsAlreadyReturnedAlertMsg = '';
  selectedItemQuantityIsAlreadyAddedAlertMsg = '';
  lotNumberNotAvailableInInterbrandAlertMsg = '';
  lotNumberNotAvailableInFullValueTepAlertMsg = '';
  lotNumberNotAvailableInTepAlertMsg = '';
  tepIsNotAllowedForSelectedProductAlertMsg = '';
  interbrandTepIsNotAllowedForSelectedProductAlertMsg = '';
  fullValueTepIsNotAllowedForSelectedProductAlertMsg = '';
  grossWeightShouldBeMoreThanZeroAlertMsg = '';
  tepExceptionConfigurationAlertMsg = '';
  returnedQtyMoreThanPendingQtyAlertMsg = '';
  updateGrossWeightAsPerQuantityEnteredAlertMsg = '';
  totalQtyCannotBeZeroAlertMsg = '';
  totalTax = 0;
  previousPriceValuationRequestParam = null;
  currentLocationCode = '';
  cgstTaxComponent = 0;
  sgstTaxComponent = 0;
  igstTaxComponent = 0;
  utgstTaxComponent = 0;
  exchangeValueWithoutTaxComponent = 0;

  @Output() onAdd = new EventEmitter<any>(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) public itemData: any,
    public dialogRef: MatDialogRef<TepItemPopUpComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private tepFacade: TepFacade,
    private commonFacade: CommonFacade,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private customerFacade: CustomerFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private weightFormatterService: WeightFormatterService,
    private bodeodFacade: SharedBodEodFacade,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    console.log('Item Data :', this.itemData);
    dialogRef.disableClose = true;
    this.tepItemDetailsFormGroup = new FormGroup({
      isCashMemoAvailable: new FormControl('yes'),
      locationCode: new FormControl(this.currentLocationCode, [
        this.fieldValidatorsService.requiredField('Location Code'),
        this.fieldValidatorsService.locationCodeField('Location Code')
      ]),
      cmNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField('CM Number'),
        this.fieldValidatorsService.requestNumberField('CM Number')
      ]),
      fiscalYear: new FormControl('', []),
      valuationQuantity: new FormControl(1, [
        this.fieldValidatorsService.requiredField('Quantity'),
        this.fieldValidatorsService.numbersField('Valuation Quantity')
      ]),
      grossWt: new FormControl('', [
        this.fieldValidatorsService.weightField('Gross Wt'),
        this.fieldValidatorsService.requiredField('Gross Wt')
      ]),
      coinOfferDiscount: new FormControl(false)
    });
    this.getTranslatedAlertMessages();
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.tepFacade.loadGoldPlusLocations(true);
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationCode: string) => {
        this.currentLocationCode = locationCode;
        if (
          this.itemData.tepType !== CreateTepTypesEnum.INTER_BRAND_TEP &&
          this.itemData.tepType !== CreateTepTypesEnum.MANUAL_INTER_BRAND_TEP
        ) {
          this.tepItemDetailsFormGroup
            .get('locationCode')
            .setValue(this.currentLocationCode);
        }
      });
    this.tepFacade
      .getGoldPlusLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GoldPlusLocation[]) => {
        if (response && response.length > 0) {
          this.goldPlusLocations = response
            .map((locationItem: GoldPlusLocation) => {
              return {
                value: locationItem.locationCode,
                description: locationItem.locationCode
              };
            })
            .sort((a, b) =>
              a.value.toUpperCase() < b.value.toUpperCase() ? -1 : 1
            );
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
    this.tepFacade
      .getTepCashMemoResponseItemList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data?.results[0]?.cashMemoDetailsId) {
          this.cashMemoDetailsId = data?.results[0]?.cashMemoDetailsId;
        }
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedCustomer = data;
        }
      });
    if (this.itemData && this.itemData.tepOfferDetails) {
      if (
        this.itemData.tepOfferDetails.offerDetails.type ===
        'TEP_EXCEPTION_CONFIG'
      ) {
        this.isExceptionScenario = true;
        if (
          this.itemData.tepOfferDetails.data &&
          this.itemData.tepOfferDetails.data.isWeightToleranceAllowed
        ) {
          this.isWeightToleranceAllowedInExceptionScenario = true;
        } else {
          this.isWeightToleranceAllowedInExceptionScenario = false;
        }
      } else {
        this.isExceptionScenario = false;
      }
    } else {
      this.isExceptionScenario = false;
      this.isWeightToleranceAllowedInExceptionScenario = false;
    }

    if (!this.itemData.viewSelectedTepItem) {
      this.isCmMandatory =
        this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP ||
        this.itemData.tepType === this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP
          ? this.itemData.tepGeneralCodeConfig.isCMMandatory
          : this.itemData.isCMMandatory;
    }
    if (this.itemData.coinOfferEnabled) {
      this.tepItemDetailsFormGroup.get('isCashMemoAvailable').setValue('yes');
      this.tepItemDetailsFormGroup
        .get('isCashMemoAvailable')
        .updateValueAndValidity();
    }
    this.tepFacade
      .getholdTransactionMetalRates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.mapMetalPriceDetails(data);
        } else {
          this.getStandardMetalPriceList();
        }
      });
    if (
      this.itemData &&
      this.itemData.viewSelectedTepItem &&
      this.itemData.viewSelectedTepItem.viewPriceDetails
    ) {
      this.itemPriceDetails = this.itemData.viewSelectedTepItem.viewPriceDetails;
      this.totalTax = this.itemData.viewSelectedTepItem.totalTax;
      const taxDetails = this.itemData.viewSelectedTepItem.taxDetails;
      this.prepareValuationDetailsToBeShown(
        this.itemPriceDetails,
        this.totalTax,
        taxDetails
      );
    }
    this.isLoading$ = this.tepFacade.getIsLoading();
    this.getValuationPriceDetails();
    this.getTepConfiguration();
    this.getTepCmItemsList();
    this.getError();
    this.getCommonFacadeError();
  }

  getError() {
    this.tepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          if (error.code === ErrorEnums.ERR_ENG_019) {
            const newErrorObj = {
              ...error,
              dynamicValues: {
                ...error.dynamicValues,
                enteredWeight: this.weightFormatterService.format(
                  this.tepItemDetailsFormGroup.get('grossWt').value
                )
              }
            };
            this.errorHandler(newErrorObj);
          } else {
            this.errorHandler(error);
          }
        }
      });
  }

  getCommonFacadeError() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.HAS_ERROR
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
  }

  saveTepItem() {
    let variantCode = '';
    let isDummy = false;
    if (
      this.itemData.tepType &&
      !this.selectedDataFromCmList &&
      this.itemData.itemCode
    ) {
      variantCode = this.itemData.itemCode;
    } else if (
      this.itemData.tepType &&
      this.selectedDataFromCmList &&
      this.selectedDataFromCmList.itemCode
    ) {
      variantCode = this.selectedDataFromCmList.itemCode;
    }

    if (
      this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP &&
      this.itemData.tepType ===
        this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP &&
      this.itemData.tepType &&
      !this.selectedDataFromCmList &&
      this.itemData.itemCode &&
      !this.itemData.viewSelectedTepItem
    ) {
      isDummy = true;
    } else {
      isDummy = false;
    }
    const stonesList = this.stonesDetailList.map((stoneDetail: StoneDetail) => {
      const stone = {
        stoneCode: stoneDetail.stoneCode,
        measuredNoOfStones:
          // stoneDetail.measuredNoOfStones === 0
          //   ? stoneDetail.noOfStones
          //:
          stoneDetail.measuredNoOfStones,
        measuredStoneWeight: stoneDetail.stoneWeight
      };
      return stone;
    });
    const tepData: SaveTepDataType = {
      cashMemoDetailsId:
        this.itemData.viewSelectedTepItem &&
        this.itemData.viewSelectedTepItem.cashMemoDetailsId
          ? this.itemData.viewSelectedTepItem.cashMemoDetailsId
          : this.selectedDataFromCmList &&
            this.selectedDataFromCmList.cashMemoDetailsId
          ? this.selectedDataFromCmList.cashMemoDetailsId
          : null,
      variantCode,
      isDummy,
      cmAvailable:
        this.isCmMandatory &&
        !this.itemData.viewSelectedTepItem &&
        this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value === 'yes'
          ? true
          : this.itemData.viewSelectedTepItem &&
            this.itemData.viewSelectedTepItem.cmAvailable
          ? true
          : false,
      grossWt: this.itemPriceDetails.stdWeight,
      // saleable: this.itemData.viewSelectedTepItem
      //   ? this.itemData.viewSelectedTepItem.saleable
      //   : this.itemData.isTEPSaleBin,
      enableSaleable: this.itemData.isTEPSaleBin,
      saleableValue: this.itemData.viewSelectedTepItem
        ? this.itemData.viewSelectedTepItem.saleable
        : this.itemData.isTEPSaleBin,
      valuation: '',
      exchangeValue: this.itemData.tepType
        ? !this.itemData.isViewTepItemPriceDetails
          ? Number(
              (this.itemPriceDetails.finalValue + this.totalTax).toFixed(2)
            )
          : Number(
              (this.itemPriceDetails.finalValue + this.totalTax).toFixed(2)
            )
        : Number((this.itemPriceDetails.finalValue + this.totalTax).toFixed(2)),
      deductionAmt: this.itemPriceDetails.deductionAmount,
      refundDeduction: this.itemPriceDetails.refundDeductionAmount,
      rowKey: this.itemData.rowKey,
      quantity: this.itemPriceDetails.itemQuantity,
      stonesDetails: stonesList && stonesList?.length ? stonesList : null,
      totalValue: this.itemData.tepType
        ? !this.itemData.isViewTepItemPriceDetails
          ? Number(this.itemPriceDetails.finalValue.toFixed(2))
          : this.itemPriceDetails.finalValue
        : this.itemPriceDetails.finalValue,
      totalWeight:
        this.itemPriceDetails.measuredWeight &&
        this.itemPriceDetails.measuredWeight > 0
          ? this.itemPriceDetails.measuredWeight
          : this.itemPriceDetails.stdWeight,
      unitWeight:
        this.itemPriceDetails.measuredWeight &&
        this.itemPriceDetails.measuredWeight > 0
          ? Number(
              (
                this.itemPriceDetails.measuredWeight /
                this.itemPriceDetails.itemQuantity
              ).toFixed(3)
            )
          : Number(
              (
                this.itemPriceDetails.stdWeight /
                this.itemPriceDetails.itemQuantity
              ).toFixed(3)
            ),
      unitValue: this.itemData.tepType
        ? !this.itemData.isViewTepItemPriceDetails
          ? Number(
              (
                Number(this.itemPriceDetails.finalValue.toFixed(2)) /
                this.itemPriceDetails.itemQuantity
              ).toFixed(2)
            )
          : Number(
              (
                this.itemPriceDetails.finalValue /
                this.itemPriceDetails.itemQuantity
              ).toFixed(2)
            )
        : Number(
            (
              this.itemPriceDetails.finalValue /
              this.itemPriceDetails.itemQuantity
            ).toFixed(2)
          ),
      discountRecovery: this.itemPriceDetails.discountRecovered
        ? this.itemPriceDetails.discountRecovered
        : 0.0,
      discountDetails: {
        type: 'TEP_DISCOUNT_DETAILS',
        data: {
          //isCoinOfferDiscountEnabled: this.itemData.coinOfferEnabled
          isCoinOfferDiscountEnabled: this.tepItemDetailsFormGroup.get(
            'coinOfferDiscount'
          ).value
        }
      },
      stoneDetailsList:
        this.itemPriceDetails.stones &&
        this.itemPriceDetails.stones[0] &&
        this.itemPriceDetails.stones[0].stoneCode &&
        this.itemPriceDetails.stones[0].measuredNoOfStones
          ? this.itemPriceDetails.stones
          : null,
      lotNumber: this.itemPriceDetails.lotNumber,
      productGroupCode:
        this.selectedDataFromCmList &&
        this.selectedDataFromCmList.productGroupCode
          ? this.selectedDataFromCmList.productGroupCode
          : '',
      isRequestApprovalScenario:
        this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value ===
          'yes' &&
        this.selectedDataFromCmList &&
        this.selectedDataFromCmList.productGroupCode === '72' &&
        !this.itemPriceDetails.lotNumber
          ? true
          : false,
      viewTepItemData: this.itemData.viewSelectedTepItem,
      viewPriceDetails: this.itemPriceDetails,
      isExceptionScenario: this.isExceptionScenario
    };

    if (
      this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP ||
      this.itemData.tepType ===
        this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP ||
      this.itemData.tepType === this.createTepTypesEnum.FULL_VALUE_TEP ||
      this.itemData.tepType === this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP
    ) {
      tepData.saleableValue = false;
    }
    this.dialogRef.close(tepData);
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (
          error.code === ErrorEnums.ERR_ENG_019 ||
          error.code === ErrorEnums.ERR_ENG_027
        ) {
          this.tepItemDetailsFormGroup
            .get('grossWt')
            .setValue(this.prevGrossWeight);
          this.tepItemDetailsFormGroup.get('grossWt').updateValueAndValidity();
        }
      });
  }

  getTepCmItemsList() {
    this.tepFacade
      .getTepCashMemoResponseItemList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cmDetails: GetTepCashMemoResponse) => {
        if (cmDetails) {
          if (
            this.itemData &&
            this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP
          ) {
            const cmItemsList = cmDetails.results.filter(
              (result: TepCashMemoResponseItem) => {
                if (
                  this.itemData.tepGeneralCodeConfig.allowedProductGroups.includes(
                    result.productGroupCode
                  )
                ) {
                  return result;
                }
              }
            );
            if (cmItemsList.length === 0) {
              this.showAlertNotification(
                this.cmDetailsDoesNotContainItemCodesAlertMsg
              );
            } else {
              this.cmItemsList = cmItemsList;
            }
          } else if (
            this.itemData &&
            this.itemData.tepType === this.createTepTypesEnum.FULL_VALUE_TEP
          ) {
            const cmItemsList = cmDetails.results;
            if (cmItemsList.length === 0) {
              this.showAlertNotification(
                'CM Details does not have item codes. Please enter proper CM number.'
              );
            } else {
              this.cmItemsList = cmItemsList;
            }
          } else {
            const cmItemsList = cmDetails.results;
            if (cmItemsList.length === 0) {
              this.showAlertNotification(
                'CM Details does not have item codes. Please enter proper CM number.'
              );
            } else {
              this.cmItemsList = cmItemsList;
            }
          }
        }
      });
  }

  getStandardMetalPriceList() {
    this.commonFacade.loadTEPStandardMetalPriceDetails();
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((standardMetalsPrice: any) => {
        this.mapMetalPriceDetails(standardMetalsPrice);
      });
  }

  mapMetalPriceDetails(standardMetalsPrice) {
    this.standardMetalPriceDetails = standardMetalsPrice;
    this.standardGoldRate =
      this.standardMetalPriceDetails &&
      this.standardMetalPriceDetails[MetalTypeEnum.GOLD]
        ? this.standardMetalPriceDetails[MetalTypeEnum.GOLD].ratePerUnit
        : null;
    this.standardPlatinumRate =
      this.standardMetalPriceDetails &&
      this.standardMetalPriceDetails[MetalTypeEnum.PLATINUM]
        ? this.standardMetalPriceDetails[MetalTypeEnum.PLATINUM].ratePerUnit
        : null;
    this.standardSilverRate =
      this.standardMetalPriceDetails &&
      this.standardMetalPriceDetails[MetalTypeEnum.SILVER]
        ? this.standardMetalPriceDetails[MetalTypeEnum.SILVER].ratePerUnit
        : null;

    if (
      (!this.isCmMandatory &&
        this.standardMetalPriceDetails &&
        !this.itemData.coinOfferEnabled) ||
      this.itemData.isViewTepItemPriceDetails
    ) {
      let stonesList = [];
      if (
        this.itemData &&
        this.itemData.viewSelectedTepItem &&
        this.itemData.viewSelectedTepItem.stoneDetails
      ) {
        stonesList = this.itemData.viewSelectedTepItem.stoneDetails.map(
          (stone: StoneDetail) => {
            const stoneData: StoneList = {
              measuredNoOfStones: stone.measuredNoOfStones,
              stoneCode: stone.stoneCode,
              measuredStoneWeight: stone.measuredStoneWeight
                ? stone.measuredStoneWeight
                : stone.stoneWeight
            };
            return stoneData;
          }
        );
      }
      if (
        this.standardMetalPriceDetails &&
        !this.itemData.coinOfferEnabled &&
        this.itemData.tepType !== CreateTepTypesEnum.FULL_VALUE_TEP &&
        this.itemData.tepType !== CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP &&
        !this.itemData.viewSelectedTepItem
      ) {
        const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
          itemCode: this.itemData.itemCode,
          standardPrice: this.standardMetalPriceDetails,
          tepType: this.itemData?.tepType,
          cashMemoDetailsId: null,
          customerType: this.selectedCustomer?.customerType,
          customerMobileNo: this.selectedCustomer?.mobileNumber,
          measuredQuantity: null,
          measuredWeight: null,
          stones: [],
          isDummyCode: true
        };
        this.previousPriceValuationRequestParam = tepPriceDetailsRequestPayload;
        this.tepFacade.loadTepItemPriceDetails(
          tepPriceDetailsRequestPayload,
          this.currentLocationCode,
          this.selectedCustomer?.customerId,
          this.selectedCustomer?.customerType,
          this.itemData.tepType,
          this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
            ? true
            : false
        );
      }
    }
  }
  selectedItemFromCmList(event: any) {
    if (event) {
      this.selectedDataFromCmList = event;
      this.isItemCodeMisMatched =
        this.selectedDataFromCmList.itemCode !== this.itemData.itemCode
          ? true
          : false;
    } else {
      this.isConfirmDisabled = true;
      this.selectedDataFromCmList = null;
    }
  }

  getCmDetails() {
    if (
      this.tepItemDetailsFormGroup.get('cmNumber').value &&
      this.tepItemDetailsFormGroup.get('fiscalYear').value &&
      this.tepItemDetailsFormGroup.get('locationCode').value
    ) {
      this.tepFacade.loadTepCashMemoItemList(
        this.tepItemDetailsFormGroup.get('locationCode').value.toUpperCase(),
        this.tepItemDetailsFormGroup.get('cmNumber').value,
        this.tepItemDetailsFormGroup.get('fiscalYear').value,
        this.itemData?.tepType,
        this.selectedCustomer?.mobileNumber
      );
    }
  }

  disableConfirm() {
    this.isConfirmDisabled = true;
    if (
      this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value === 'yes'
    ) {
      if (
        !this.tepItemDetailsFormGroup.get('locationCode').value ||
        !this.tepItemDetailsFormGroup.get('cmNumber').value ||
        !this.tepItemDetailsFormGroup.get('fiscalYear').value ||
        !this.selectedDataFromCmList
      ) {
        this.isConfirmDisabled = true;
      } else {
        this.isConfirmDisabled = false;
      }
    } else if (
      this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value === 'no'
    ) {
      this.isConfirmDisabled = false;
    } else if (
      !this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value &&
      this.selectedDataFromCmList &&
      (this.itemData.productGroupCode === '73' ||
        this.itemData.productGroupCode === '74' ||
        this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP ||
        this.itemData.tepType === CreateTepTypesEnum.INTER_BRAND_TEP)
    ) {
      this.isConfirmDisabled = false;
    }
    return this.isConfirmDisabled;
  }

  onConfirmClicked() {
    if (
      this.selectedDataFromCmList &&
      this.selectedDataFromCmList.totalPendingQuantity === 0
    ) {
      this.showAlertNotification(this.selectedProductIsAlreadyReturnedAlertMsg);
    } else {
      if (
        (this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value ===
          'no' &&
          (this.itemData.tepType === this.createTepTypesEnum.MANUAL_TEP ||
            this.itemData.tepType === this.createTepTypesEnum.REGULAR_TEP ||
            this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP ||
            this.itemData.tepType ===
              this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP)) ||
        ((this.itemData.tepType === this.createTepTypesEnum.INTER_BRAND_TEP ||
          this.itemData.tepType ===
            this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP) &&
          !this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value &&
          this.selectedDataFromCmList.lotNumber)
      ) {
        if (this.itemData && this.itemData.itemCode) {
          const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
            customerMobileNo: this.selectedCustomer?.mobileNumber
              ? this.selectedCustomer?.mobileNumber
              : null,
            customerType: this.selectedCustomer?.customerType
              ? this.selectedCustomer?.customerType
              : null,
            itemCode:
              (this.itemData.tepType ===
                this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP ||
                this.itemData.tepType ===
                  this.createTepTypesEnum.INTER_BRAND_TEP) &&
              this.selectedDataFromCmList
                ? this.selectedDataFromCmList.itemCode
                : this.itemData.itemCode,
            standardPrice: this.standardMetalPriceDetails,
            tepType: this.itemData?.manualTepType
              ? this.itemData?.manualTepType
              : this.itemData?.tepType
          };

          if (
            (this.itemData.tepType ===
              this.createTepTypesEnum.INTER_BRAND_TEP ||
              this.itemData.tepType ===
                this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP) &&
            !this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value &&
            this.selectedDataFromCmList.lotNumber
          ) {
            tepPriceDetailsRequestPayload.cashMemoDetailsId = this.selectedDataFromCmList.cashMemoDetailsId;
          }

          this.previousPriceValuationRequestParam = tepPriceDetailsRequestPayload;
          this.tepFacade.loadTepItemPriceDetails(
            tepPriceDetailsRequestPayload,
            this.currentLocationCode,
            this.selectedCustomer?.customerId,
            this.selectedCustomer?.customerType,
            this.itemData.tepType,
            this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
              ? true
              : false
          );
        }
      } else if (
        this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value ===
          'yes' ||
        !this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value
      ) {
        if (this.selectedDataFromCmList) {
          if (
            this.selectedDataFromCmList &&
            this.selectedDataFromCmList.itemCode &&
            ((this.lotNumberNotMandatoryProductGroupCodes.includes(
              this.selectedDataFromCmList.productGroupCode
            ) &&
              this.selectedDataFromCmList.lotNumber) ||
              (!this.lotNumberNotMandatoryProductGroupCodes.includes(
                this.selectedDataFromCmList.productGroupCode
              ) &&
                (this.itemData.tepType !== CreateTepTypesEnum.FULL_VALUE_TEP ||
                  this.itemData.tepType !==
                    CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP)) ||
              this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP ||
              this.itemData.tepType ===
                CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP)
          ) {
            const cashMemoIdList = [];
            this.itemData.tepItemList.forEach(tepItem => {
              cashMemoIdList.push(tepItem.cashMemoDetailsId);
            });
            const selectedTepItem = this.itemData.tepItemList.filter(
              tepItem => {
                return (
                  tepItem.cashMemoDetailsId ===
                  this.selectedDataFromCmList.cashMemoDetailsId
                );
              }
            );
            const selectedTepItemCodeList = [];
            selectedTepItem.forEach(tepItem => {
              selectedTepItemCodeList.push(tepItem.variantCode);
            });
            let totalSimilarItemCount = 0;
            this.itemData.tepItemList.forEach(tepItem => {
              if (
                tepItem.cashMemoDetailsId ===
                  this.selectedDataFromCmList.cashMemoDetailsId &&
                tepItem.variantCode === this.selectedDataFromCmList.itemCode
              ) {
                totalSimilarItemCount =
                  totalSimilarItemCount + tepItem.quantity;
              }
            });
            if (
              cashMemoIdList.includes(
                this.selectedDataFromCmList.cashMemoDetailsId
              ) &&
              selectedTepItemCodeList.length &&
              selectedTepItemCodeList.includes(
                this.selectedDataFromCmList.itemCode
              ) &&
              (this.selectedDataFromCmList.totalPendingQuantity === 1 ||
                totalSimilarItemCount ===
                  this.selectedDataFromCmList.totalPendingQuantity)
            ) {
              this.showAlertNotification(
                this.selectedItemQuantityIsAlreadyAddedAlertMsg
              );
            } else {
              const itemCode =
                this.itemData?.tepType ===
                  this.createTepTypesEnum.INTER_BRAND_TEP ||
                this.itemData?.tepType ===
                  this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP
                  ? this.itemData.itemCode
                  : this.selectedDataFromCmList.itemCode;
              this.tepFacade.loadCmListItemTepConfiguration(
                itemCode,
                this.itemData?.tepType
              );
            }
          } else {
            if (
              this.itemData?.tepType ===
                this.createTepTypesEnum.INTER_BRAND_TEP ||
              this.itemData?.tepType ===
                this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP
            ) {
              this.showAlertNotification(
                this.lotNumberNotAvailableInInterbrandAlertMsg
              );
            } else if (
              this.itemData?.tepType ===
                this.createTepTypesEnum.FULL_VALUE_TEP ||
              this.itemData?.tepType ===
                this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP
            ) {
              this.showAlertNotification(
                this.lotNumberNotAvailableInFullValueTepAlertMsg
              );
            } else if (
              this.itemData?.tepType === this.createTepTypesEnum.REGULAR_TEP ||
              this.itemData?.tepType === this.createTepTypesEnum.MANUAL_TEP
            ) {
              this.showAlertNotification(
                this.lotNumberNotAvailableInTepAlertMsg
              );
            }
          }
        } else {
          if (this.itemData && this.itemData.itemCode) {
            const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
              itemCode: this.itemData.itemCode,
              standardPrice: this.standardMetalPriceDetails,
              tepType: this.itemData?.tepType,
              customerType: this.selectedCustomer?.customerType
            };
            this.tepFacade.loadTepItemPriceDetails(
              tepPriceDetailsRequestPayload,
              this.currentLocationCode,
              this.selectedCustomer?.customerId,
              this.selectedCustomer?.customerType,
              this.itemData.tepType,
              this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
                ? true
                : false
            );
          }
        }
      }
    }
  }

  getTranslatedAlertMessages() {
    this.translate
      .get([
        'pw.tep.proportionedExchangeValueLabel',
        'pw.tep.fullValueExchangeValueLabel',
        'pw.tep.overridingExchangeValueLabel',
        'pw.tep.cmDetailsDoesNotContainItemCodesAlertMsg',
        'pw.tep.selectedProductIsAlreadyReturnedAlertMsg',
        'pw.tep.selectedItemQuantityIsAlreadyAddedAlertMsg',
        'pw.tep.lotNumberNotAvailableInInterbrandAlertMsg',
        'pw.tep.lotNumberNotAvailableInFullValueTepAlertMsg',
        'pw.tep.lotNumberNotAvailableInTepAlertMsg',
        'pw.tep.tepIsNotAllowedForSelectedProductAlertMsg',
        'pw.tep.interbrandTepIsNotAllowedForSelectedProductAlertMsg',
        'pw.tep.fullValueTepIsNotAllowedForSelectedProductAlertMsg',
        'pw.tep.grossWeightShouldBeMoreThanZeroAlertMsg',
        'pw.tep.tepExceptionConfigurationAlertMsg',
        'pw.tep.returnedQtyMoreThanPendingQtyAlertMsg',
        'pw.tep.updateGrossWeightAsPerQuantityEnteredAlertMsg',
        'pw.tep.totalQtyCannotBeZeroAlertMsg'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.proportionedExchangeValueLabel =
          translatedMessages['pw.tep.proportionedExchangeValueLabel'];
        this.fullValueExchangeValueLabel =
          translatedMessages['pw.tep.fullValueExchangeValueLabel'];
        this.overridingExchangeValueLabel =
          translatedMessages['pw.tep.overridingExchangeValueLabel'];
        this.cmDetailsDoesNotContainItemCodesAlertMsg =
          translatedMessages['pw.tep.cmDetailsDoesNotContainItemCodesAlertMsg'];
        this.selectedProductIsAlreadyReturnedAlertMsg =
          translatedMessages['pw.tep.selectedProductIsAlreadyReturnedAlertMsg'];
        this.selectedItemQuantityIsAlreadyAddedAlertMsg =
          translatedMessages[
            'pw.tep.selectedItemQuantityIsAlreadyAddedAlertMsg'
          ];
        this.lotNumberNotAvailableInInterbrandAlertMsg =
          translatedMessages[
            'pw.tep.lotNumberNotAvailableInInterbrandAlertMsg'
          ];
        this.lotNumberNotAvailableInFullValueTepAlertMsg =
          translatedMessages[
            'pw.tep.lotNumberNotAvailableInFullValueTepAlertMsg'
          ];
        this.lotNumberNotAvailableInTepAlertMsg =
          translatedMessages['pw.tep.lotNumberNotAvailableInTepAlertMsg'];
        this.tepIsNotAllowedForSelectedProductAlertMsg =
          translatedMessages[
            'pw.tep.tepIsNotAllowedForSelectedProductAlertMsg'
          ];
        this.interbrandTepIsNotAllowedForSelectedProductAlertMsg =
          translatedMessages[
            'pw.tep.interbrandTepIsNotAllowedForSelectedProductAlertMsg'
          ];
        this.fullValueTepIsNotAllowedForSelectedProductAlertMsg =
          translatedMessages[
            'pw.tep.fullValueTepIsNotAllowedForSelectedProductAlertMsg'
          ];
        this.grossWeightShouldBeMoreThanZeroAlertMsg =
          translatedMessages['pw.tep.grossWeightShouldBeMoreThanZeroAlertMsg'];
        this.tepExceptionConfigurationAlertMsg =
          translatedMessages['pw.tep.tepExceptionConfigurationAlertMsg'];
        this.returnedQtyMoreThanPendingQtyAlertMsg =
          translatedMessages['pw.tep.returnedQtyMoreThanPendingQtyAlertMsg'];
        this.updateGrossWeightAsPerQuantityEnteredAlertMsg =
          translatedMessages[
            'pw.tep.updateGrossWeightAsPerQuantityEnteredAlertMsg'
          ];
        this.totalQtyCannotBeZeroAlertMsg =
          translatedMessages['pw.tep.totalQtyCannotBeZeroAlertMsg'];
        console.log(
          this.proportionedExchangeValueLabel,
          ' ',
          this.fullValueExchangeValueLabel,
          ' ',
          this.overridingExchangeValueLabel
        );
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getTepConfiguration() {
    this.tepFacade
      .getCmListItemTepConfiguration()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GetTepItemConfiguratonResponse) => {
        if (response) {
          if (
            ((this.itemData?.tepType === this.createTepTypesEnum.REGULAR_TEP ||
              this.itemData?.tepType === this.createTepTypesEnum.MANUAL_TEP) &&
              response.isTepAllowed) ||
            ((this.itemData?.tepType ===
              this.createTepTypesEnum.INTER_BRAND_TEP ||
              this.itemData?.tepType ===
                this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP) &&
              response.isInterBrandTepAllowed) ||
            ((this.itemData?.tepType ===
              this.createTepTypesEnum.FULL_VALUE_TEP ||
              this.itemData?.tepType ===
                this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP) &&
              response.isFVTAllowed)
          ) {
            let measuredWeight = 0;
            let measuredQuantity = 0;
            if (
              this.selectedDataFromCmList &&
              (this.selectedDataFromCmList.productGroupCode === '73' ||
                this.selectedDataFromCmList.productGroupCode === '74')
            ) {
              measuredQuantity = 1;
              measuredWeight =
                this.selectedDataFromCmList.totalWeight /
                this.selectedDataFromCmList.totalQuantity;
            }
            const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
              cashMemoDetailsId: this.selectedDataFromCmList.cashMemoDetailsId,
              customerMobileNo: this.selectedCustomer?.mobileNumber
                ? this.selectedCustomer?.mobileNumber
                : null,
              customerType: this.selectedCustomer?.customerType
                ? this.selectedCustomer?.customerType
                : null,
              lotNumber: this.selectedDataFromCmList.lotNumber
                ? this.selectedDataFromCmList.lotNumber
                : null,
              measuredWeight: measuredWeight
                ? measuredWeight
                : this.selectedDataFromCmList.totalWeight,
              measuredQuantity: measuredQuantity
                ? measuredQuantity
                : this.selectedDataFromCmList.totalPendingQuantity,
              itemCode: this.selectedDataFromCmList.itemCode,
              standardPrice: this.standardMetalPriceDetails,
              tepType: this.itemData?.tepType
            };
            if (
              (this.itemData.tepType ===
                this.createTepTypesEnum.INTER_BRAND_TEP ||
                this.itemData.tepType ===
                  this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP) &&
              this.isCmMandatory
            ) {
              tepPriceDetailsRequestPayload.isDummyCode = false;
            }
            this.previousPriceValuationRequestParam = tepPriceDetailsRequestPayload;
            this.tepFacade.loadTepItemPriceDetails(
              tepPriceDetailsRequestPayload,
              this.currentLocationCode,
              this.selectedCustomer?.customerId,
              this.selectedCustomer?.customerType,
              this.itemData.tepType,
              this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
                ? true
                : false
            );
          } else {
            if (
              (this.itemData?.tepType === this.createTepTypesEnum.REGULAR_TEP ||
                this.itemData?.tepType ===
                  this.createTepTypesEnum.MANUAL_TEP) &&
              !response.isTepAllowed
            ) {
              this.showAlertNotification(
                this.tepIsNotAllowedForSelectedProductAlertMsg
              );
            } else if (
              (this.itemData?.tepType ===
                this.createTepTypesEnum.INTER_BRAND_TEP ||
                this.itemData?.tepType ===
                  this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP) &&
              !response.isInterBrandTepAllowed
            ) {
              this.showAlertNotification(
                this.interbrandTepIsNotAllowedForSelectedProductAlertMsg
              );
            } else if (
              (this.itemData?.tepType ===
                this.createTepTypesEnum.FULL_VALUE_TEP ||
                this.itemData?.tepType ===
                  this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP) &&
              !response.isFVTAllowed
            ) {
              this.showAlertNotification(
                this.fullValueTepIsNotAllowedForSelectedProductAlertMsg
              );
            }
          }
        }
      });
  }

  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.itemPriceDetails.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  calculateTax(taxDetails: CashMemoTaxDetails, totalItemValue: number): number {
    let taxValue = 0;
    let cessTaxValue = 0;

    if (taxDetails.data !== null) {
      for (const tax of Object.keys(taxDetails.data)) {
        switch (tax) {
          case 'CGST':
            this.cgstTaxComponent = this.currencyRoundOff(
              (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
            );
            break;
          case 'SGST':
            this.sgstTaxComponent = this.currencyRoundOff(
              (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
            );
            break;
          case 'IGST':
            this.igstTaxComponent = this.currencyRoundOff(
              (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
            );
            break;
          case 'UTGST':
            this.utgstTaxComponent = this.currencyRoundOff(
              (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
            );
            break;
        }
        taxValue += this.currencyRoundOff(
          (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
        );
      }
    }
    if (taxDetails.cess !== null) {
      for (const tax of Object.keys(taxDetails.cess)) {
        if (taxDetails.cess[tax].cessOnTax === true) {
          cessTaxValue = (taxValue * taxDetails.cess[tax].cessPercentage) / 100;
        } else {
          cessTaxValue =
            (totalItemValue * taxDetails.cess[tax].cessPercentage) / 100;
        }
      }
    }
    return (
      this.currencyRoundOff(cessTaxValue) + this.currencyRoundOff(taxValue)
    );
  }

  calculateTotalValueForUCP(
    itemPriceDetails: GetTepPriceDetailsResponse,
    taxDetails: CashMemoTaxDetails,
    finalValue: number
  ): number {
    let taxValue = 0;
    let cessTaxValue = 0;
    let totalValue = 0;

    if (taxDetails.data !== null) {
      for (const tax of Object.keys(taxDetails.data)) {
        if (tax !== TaxTypesEnum.HALLMARK_GST) {
          taxValue += taxDetails.data[tax].taxPercentage / 100;
        }
      }
    }
    if (taxDetails.cess !== null) {
      for (const tax of Object.keys(taxDetails.cess)) {
        if (taxDetails.cess[tax].cessOnTax === true) {
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        } else {
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        }
      }
    }

    totalValue = finalValue / (cessTaxValue + taxValue + 1);

    return this.currencyRoundOff(
      totalValue -
        itemPriceDetails.discountRecovered -
        itemPriceDetails.deductionAmount
    );
  }

  prepareValuationDetailsToBeShown(
    priceDetails: GetTepPriceDetailsResponse,
    totalTax?: number,
    taxDetails?: any
  ) {
    this.cgstTaxComponent = 0;
    this.sgstTaxComponent = 0;
    this.igstTaxComponent = 0;
    this.utgstTaxComponent = 0;
    this.exchangeValueWithoutTaxComponent = 0;
    this.totalTax = 0;
    this.totalUcpValue = 0;
    this.itemPriceDetails = { ...priceDetails };
    if (
      (this.itemPriceDetails.isUCPproduct &&
        this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP) ||
      (this.itemData.tepType === CreateTepTypesEnum.REGULAR_TEP &&
        this.selectedCustomer?.customerType ===
          CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
        this.itemPriceDetails?.isUCPproduct)
    ) {
      if (
        !totalTax &&
        this.itemPriceDetails.taxDetails &&
        this.itemPriceDetails.taxDetails.data
      ) {
        this.itemPriceDetails.finalValue = this.calculateTotalValueForUCP(
          this.itemPriceDetails,
          this.itemPriceDetails.taxDetails,
          this.itemPriceDetails.finalValue
        );
      }
      if (
        !totalTax &&
        this.itemPriceDetails.taxDetails &&
        this.itemPriceDetails.taxDetails.data
      ) {
        this.totalTax = this.calculateTax(
          this.itemPriceDetails.taxDetails,
          this.itemPriceDetails.finalValue
        );
      }
    }
    if (
      !totalTax &&
      this.itemPriceDetails.taxDetails &&
      this.itemPriceDetails.taxDetails.data
    ) {
      this.totalTax = this.calculateTax(
        this.itemPriceDetails.taxDetails,
        this.itemPriceDetails.finalValue
      );
      this.exchangeValueWithoutTaxComponent = this.itemPriceDetails.finalValue;
    } else {
      this.cgstTaxComponent = taxDetails?.data?.CGST?.taxValue
        ? taxDetails?.data?.CGST?.taxValue
        : 0;
      this.sgstTaxComponent = taxDetails?.data?.SGST?.taxValue
        ? taxDetails?.data?.SGST?.taxValue
        : 0;
      this.igstTaxComponent = taxDetails?.data?.IGST?.taxValue
        ? taxDetails?.data?.IGST?.taxValue
        : 0;
      this.utgstTaxComponent = taxDetails?.data?.UTGST?.taxValue
        ? taxDetails?.data?.UTGST?.taxValue
        : 0;
      this.totalTax = totalTax ? totalTax : 0;
      this.exchangeValueWithoutTaxComponent = this.itemPriceDetails.finalValue;
    }
    if (
      this.ucpProductGroupCodes.includes(this.itemPriceDetails.productGroupCode)
    ) {
      const finalValue = this.itemPriceDetails.finalValue
        ? this.itemPriceDetails.finalValue
        : 0;
      const deductionAmt = this.itemPriceDetails.deductionAmount
        ? this.itemPriceDetails.deductionAmount
        : 0;
      const discountRecovered = this.itemPriceDetails.discountRecovered
        ? this.itemPriceDetails.discountRecovered
        : 0;
      this.totalUcpValue = finalValue + deductionAmt + discountRecovered;
    }
    this.stonesDetailList =
      this.itemPriceDetails.stones &&
      this.itemPriceDetails.stones[0] &&
      this.itemPriceDetails.stones[0].stoneCode
        ? [...this.itemPriceDetails.stones]
        : [];
    if (
      this.itemData.tepType === CreateTepTypesEnum.INTER_BRAND_TEP &&
      (this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value === 'no' ||
        !this.isCmMandatory)
    ) {
      this.tepItemDetailsFormGroup
        .get('grossWt')
        .setValue(
          this.weightFormatterService.format(
            this.itemPriceDetails.measuredWeight
              ? this.itemPriceDetails.measuredWeight
              : 0
          )
        );
    } else {
      this.tepItemDetailsFormGroup
        .get('grossWt')
        .setValue(
          this.weightFormatterService.format(
            this.itemPriceDetails.measuredWeight
              ? this.itemPriceDetails.measuredWeight
              : this.itemPriceDetails.stdWeight
          )
        );
    }
    this.prevGrossWeight = this.weightFormatterService.format(
      this.itemPriceDetails.measuredWeight
        ? this.itemPriceDetails.measuredWeight
        : this.itemPriceDetails.stdWeight
    );
    if (
      this.isWeightToleranceAllowedInExceptionScenario ||
      this.itemData?.isTepRequestApprovedScenario
    ) {
      this.tepItemDetailsFormGroup.get('grossWt').disable();
    } else {
      this.tepItemDetailsFormGroup.get('grossWt').enable();
    }
    this.tepItemDetailsFormGroup.get('grossWt').updateValueAndValidity();

    this.tepItemDetailsFormGroup
      .get('valuationQuantity')
      .setValue(this.itemPriceDetails.itemQuantity);
    if (
      (this.itemPriceDetails.productGroupCode !== '73' &&
        this.itemPriceDetails.productGroupCode !== '74') ||
      this.itemData?.isTepRequestApprovedScenario
    ) {
      this.tepItemDetailsFormGroup.get('valuationQuantity').disable();
    }
    this.tepItemDetailsFormGroup
      .get('valuationQuantity')
      .updateValueAndValidity();
    this.showValuationDetails();
  }

  getValuationPriceDetails() {
    this.tepFacade
      .getTepPriceDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((priceDetails: GetTepPriceDetailsResponse) => {
        if (priceDetails) {
          this.itemData.isViewTepItemPriceDetails = false;
          this.prepareValuationDetailsToBeShown(priceDetails);
        }
      });
  }

  onGrossWeightChanged() {
    if (
      this.tepItemDetailsFormGroup.get('grossWt').value &&
      this.tepItemDetailsFormGroup.get('grossWt').valid
    ) {
      if (
        Number(this.tepItemDetailsFormGroup.get('grossWt').value) === 0 ||
        Number(this.tepItemDetailsFormGroup.get('grossWt').value) < 0
      ) {
        this.tepItemDetailsFormGroup.get('grossWt').setValue(null);
        this.tepItemDetailsFormGroup.get('grossWt').updateValueAndValidity();
        this.showAlertNotification(
          this.grossWeightShouldBeMoreThanZeroAlertMsg
        );
      } else {
        const stonesList = this.itemPriceDetails.stones.map(
          (stoneDetail: StoneDetail) => {
            const stone = {
              stoneCode: stoneDetail.stoneCode,
              measuredNoOfStones:
                // stoneDetail.measuredNoOfStones === 0
                //   ? stoneDetail.noOfStones
                //:
                stoneDetail.measuredNoOfStones,
              measuredStoneWeight: stoneDetail.stoneWeight
            };
            return stone;
          }
        );
        const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
          cashMemoDetailsId:
            this.selectedDataFromCmList &&
            this.selectedDataFromCmList.cashMemoDetailsId
              ? this.selectedDataFromCmList.cashMemoDetailsId
              : this.itemData.viewSelectedTepItem &&
                this.itemData.viewSelectedTepItem.cashMemoDetailsId
              ? this.itemData.viewSelectedTepItem.cashMemoDetailsId
              : null,
          customerMobileNo: this.selectedCustomer?.mobileNumber
            ? this.selectedCustomer?.mobileNumber
            : null,
          customerType: this.selectedCustomer?.customerType
            ? this.selectedCustomer?.customerType
            : null,
          lotNumber:
            this.selectedDataFromCmList && this.selectedDataFromCmList.lotNumber
              ? this.selectedDataFromCmList.lotNumber
              : this.itemData.viewSelectedTepItem &&
                this.itemData.viewSelectedTepItem.lotNumber
              ? this.itemData.viewSelectedTepItem.lotNumber
              : null,
          itemCode: this.itemPriceDetails.itemCode,
          standardPrice: this.standardMetalPriceDetails,
          measuredWeight: this.tepItemDetailsFormGroup.get('grossWt').value
            ? Number(this.tepItemDetailsFormGroup.get('grossWt').value)
            : 0,
          measuredQuantity: this.tepItemDetailsFormGroup.get(
            'valuationQuantity'
          ).value,
          tepType: this.itemData?.tepType,
          stones: stonesList
        };
        this.previousPriceValuationRequestParam = tepPriceDetailsRequestPayload;
        this.tepFacade.loadTepItemPriceDetails(
          tepPriceDetailsRequestPayload,
          this.currentLocationCode,
          this.selectedCustomer?.customerId,
          this.selectedCustomer?.customerType,
          this.itemData.tepType,
          this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
            ? true
            : false
        );
      }
    }
  }

  onChangingQuantity() {
    if (
      this.tepItemDetailsFormGroup.get('grossWt').value &&
      this.tepItemDetailsFormGroup.get('grossWt').valid &&
      this.tepItemDetailsFormGroup.get('valuationQuantity').value &&
      this.tepItemDetailsFormGroup.get('valuationQuantity').valid
    ) {
      if (this.isExceptionScenario) {
        this.showAlertNotification(this.tepExceptionConfigurationAlertMsg);
        this.tepItemDetailsFormGroup.get('valuationQuantity').setValue(1);
        this.tepItemDetailsFormGroup
          .get('valuationQuantity')
          .updateValueAndValidity();
      } else {
        if (
          this.tepItemDetailsFormGroup.get('isCashMemoAvailable').value ===
            'yes' &&
          this.selectedDataFromCmList &&
          this.tepItemDetailsFormGroup.get('valuationQuantity').value >
            this.selectedDataFromCmList.totalPendingQuantity
        ) {
          this.showAlertNotification(
            this.returnedQtyMoreThanPendingQtyAlertMsg
          );
          this.tepItemDetailsFormGroup.get('valuationQuantity').setValue(1);
          this.tepItemDetailsFormGroup
            .get('valuationQuantity')
            .updateValueAndValidity();
        } else {
          this.tepItemDetailsFormGroup.get('grossWt').setValue('');
          this.tepItemDetailsFormGroup.get('grossWt').updateValueAndValidity();
          this.showAlertNotification(
            this.updateGrossWeightAsPerQuantityEnteredAlertMsg
          );
        }
      }
    } else if (
      this.tepItemDetailsFormGroup.get('valuationQuantity').value === 0
    ) {
      this.tepItemDetailsFormGroup.get('valuationQuantity').setValue(null);
      this.tepItemDetailsFormGroup
        .get('valuationQuantity')
        .updateValueAndValidity();
      this.showAlertNotification(this.totalQtyCannotBeZeroAlertMsg);
    }
  }

  getUpdatedStoneDetailsListFromGrid(event: any) {
    this.isNoOfStonesReturnedGreaterThanMeasuredNoOfStones = false;
    if (event && event.length > 0) {
      const stoneList = event.map((stoneDetails: any) => {
        if (
          Number(stoneDetails.noOfStonesReturned) >
          Number(stoneDetails.actualNoOfStones)
        ) {
          this.isNoOfStonesReturnedGreaterThanMeasuredNoOfStones = true;
        }
        return {
          measuredNoOfStones: stoneDetails.noOfStonesReturned
            ? stoneDetails.noOfStonesReturned
            : 0,
          stoneCode: stoneDetails.stoneCode,
          measuredStoneWeight: stoneDetails.totalCarats
        };
      });
      const totalTepStoneWeight =
        this.itemPriceDetails.stonePriceDetails.stoneWeight * 0.2;
      this.reducedStoneWeight = 0;
      if (event && event.length > 0) {
        stoneList.forEach(data => {
          this.reducedStoneWeight += Number(data.measuredStoneWeight) * 0.2;
        });
        this.reducedStoneWeight =
          Number(totalTepStoneWeight.toFixed(3)) -
          Number(this.reducedStoneWeight.toFixed(3));
      }
      const tepPriceDetailsRequestPayload: GetTepPriceDetailsRequestPayload = {
        cashMemoDetailsId:
          this.selectedDataFromCmList &&
          this.selectedDataFromCmList.cashMemoDetailsId
            ? this.selectedDataFromCmList.cashMemoDetailsId
            : this.itemData.viewSelectedTepItem &&
              this.itemData.viewSelectedTepItem.cashMemoDetailsId
            ? this.itemData.viewSelectedTepItem.cashMemoDetailsId
            : null,
        customerMobileNo: this.selectedCustomer?.mobileNumber
          ? this.selectedCustomer?.mobileNumber
          : null,
        customerType: this.selectedCustomer?.customerType
          ? this.selectedCustomer?.customerType
          : null,
        lotNumber:
          this.selectedDataFromCmList && this.selectedDataFromCmList.lotNumber
            ? this.selectedDataFromCmList.lotNumber
            : this.itemData.viewSelectedTepItem &&
              this.itemData.viewSelectedTepItem.lotNumber
            ? this.itemData.viewSelectedTepItem.lotNumber
            : null,
        measuredWeight: this.itemPriceDetails.measuredWeight
          ? this.itemPriceDetails.measuredWeight
          : this.itemPriceDetails.stdWeight,
        measuredQuantity:
          this.selectedDataFromCmList &&
          this.selectedDataFromCmList.totalPendingQuantity
            ? this.selectedDataFromCmList.totalPendingQuantity
            : this.itemPriceDetails.itemQuantity
            ? this.itemPriceDetails.itemQuantity
            : 0,
        itemCode:
          this.selectedDataFromCmList && this.selectedDataFromCmList.itemCode
            ? this.selectedDataFromCmList.itemCode
            : this.itemData.itemCode,
        standardPrice: this.standardMetalPriceDetails,
        stones: stoneList,
        tepType: this.itemData?.tepType
      };
      this.previousPriceValuationRequestParam = tepPriceDetailsRequestPayload;
      this.tepFacade.loadTepItemPriceDetails(
        tepPriceDetailsRequestPayload,
        this.currentLocationCode,
        this.selectedCustomer?.customerId,
        this.selectedCustomer?.customerType,
        this.itemData.tepType,
        this.itemData.tepType === CreateTepTypesEnum.FULL_VALUE_TEP
          ? true
          : false
      );
    }
  }

  showMetalPriceDetail(metalCode: string) {
    let metalValue = 0.0;
    if (
      this.itemPriceDetails &&
      this.itemPriceDetails.metalPriceDetails &&
      this.itemPriceDetails.metalPriceDetails.metalPrices
    ) {
      this.itemPriceDetails.metalPriceDetails.metalPrices.forEach(
        metalPriceObject => {
          if (metalPriceObject.metalTypeCode === metalCode) {
            metalValue = metalPriceObject.metalValue
              ? metalPriceObject.metalValue
              : 0.0;
          }
        }
      );
    }
    return metalValue;
  }

  getTotalStoneFinalValue() {
    let totalStoneValue = 0.0;
    if (this.itemPriceDetails && this.itemPriceDetails.stonePriceDetails) {
      totalStoneValue = this.itemPriceDetails.stonePriceDetails
        .preDiscountValue;
    }
    return totalStoneValue;
  }

  showValuationDetails() {
    this.isShowValuationDetails = true;
  }

  cancelAddingTepItem() {
    this.dialogRef.close(null);
  }

  getIsCashMemoAvailableOrNot(event) {
    if (event && event.value === 'no') {
      this.cmItemsList = [];
      this.isItemCodeMisMatched = false;
      this.tepItemDetailsFormGroup
        .get('locationCode')
        .setValue(this.currentLocationCode);
      this.tepItemDetailsFormGroup.get('cmNumber').setValue('');
      this.tepItemDetailsFormGroup.get('fiscalYear').setValue('');
      this.tepItemDetailsFormGroup.updateValueAndValidity();
      this.selectedDataFromCmList = null;
    }
  }

  convertToNumber(data): number {
    return data ? Number(data) : null;
  }

  coinOfferDiscountSelectionChanged(event: any) {
    if (event) {
      this.tepItemDetailsFormGroup
        .get('coinOfferDiscount')
        .setValue(event.checked);
      this.tepItemDetailsFormGroup
        .get('coinOfferDiscount')
        .updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.isShowValuationDetails = false;
    this.tepFacade.clearCmListItemTepConfiguration();
    this.isExceptionScenario = false;
    this.isCmMandatory = false;
    this.isWeightToleranceAllowedInExceptionScenario = false;
    this.tepFacade.resetTepItemValuationDetails(null);
    this.tepFacade.resetTepCmItemList(null);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
