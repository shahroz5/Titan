import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  LocationSettingAttributesEnum,
  PossHomeKeyEnum, 
  SearchEmitEvent, 
  SearchProductList,
  ProductDetails,
  TransactionTypeEnum,
  ProductTypesEnum,
  CashMemoTaxDetails,
  ItemHallmarkDetails,
  ItemDetailsPopupTabType,
  MetalTypeEnum,
  ItemDetailPopupserviceAbstraction,
  ProductPriceDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  TaxTypesEnum,
} from '@poss-web/shared/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { CurrencySymbolService, CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE, POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { FindPriceFacade } from '@poss-web/poss/find-price/data-access-find-price';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { AvailableProduct } from 'libs/shared/models/src/lib/find-price/find-price.model';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';

@Component({
  selector: 'poss-web-find-price',
  templateUrl: './find-price.component.html',
  styleUrls: ['./find-price.component.scss']
})
export class FindPriceComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  isProductLoading$: Observable<boolean>;
  searchProductList$: Observable<SearchProductList[]>;
  searchEnableFlag$: Observable<boolean>;
  findPriceFormgroup: FormGroup;
  currencyCode: string;
  weightCode: string;
  finalValue: number = 0;
  totalTax: number = 0;
  totalValue: number = 0;
  priceDetails: ProductPriceDetails;
  taxDetails: CashMemoTaxDetails;
  itemCode = '';
  standardPrice: any;
  regularItemArray = [];
  availableProducts: AvailableProduct[] = [];
  taxTransactionType = TransactionTypeEnum.CUST_TRANSACTION_CM;

  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  productType: string;
  stdPriceDetailsTitle: string;
  priceDetailsTitle: string;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    private locationSettingsFacade: LocationSettingsFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private productFacade: ProductFacade,
    private findPriceFacade: FindPriceFacade,
    public commonFacade: CommonFacade,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private overlayNotification: OverlayNotificationServiceAbstraction,
  ) {
    super(timeTrackingLog);
    this.translate
      .get([
        'pw.findPrice.stdPriceTitle',
        'pw.findPrice.priceDetailsTitle',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.stdPriceDetailsTitle =
          translatedMessages['pw.findPrice.stdPriceTitle'];
        this.priceDetailsTitle =
          translatedMessages['pw.findPrice.priceDetailsTitle'];
      });
    this.findPriceFormgroup = new FormGroup({
      weight: new FormControl('', [
        this.fieldValidatorsService.requiredField('Weight'),
        this.fieldValidatorsService.weightField('Weight'),
        this.fieldValidatorsService.min(0.001, 'Weight')
      ]),
      lotNumber: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.findPriceFacade.loadStandardPrice();
    this.productFacade.setGridSearchEnable(true);
    this.searchEnableFlag$ = this.productFacade.getGridSearchEnable();
    this.searchProductList$ = this.productFacade.getSearchProductList();
    this.isLoading$ = this.findPriceFacade.getIsLoading();
    this.isProductLoading$ = this.productFacade.getIsLoading();

    this.findPriceFacade
      .getStandardPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.standardPrice = data;
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
      this.findPriceFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
            this.errorHandler(error);
        }
      });

    this.productFacade
      .getProductDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productValue: ProductDetails[]) => {
        this.addStopTracking(
          'pw.instrumentationMessges.exactItemCodeSearchMsg'
        );
        this.addStopTracking('pw.instrumentationMessges.scanningItemCodeMsg');
        if (productValue.length !== 0) {
          productValue.forEach(element => {
            this.availableProducts.push({
              lotNumber: element.lotNumber,
              inventoryId: element.inventoryId,
              totalWeight: element.stdWeight,
              totalQuantity: element.totalQuantity
            });
          });
        } 
      });

    this.productFacade
      .getSearchProductListCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data !== -1) {
          if (data === 0) {
            this.searchComponent.noSearchResultFound = true;
            this.findPriceFacade.getItemCode()
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: string) => {
                if (data) {
                  this.itemCode = data;
                }
              });
          } else {
            this.searchComponent.noSearchResultFound = false;
          }
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

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightCode => {
        this.weightCode = weightCode;
      });

    this.findPriceFormgroup.get('lotNumber')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(lotNumber => {
        if(lotNumber !== '' && lotNumber !== null){
          const selectedProduct = this.availableProducts.find(
            type => type.lotNumber === lotNumber
          );
          this.findPriceFormgroup.get('weight').setValue(selectedProduct.totalWeight);
        }
      });

    combineLatest([
        this.findPriceFacade.getPriceDetails().pipe(takeUntil(this.destroy$)),
        this.findPriceFacade.getTaxDetails().pipe(takeUntil(this.destroy$))
      ]).subscribe(([priceDetails, taxDetails]) => {
        if (priceDetails && taxDetails) {
          this.priceDetails = priceDetails;
          this.taxDetails = taxDetails;
          this.totalValue = 
            priceDetails.priceDetails.isUcp && !priceDetails.ignoreUcpRecalculate
              ? this.calculateTotalValueForUCP(taxDetails, priceDetails.finalValue)
              : this.currencyRoundOff(priceDetails.finalValue);
          this.totalTax = this.calculateTax(
            taxDetails,
            this.totalValue,
            priceDetails?.priceDetails?.itemHallmarkDetails
          );
          this.finalValue = this.totalValue + this.totalTax;
          this.findPriceFacade
            .getIsViewPricing()
            .pipe(take(1))
            .subscribe((isViewPricing: boolean) => {
              if (isViewPricing) {
                this.openItemDetails();
              }
            });
        }
      });

    
  }

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
  
  searchByItemcode(event: SearchEmitEvent) {
    this.clearPage();
    this.productFacade.clearProductRelatedDetails();
    if (event.lotNumber !== null) {
      this.addStartTracking(
        'pw.instrumentationMessges.scanningItemCodeMsg'
      );
      this.findPriceFacade.setItemCode(event.searchValue);
      this.productFacade.loadProductDetails({
        itemCode: event.searchValue,
        lotNumber: event.lotNumber
      });
    } else {
      if (event.isValid) {
        this.addStartTracking(
          'pw.instrumentationMessges.suggestiveItemCodeSearchMsg'
        );
        this.findPriceFacade.setItemCode(event.searchValue);
        this.productFacade.loadSearchProduct({
          searchValue: event.searchValue
        });
      } else {
        this.productFacade.clearSearchProductList();
      }
    }
  }

  selectedItemcode(event: SearchProductList) {
    this.addStartTracking('pw.instrumentationMessges.productSearchMsg');
    this.productFacade.clearProductRelatedDetails();
    this.itemCode = event.itemCode;
    this.productFacade.loadProductDetails({
      itemCode: event.itemCode
    });
  }

  exactSearchByItemcode(event: SearchEmitEvent) {
    this.productFacade.clearProductRelatedDetails();
    if (event.isValid) {
      this.addStartTracking(
        'pw.instrumentationMessges.exactItemCodeSearchMsg'
      );
      this.findPriceFacade.setItemCode(event.searchValue);
      this.productFacade.loadProductDetails({
        itemCode: event.searchValue
      });
    } else {
      this.productFacade.clearProductList();
    }
  }

  openItemDetails() {
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      this.priceDetails?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });
    
    const priceResult = calculatePriceBreakup(
      this.priceDetails?.priceDetails,
      this.taxDetails.data,
      {
        isUcp: this.priceDetails?.priceDetails?.isUcp,
        totalValue: this.currencyRoundOff(this.totalValue),
        weightUnit: this.weightCode,
        weight: this.priceDetails?.stdWeight
      },
    );
    if (this.priceDetails.productGroupCode === this.coinCode) {
      this.productType = ProductTypesEnum.COINS;
    } else {
      this.productType = ProductTypesEnum.REGULAR;
    }
    this.itemDetailPopupservice.open({
      title: this.priceDetails?.lotNumber ? this.priceDetailsTitle : this.stdPriceDetailsTitle,
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.currencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: false,
        itemCode: this.priceDetails?.itemCode,
        lotNumber: this.priceDetails?.lotNumber ? this.priceDetails?.lotNumber : '-',
        productCategory: this.priceDetails?.productCategoryCode,
        productGroup: this.priceDetails?.productGroupCode,
        grossWeight: this.priceDetails?.stdWeight,
        netWeight: this.priceDetails?.priceDetails?.netWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate,
        isCOMOrder: this.priceDetails?.lotNumber ? false : true
      },
      priceBreakup: priceResult
    });
  }

  viewPricing(){
    this.loadPriceDetails(true);
  }

  calculatePrice(){
    this.loadPriceDetails(false);
  }

  checkValidity(): boolean{
    if(
      this.searchProductList$ && 
      (this.itemCode === ''||
      this.itemCode === null)
    ){
      this.errorNotifications("Please select variant code");
      return false;
    } else{
      if(this.availableProducts.length > 0){
        if(
          this.findPriceFormgroup.get('lotNumber').value === '' || 
          this.findPriceFormgroup.get('lotNumber').value === null
        ){
          this.errorNotifications("Please select Lot Number");
          return false;
        }
        else{
          return true;
        }
      } else{
        return true;
      }
    }
  }

  loadPriceDetails(isViewPricing: boolean){
    let validity = this.checkValidity();
    if(validity){
      this.findPriceFacade.loadTaxDetails({
        itemCode: this.itemCode,
        txnType: this.taxTransactionType
      });
      this.findPriceFacade.findPrice({
        isViewPricing : isViewPricing,
        payload: {
          checkInventory: true,
          itemCode: this.itemCode,
          lotNumber: this.findPriceFormgroup.get('lotNumber').value ?  this.findPriceFormgroup.get('lotNumber').value : null,
          standardPrice: this.standardPrice,
          measuredWeight: this.findPriceFormgroup.get('weight').value,
          measuredQuantity: 1,
        }
      });
    }
  }

  calculateTotalValueForUCP(
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
          // cessTaxValue = (taxValue * taxDetails.cess[tax].cessPercentage) / 100;
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        } else {
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        }
      }
    }

    totalValue = finalValue / (cessTaxValue + taxValue + 1);

    return this.currencyRoundOff(totalValue);
  }
  
  calculateTax(
    taxDetails: CashMemoTaxDetails,
    totalItemValue: number,
    itemHallmarkDetails?: ItemHallmarkDetails
  ): number {
    let taxValue = 0;
    let cessTaxValue = 0;

    if (taxDetails.data !== null) {
      for (const tax of Object.keys(taxDetails.data)) {
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
      this.currencyRoundOff(cessTaxValue) +
      this.currencyRoundOff(taxValue) +
      this.calculateHallmarkingTax(itemHallmarkDetails)
    );
  }

  calculateHallmarkingTax(hallmarkingDetails: ItemHallmarkDetails): number {
    let taxValue = 0;

    if (
      hallmarkingDetails?.isFOCForHallmarkingCharges !== null &&
      hallmarkingDetails?.isFOCForHallmarkingCharges === false
    ) {
      if (
        hallmarkingDetails?.hallmarkingCharges &&
        hallmarkingDetails?.hallmarkGstPct
      ) {
        taxValue =
          (hallmarkingDetails?.hallmarkingCharges *
            hallmarkingDetails?.hallmarkGstPct) /
          100;
      }
    }

    return this.currencyRoundOff(taxValue);
  }

  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  errorNotifications(errorKey: string) {
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
          .subscribe();
      });
  }

  clearPage() {
    this.availableProducts = [];
    this.itemCode = '';
    this.totalTax = 0;
    this.finalValue = 0;
    this.totalValue = 0;
    this.findPriceFormgroup.reset();
  }

  clear(){
    this.clearPage();
    this.searchComponent?.clearSearch(null);
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.FIND_PRICE
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearPage()
    this.findPriceFacade.resetValues();
  }
}