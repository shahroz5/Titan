import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ImageEvent, StockReturnItem } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-stock-return-itemlist',
  templateUrl: './stock-return-itemlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReturnItemlistComponent
  implements OnChanges, OnDestroy {
  @Input() itemList: StockReturnItem[] = [];
  @Input() count = 0;
  @Input() minPageSize;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,

    length: 0
  };
  @Input() pageSizeOptions: number[] = [];
  @Input() selectionEvents: Observable<any>;
  @Output() removeItem = new EventEmitter<StockReturnItem>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();
  @ViewChild(MatPaginator) paginationRef: MatPaginator;
  private destroy$ = new Subject<null>();
  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  /**
   * emits selected items
   * @param item
   */

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  /**
   * emits an event  to remove item from cart
   * @param item
   */
  remove(item: StockReturnItem) {
    this.removeItem.emit(item);
  }

  /**
   * emits event to upadte the item
   * @param item
   */
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selection.emit(selection);
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

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
