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
import { OtherIssuesItem, PSVItemToUpdate } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-psv-issue-item-list',
  templateUrl: './psv-issue-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsvIssueItemListComponent implements OnDestroy {
  @Input() itemList: OtherIssuesItem[] = [];
  @Input() tab: string;

  @Input() count = 0;
  pageSizeOptions: number[] = [];
  @Input() selectionEvents: Observable<boolean>;
  @ViewChild(MatPaginator) paginationRef: MatPaginator;
  @Input() haspaginator = false;
  @Output() updateItem = new EventEmitter<PSVItemToUpdate>();
  @Output() removeItem = new EventEmitter<OtherIssuesItem>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();
  selectionAllSubscription: any;

  destroy$: Subject<null> = new Subject<null>();
  @Input() dateFormat: string;

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
  updateItems(item: PSVItemToUpdate) {
    this.updateItem.emit(item);
  }
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selection.emit(selection);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
