import {
  StockReceiveItem,
  StockReceiveItemToUpdate,
  StockReceiveItemValidate,
  Lov,
  BinCode,
  StockReceiveTypesEnum,
  ImageEvent
} from '@poss-web/shared/models';
import { FormArray } from '@angular/forms';
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
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-stock-receive-item-list',
  templateUrl: './stock-receive-item-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReceiveItemListComponent implements OnChanges, OnDestroy {
  @Input() itemList: StockReceiveItem[];
  @Input() isVerified: boolean; // verified/non
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[];
  @Input() remarks: Lov[] = [];
  @Input() count = 0;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() pageSizeOptions: number[] = [];
  @Input() isHistory = false;
  @Input() isCFAStore: boolean;

  @Output() verify = new EventEmitter<StockReceiveItemToUpdate>();
  @Output() update = new EventEmitter<StockReceiveItemToUpdate>();
  @Output() validate = new EventEmitter<StockReceiveItemValidate>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() parentFormDirty = new EventEmitter<boolean>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  private destroy$ = new Subject<null>();

  parentForm: FormArray;
  stockReceiveTabTypesEnumRef = StockReceiveTypesEnum;

  constructor() {
    this.parentForm = new FormArray([]);
    if (!this.isVerified) {
      this.parentForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.parentFormDirty.emit(!this.parentForm.pristine);
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

  getMinPageSize(): number {
    return this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );
  }

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  trackBy(_: number, item: StockReceiveItem) {
    return item.id;
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
