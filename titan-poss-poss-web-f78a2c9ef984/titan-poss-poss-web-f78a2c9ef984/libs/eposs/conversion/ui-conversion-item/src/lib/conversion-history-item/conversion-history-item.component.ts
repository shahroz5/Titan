import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  ConversionItemDetailsEnum,
  ImageEvent,
  InStockConversionTypesEnum,
  ItemData
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-conversion-history-item',
  templateUrl: './conversion-history-item.component.html',
  styleUrls: ['./conversion-history-item.component.scss']
})
export class ConversionHistoryItemComponent implements OnChanges, OnDestroy {
  @Input() item: any;
  @Input() parentForm: FormArray;
  @Input() requestType: InStockConversionTypesEnum;

  itemData: ItemData;
  conversionItemDetailsEnum = ConversionItemDetailsEnum;
  InStockConversionTypesEnumRef = InStockConversionTypesEnum;
  destroy$: Subject<null> = new Subject<null>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  constructor(public weightFormatter: WeightFormatterService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']) {
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
        orderType: null,
        isStudded: this.item.isStudded,
        sold: this.item?.itemDetails?.sold,
        finalValue: this.item?.measuredValue,
        isHallmarked:
          this.item?.itemDetails?.data?.isHallMarking === 'true' ||
          this.item?.itemDetails?.data?.isHallMarking === true
            ? true
            : false,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id ? this.item.id : this.item.inventoryId,
      itemCode: this.item?.itemCode,
      imageUrl: this.item.imageURL
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
