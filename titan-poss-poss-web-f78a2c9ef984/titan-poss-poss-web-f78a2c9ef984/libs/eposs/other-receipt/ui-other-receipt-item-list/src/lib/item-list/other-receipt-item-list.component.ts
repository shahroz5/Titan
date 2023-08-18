import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  OtherReceiptItem,
  BinCode,
  Lov,
  OtherReceiptItemToUpdate,
  OtherReceiptItemValidate,
  ImageEvent
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-other-receipt-item-list',
  templateUrl: './other-receipt-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherReceiptItemListComponent
  implements OnChanges, OnDestroy {
  @Input() itemList: OtherReceiptItem[];
  @Input() isVerified: boolean;
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[];
  @Input() remarks: Lov[] = [];
  @Input() count = 0;
  @Input() pageSize = 0;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() pageSizeOptions: number[] = [];

  @Output() verify = new EventEmitter<OtherReceiptItemToUpdate>();
  @Output() update = new EventEmitter<OtherReceiptItemToUpdate>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() parentFormDirty = new EventEmitter<boolean>();
  @Output() validate = new EventEmitter<OtherReceiptItemValidate>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  destroy$ = new Subject<null>();
  parentForm: FormArray;
  isFormDirty = false;
  minPageSize = 0;

  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );

  constructor() {
    this.parentForm = new FormArray([]);
    if (!this.isVerified) {
      this.parentForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.sendFormStatus();
        });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes['itemList'] &&
      changes['itemList'].currentValue &&
      changes['itemList'].previousValue &&
      (changes['itemList'].currentValue as []).length === 0 &&
      (changes['itemList'].previousValue as []).length > 0
    ) {
      const newPageEvent: PageEvent = {
        ...this.pageEvent,
        pageIndex: this.pageEvent.pageIndex - 1
      };
      if (newPageEvent.pageIndex >= 0) {
        this.paginate(newPageEvent);
      }
    }
  }
  sendFormStatus() {
    const isDirty = !this.parentForm.pristine;
    this.parentFormDirty.emit(isDirty);
  }
  verifyItem(itemToUpdate: OtherReceiptItemToUpdate) {
    this.verify.emit(itemToUpdate);
  }

  updateItem(itemToUpdate: OtherReceiptItemToUpdate) {
    this.update.emit(itemToUpdate);
  }

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  trackBy(index: number, item: OtherReceiptItem) {
    return item.id;
  }
  validateItem(data: OtherReceiptItemValidate) {
    this.validate.emit(data);
  }
  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
