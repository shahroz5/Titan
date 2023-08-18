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
  selector: 'poss-web-other-issues-approvals-item',
  templateUrl: './other-issues-approvals-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherIssuesApprovalsItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: RequestApprovalsItems;
  @Input() requestId: number;
  @Input() isSelectAll;
  @Output() destroy$ = new Subject<null>();
  @Input() selectionEvents: Observable<any>;
  @Input() count: number;
  @Input() locationCode = null;
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();
  newIbtRequestForm: FormGroup;
  itemData: ItemData;
  id: number;
  matBadgeColor: string;

  display: boolean;
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

  updateItem() {
    const isSelectedData = {
      id: this.item.id,
      isSelected: this.newIbtRequestForm.get('selected').value
    };

    this.isSelected.emit(isSelectedData);
  }
  
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
