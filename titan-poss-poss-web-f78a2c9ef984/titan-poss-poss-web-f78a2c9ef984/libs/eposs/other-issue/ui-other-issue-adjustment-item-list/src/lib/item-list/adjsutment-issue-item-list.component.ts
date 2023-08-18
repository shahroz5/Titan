import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import {
  OtherIssuesItem,
  AdjustmentItemToUpdate
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-adjsutment-issue-item-list',
  templateUrl: './adjsutment-issue-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjsutmentIssueItemListComponent implements OnDestroy {
  @Input() itemList: OtherIssuesItem[] = [];
  @Input() tab: string;
  @Input() dateFormat: string;
  @Input() count = 0;
  @Input() haspaginator = false;
  @Input() selectionEvents: Observable<boolean>;

  @ViewChild(MatPaginator) paginationRef: MatPaginator;

  @Output() updateItem = new EventEmitter<AdjustmentItemToUpdate>();
  @Output() removeItem = new EventEmitter<OtherIssuesItem>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();

  pageSizeOptions: number[] = [];
  destroy$: Subject<null> = new Subject<null>();


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
  remove(item: OtherIssuesItem) {
    this.removeItem.emit(item);
  }

  /**
   * emits event to upadte the item
   * @param item
   */
  updateItems(item: AdjustmentItemToUpdate) {
    this.updateItem.emit(item);
  }
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selection.emit(selection);
  }
  trackBy( item: OtherIssuesItem) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
