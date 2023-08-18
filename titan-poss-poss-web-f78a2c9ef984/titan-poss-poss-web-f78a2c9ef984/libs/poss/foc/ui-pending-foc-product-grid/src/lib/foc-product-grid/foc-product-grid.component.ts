import {
  Component,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
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

@Component({
  selector: 'poss-web-foc-product-grid',
  templateUrl: './foc-product-grid.component.html',
  styleUrls: ['./foc-product-grid.component.scss']
})
export class FocProductGridComponent implements OnInit, OnDestroy {
  @Input() productDetails$: Observable<CashMemoItemDetails[]>;
  @Input() cashMemoData: any;
  destroy$: Subject<null> = new Subject<null>();
  productDetails: CashMemoItemDetails[];
  weightCode = 'gms';
  @Input() currencyCode: string;
  @Output() loadImageUrl = new EventEmitter<string>();
  @Input() imageUrlData$: Observable<{}>;
  @Input() pgDesc$: Observable<{}>;
  @Input() rsoNames = [];

  prodGroupDesc: {};
  productType: ProductTypesEnum;

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
        // if (data) {
        this.productDetails = data;
        // }
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
      }
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
        silverRate: silverRate
      },
      priceBreakup: priceResult
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.productDetails$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        if (data) {
          this.productDetails = data;
        }
      });
  }

  openDiscountDetails(dataToBeLoaded: CashMemoItemDetails, cashmemoData) {
    if (cashmemoData) {
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
              silverRate: silverRate,
            },
            itemData: cashmemoData
          }
        })
        .subscribe(data => {
          if (data.type === 'APPLY' || data.type === 'EDIT') {
            if (data.data.reason !== null) {
              // this.discountPopupClosed.emit({
              //   reason: data.data.reason,
              //   data: dataToBeLoaded,
              //   rowIndex: event.rowIndex
              // });
            } else {
              //this.discountPopupClosed.emit(null);
            }
          }
        });
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
