import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  StockIssueItem,
  ItemSelection,
  ItemSelectionAll,
  ItemData,
  StockIssueTEPGEPTypesEnum,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-stock-issue-tep-gep-item',
  templateUrl: './stock-issue-tep-gep-item.component.html',
  styleUrls: ['./stock-issue-tep-gep-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockIssueTepItemComponent implements OnInit, OnDestroy {
  @Input() item: StockIssueItem;
  @Input() selectionEvents: Observable<ItemSelectionAll>;
  @Input() dateFormat: string;
  @Input() isL3Store: boolean;

  @Output() selection: EventEmitter<ItemSelection> = new EventEmitter();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  destroy$: Subject<null> = new Subject<null>();

  itemForm: FormGroup;
  disabled = false;
  totalQuantity = 0;
  totalWeight = 0;
  itemData: ItemData;
  stockIssueTEPGEPTypesEnumRef = StockIssueTEPGEPTypesEnum;
  currencyCode: string;

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
      mfgDate: null,
      isStudded: this.item.isStudded,
      finalValue: this.item.finalValue,
      karat: this.item.karat,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isHallmarked:
        this.item?.ishallmarking === 'true' || this.item?.ishallmarking === true
          ? true
          : false,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };

    this.itemForm = this.createForm(this.item);
    if (this.item.availableQuantity === 0) {
      this.itemForm.disable();
      this.disabled = true;
    }

    this.selectionEvents
      .pipe(debounceTime(10), takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.selectCheckbox === true) {
          this.itemForm.patchValue({ isSelected: true });
        } else {
          this.itemForm.patchValue({ isSelected: false });
        }
        if (data.enableCheckbox === true) {
          this.itemForm.controls.isSelected.enable();
        } else {
          this.itemForm.controls.isSelected.disable();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.itemData = {
        ...this.itemData,
        imageURL: this.item.imageURL,
        thumbnailURL: this.item.thumbnailImageURL,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
        taxDetails: this.item?.taxDetails ? this.item.taxDetails : null
      };
    }
  }

  createForm(item: StockIssueItem): FormGroup {
    this.totalQuantity =
      item.measuredQuantity === null
        ? item.availableQuantity
        : item.measuredQuantity;
    this.totalWeight =
      item.measuredWeight === null ? item.availableWeight : item.measuredWeight;

    return new FormGroup({
      isSelected: new FormControl(false),
      totalWeight: new FormControl(this.totalWeight),
      totalQuantity: new FormControl(this.totalQuantity)
    });
  }

  onSelectionEmit() {
    this.selection.emit({
      isSelected: this.itemForm.value.isSelected,
      item: this.item
    });
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id ? this.item.id.toString() : this.item.inventoryId,
      imageUrl: this.item.imageURL
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
