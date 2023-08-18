import {
  Component,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';

import {
  StockIssueItem,
  ItemSelection,
  ItemSelectionAll,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-stock-issue-tep-gep-item-list',
  templateUrl: './stock-issue-tep-gep-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockIssueTepItemListComponent implements OnDestroy {
  @Input() items: Observable<StockIssueItem[]>;
  @Input() totalItemsCount: number;
  @Input() pageEvent: PageEvent;
  @Input() selectionEvents: Observable<ItemSelectionAll>;
  @Input() pageSize: number;
  @Input() pageSizeOptions: number[];
  @Input() dateFormat$: Observable<string>;
  @Input() isL3Store: boolean;

  @Output() selection: EventEmitter<ItemSelection> = new EventEmitter();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  destroy$: Subject<null> = new Subject<null>();

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  onSelectionEmit(selection: ItemSelection) {
    this.selection.emit(selection);
  }

  trackBy(index: number, item: StockIssueItem) {
    return item.inventoryId;
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
