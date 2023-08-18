import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  StockReceiveItem,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-stock-receive-history-item',
  templateUrl: './stock-receive-history-item.component.html',
  styleUrls: ['./stock-receive-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReceiveHistoryItemComponent implements OnInit {
  @Input() item: StockReceiveItem;
  @Input() isL3Store: boolean;
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();
  itemForm: FormGroup;
  itemData: ItemData;

  constructor(
    private weightFormatter: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {}

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroupDesc,
      productCategory: this.item.productCategoryDesc,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.thumbnailImageURL,
      mfgDate: this.item.mfgDate,
      orderType: this.item.orderType,
      isStudded: this.item.isStudded,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      itemDetails: this.item?.itemDetails ? this.item?.itemDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };

    this.itemForm = this.createForm(this.item);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.itemData = {
        ...this.itemData,
        imageURL: this.item.imageURL,
        thumbnailURL: this.item.thumbnailImageURL,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  createForm(item: StockReceiveItem) {
    const form = new FormGroup({
      id: new FormControl(item.id),
      measuredQuantity: new FormControl(item.measuredQuantity),
      measuredWeight: new FormControl(
        this.weightFormatter.format(item.measuredWeight)
      ),
      availableWeight: new FormControl(
        this.weightFormatter.format(item.availableWeight)
      ),
      binGroupCode: new FormControl(item.binGroupCode),
      binCode: new FormControl(item.binCode),
      remarks: new FormControl(item.remarks),
      value: new FormControl(
        this.currencyFormatterService.format(item.value, null, false)
      ),
      finalValue: new FormControl(
        this.currencyFormatterService.format(item.finalValue, null, false)
      ),
      pricePerUnit: new FormControl(item.pricePerUnit),
      preTaxValue: new FormControl(item.preTaxValue),
      totalTax: new FormControl(item.totalTax),
      itemLevelDiscount: new FormControl(
        this.currencyFormatterService.format(
          item.itemLevelDiscount,
          null,
          false
        )
      )
    });
    return form;
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }
}
