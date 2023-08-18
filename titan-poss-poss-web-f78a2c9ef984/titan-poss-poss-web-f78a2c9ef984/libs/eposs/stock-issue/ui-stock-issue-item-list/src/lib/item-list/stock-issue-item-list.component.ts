import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  ImageEvent,
  IssueInventoryItem,
  IssueItemToUpdate,
  ItemToleranceValidate,
  StockIssueTypesEnum
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { FormArray } from '@angular/forms';
@Component({
  selector: 'poss-web-stock-issue-item-list',
  templateUrl: './stock-issue-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockIssueItemListComponent
  implements OnDestroy, OnInit, OnChanges {
  @Input() type: any;
  @Input() itemList: IssueInventoryItem[];
  @Input() count: number;
  @Input() dateFormat: string;
  @Input() tab: any;
  @Input() pageSizeOptions: number[] = [];
  @Input() selectionEvents: Observable<any>;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() isL1L2Store: boolean;
  @Input() isL3Store: boolean;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() update = new EventEmitter<IssueItemToUpdate>();
  @Output() parentFormDirty = new EventEmitter<boolean>();
  @Output() validate = new EventEmitter<ItemToleranceValidate>();
  @Output() updateHeader = new EventEmitter<boolean>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  parentForm: FormArray;
  isFormDirty = false;

  selectionAllSubscription: any;

  selectionAllSubject: Subject<any> = new Subject<any>();
  destroy$ = new Subject<null>();
  stockIssueTypeEnumRef = StockIssueTypesEnum;
  selectionEvents$: Observable<any>;
  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );

  constructor() {
    this.parentForm = new FormArray([]);
    this.parentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        let isDirty = false;
        for (let i = 0; i < this.parentForm.controls.length && !isDirty; i++) {
          if (!this.parentForm.controls[i].pristine) {
            isDirty = true;
          }
        }
        if (this.isFormDirty !== isDirty) {
          this.isFormDirty = isDirty;
          this.parentFormDirty.emit(isDirty);
        }
      });
  }

  ngOnInit() {

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
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selection.emit(selection);
  }

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }
  validateItem(data: ItemToleranceValidate) {
    this.validate.emit(data);
  }
  updateItem(itemToUpdate: IssueItemToUpdate) {
    this.update.emit(itemToUpdate);
  }
  trackBy(index: number, item: IssueInventoryItem) {
    return item.id;
  }
  loadHeader(data: boolean) {
    this.updateHeader.emit(data);
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
