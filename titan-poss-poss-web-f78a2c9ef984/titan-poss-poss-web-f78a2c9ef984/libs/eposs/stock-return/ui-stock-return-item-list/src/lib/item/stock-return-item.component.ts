import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import {
  StockReturnItem,
  ReturnInvoiceCFATabEnum,
  CFAItemToUpdate,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-stock-return-item',
  templateUrl: './stock-return-item.component.html',
  styleUrls: ['./stock-return-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReturnItemComponent implements OnInit, OnDestroy {
  @Input() item: StockReturnItem;
  @Input() cart = true;
  @Input() tab: ReturnInvoiceCFATabEnum;
  @Input() selectionEvents: Observable<any>;
  @Output() selectedItem = new EventEmitter<StockReturnItem>();
  @Output() checkBox = new EventEmitter<boolean>();
  @Output() updateItem = new EventEmitter<CFAItemToUpdate>();
  @Output() remove = new EventEmitter<StockReturnItem>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();
  readonlyqty = true;
  checkBoxValue = false;
  itemForm: FormGroup;
  singleItemWt: number;
  maxValue: number;
  selectedAll: boolean;
  itemData: ItemData;
  returnInvoiceCFATabRef = ReturnInvoiceCFATabEnum;
  currencyCode: string;
  private destroy$ = new Subject<null>();

  constructor(private weightFormatter: WeightFormatterService) {}

  ngOnInit() {
    this.itemForm = this.createForm(this.item);
    this.selectionEvents.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.selectCheckbox === true) {
        this.itemForm.patchValue({ isItemSelected: true });
      } else {
        this.itemForm.patchValue({ isItemSelected: false });
      }
      if (data.enableCheckbox === true) {
        this.itemForm.controls.isItemSelected.enable();
      } else {
        this.itemForm.controls.isItemSelected.disable();
      }
    });
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
      isStudded: this.item.isStudded,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
      isHallmarked: this.item.ishallmarking,
      itemDetails: this.item?.itemDetails ? this.item?.itemDetails : null
    };
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

  createForm(item: StockReturnItem): FormGroup {
    return new FormGroup({
      measuredQuantity: new FormControl(
        item.measuredQuantity === null
          ? item.availableQuantity
          : item.measuredQuantity
      ),
      isItemSelected: new FormControl(''),
      measuredWeight: new FormControl(
        this.weightFormatter.format(
          item.measuredWeight === null
            ? item.availableWeight
            : item.measuredWeight
        )
      ),
      binGroupCode: new FormControl()
    });
  }

  /**
   * emits update event
   */

  /**
   * emits event for remove item from cart
   */
  removeItem() {
    this.remove.emit(this.item);
  }

  /**
   * emits the selected items
   */
  emitSelectedItem() {
    this.selectedItem.emit(this.item);
    this.checkBox.emit(this.checkBoxValue);
  }
  /**
   * creates item payload with updated quantity
   * @param quantity :updated quantity
   */

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    if (event.code === 'Delete' || event.key === 'Delete') {
      this.removeItem();
    }
  }

  selectItem() {
    this.selection.emit({
      id: this.item.id,
      selected: this.itemForm.get('isItemSelected').value
    });
  }
  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id.toString(),
      imageUrl: this.item.imageURL
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
