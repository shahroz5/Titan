import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { ListingPageData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnDestroy {
  @Input() itemByItemCode;
  @Input() itemDetailsList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() itemCode = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    itemCode: string;
  }>();



  emitItemCode(itemCode) {
    this.itemCode.emit(itemCode);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(index: number, item: ListingPageData) {
    return item.itemCode;
  }
}
