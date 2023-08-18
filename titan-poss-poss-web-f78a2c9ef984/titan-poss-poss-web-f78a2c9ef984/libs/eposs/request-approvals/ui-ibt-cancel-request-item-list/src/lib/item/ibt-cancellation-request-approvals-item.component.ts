import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';
import {
  RequestApprovalsItems,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ibt-cancellation-request-approvals-item',
  templateUrl: './ibt-cancellation-request-approvals-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbtCancellationRequestApprovalsItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: RequestApprovalsItems;
  @Input() requestId: number;
  @Output() destroy$ = new Subject<null>();
  @Input() count: number;
  @Input() selectionEvents: Observable<any>;
  @Input() locationCode = null;
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();
  newIbtRequestForm: FormGroup;
  id: number;
  quantity: boolean;
  qty: number;
  display: boolean;
  itemData: ItemData;
  @Output() isSelected = new EventEmitter<any>();

  constructor(private form: FormBuilder) {
    this.newIbtRequestForm = form.group({
      selected: ['', []]
    });
  }

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
      isStudded: this.item.isStudded,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };
    this.newIbtRequestForm.get('selected').setValue(this.item.isSelected);
    this.selectionEvents
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(10)
      )
      .subscribe(data => {
        if (data.selectCheckbox === true) {
          this.newIbtRequestForm.patchValue({ selected: true });
        } else {
          this.newIbtRequestForm.patchValue({ selected: false });
        }

        if (data.enableCheckbox === false) {
          this.newIbtRequestForm.controls.selected.disable();
        } else {
          this.newIbtRequestForm.controls.selected.enable();
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
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  // numberOnly(event): boolean {
  //   const charCode = event.which ? event.which : event.keyCode;

  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  // onQuantityChange() {

  //   if (this.newIbtRequestForm.get('selected').value) {
  //     this.facade.updateIbt({
  //       id: this.requestId,
  //       itemId: this.item.id,
  //       itemUpdateDto: {
  //         quantity: this.newIbtRequestForm.get('appQuantity').value,
  //         status: "APPROVED"
  //       }
  //     })
  //   }
  // }

  // updateItem() {
  // if (this.newIbtRequestForm.valid === true) {
  //   const isSelectedData = {
  //     id: this.item.id,
  //     isSelected: this.newIbtRequestForm.get('selected').value
  //   };
  //   this.isSelected.emit(isSelectedData);
  // }
  // else {
  //   this.newIbtRequestForm.markAllAsTouched();
  // }
  // }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
