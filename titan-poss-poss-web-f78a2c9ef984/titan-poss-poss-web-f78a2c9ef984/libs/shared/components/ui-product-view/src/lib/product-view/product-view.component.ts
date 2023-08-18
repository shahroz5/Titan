import {
  Component,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ABFocSchemeDetailsDto,
  CashMemoItemDetails,
  DiscountDetailsPopupServiceAbstraction,
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  MetalTypeEnum,
  ProductTypesEnum
} from '@poss-web/shared/models';
import {
  POSS_WEB_COIN_PRODUCT_GROUP_CODE,
  POSS_WEB_CURRENCY_CODE
} from '@poss-web/shared/util-config';
import { ItemPreviewPopupComponent } from '@poss-web/shared/components/ui-item-preview-popup';
import { MatDialog } from '@angular/material/dialog';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';
import { AbFocPopupComponent } from '@poss-web/poss/foc/ui-foc-popups';

@Component({
  selector: 'poss-web-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() productDetails$: Observable<CashMemoItemDetails[]>;
  @Input() cashMemoData: any;
  @Input() isGRN = false;
  destroy$: Subject<null> = new Subject<null>();
  productDetails: CashMemoItemDetails[];
  weightCode = 'gms';
  @Input() currencyCode: string;
  @Output() loadImageUrl = new EventEmitter<string>();
  @Input() imageUrlData$: Observable<{}>;
  @Input() pgDesc$: Observable<{}>;
  prodGroupDesc: {};
  productType: ProductTypesEnum;
  @Input() locationCode: string;
  @Input() showFOCButton = false;
  @Input() focData = [];
  @Input() rsoNames = [];
  @Input() isLegacy = false;

  defaultValue = '0.00';
  constructor(
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    public dialog: MatDialog,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private discountDetailsPopupService: DiscountDetailsPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.productDetails$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        if (data) {
          this.productDetails = data;
        }
      });

    this.imageUrlData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== null) {
        this.openPopup(data);
      }
    });

    this.pgDesc$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== null) {
        this.prodGroupDesc = data;
      }
    });
  }

  openItemDetails(dataToBeLoaded?: CashMemoItemDetails) {
    const priceResult = calculatePriceBreakup(
      dataToBeLoaded.priceDetails,
      dataToBeLoaded.taxDetails?.data,
      {
        isUcp: dataToBeLoaded.priceDetails?.isUcp,
        totalValue: dataToBeLoaded.totalValue,
        weightUnit: this.weightCode,
        weight: dataToBeLoaded.totalWeight
      },
      dataToBeLoaded.totalDiscount
    );
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      dataToBeLoaded?.priceDetails?.metalPriceDetails?.metalPrices;
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
    this.itemDetailPopupservice.open({
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.defaultCurrencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: true,
        itemCode: dataToBeLoaded.itemCode,
        lotNumber:
          dataToBeLoaded.productGroupCode === this.coinCode
            ? dataToBeLoaded.totalQuantity
            : dataToBeLoaded.lotNumber,
        productCategory: dataToBeLoaded.productCategoryCode,
        productGroup: dataToBeLoaded.productGroupCode,
        grossWeight: dataToBeLoaded.totalWeight,
        netWeight: dataToBeLoaded.priceDetails?.isUcp
          ? dataToBeLoaded.totalWeight
          : priceResult?.totalMetalWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate,
        locationCode: this.locationCode
      },
      priceBreakup: priceResult
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.productDetails$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        if (data) {
          // sorting in ascending order
          data.sort((a, b) => a.rowId - b.rowId);
          this.productDetails = data;
        }
      });
  }

  openDiscountDetails(dataToBeLoaded: CashMemoItemDetails) {
    let cashMemoData;
    if (this.cashMemoData.length) {
      cashMemoData = this.cashMemoData.filter(
        element => element?.itemDetails?.itemId === dataToBeLoaded.itemId
      )[0];
    }
    if (cashMemoData) {
      if (dataToBeLoaded.productGroupCode === this.coinCode) {
        this.productType = ProductTypesEnum.COINS;
      } else {
        this.productType = ProductTypesEnum.REGULAR;
      }
      const selectedLotNumber =
        this.productType === ProductTypesEnum.COINS
          ? String(dataToBeLoaded.totalQuantity)
          : dataToBeLoaded.inventoryId;

      let goldRate;
      let platinumRate;
      let silverRate;
      const dataArray =
        dataToBeLoaded?.priceDetails?.metalPriceDetails?.metalPrices;
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
      this.discountDetailsPopupService
        .open({
          readOnly: true,
          itemData: {
            currencyCode: this.defaultCurrencyCode,
            weightUnit: this.weightCode,
            headerDetails: {
              showTitle: true,
              itemCode: dataToBeLoaded.itemCode,
              lotNumber:
                this.productType === ProductTypesEnum.REGULAR
                  ? dataToBeLoaded.lotNumber
                  : selectedLotNumber,

              productCategory: dataToBeLoaded.productCategoryCode,
              productGroup: dataToBeLoaded.productGroupCode,
              grossWeight: dataToBeLoaded.totalWeight,
              netWeight: dataToBeLoaded.totalWeight,
              goldRate: goldRate,
              platinumRate: platinumRate,
              silverRate: silverRate
            },
            itemData: cashMemoData
          }
        })
    }
  }

  showPopup(item: CashMemoItemDetails): void {
    this.loadImageUrl.emit(item.itemCode);
  }

  openPopup(data) {
    this.dialog.open(ItemPreviewPopupComponent, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        imageUrl: data.imageUrl,
        itemCode: data.itemCode
      }
    });
  }

  getProductGroupDesc(productGroupCode) {
    if (productGroupCode && this.prodGroupDesc) {
      return this.prodGroupDesc[`${productGroupCode}`];
    } else {
      return productGroupCode;
    }
  }

  ABFOCViewPopup(selectedFOCData: ABFocSchemeDetailsDto[]) {
    this.dialog.closeAll();
    this.dialog.open(AbFocPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      data: {
        selectedAbFoc: selectedFOCData,
        headerLabel: 'pw.productGrid.addedFOCSchemeHeaderLabel',
        searchLabel: 'pw.productGrid.searchbyFOCWeightLabel',
        schemeNameLabel: 'pw.productGrid.schemeNameLabel',
        eligibleWeightLabel: 'pw.productGrid.eligibleWeightLabel',
        emptySchemeNameMessage: 'pw.productGrid.emptySchemeNameMessage',
        isViewMode: true
      },
      disableClose: true
    });
  }

  // display rso name from rso code
  getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.code === code) return rso.name;
      }
    }
    return code;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
