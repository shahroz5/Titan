import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Subject } from 'rxjs';
import { BinGroupDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-group-list-items',
  templateUrl: './bin-group-list-items.component.html'
})
export class BinGroupListItemsComponent implements OnDestroy {
  @Input() binGroupDetailsList: BinGroupDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() binGroupNameView = new EventEmitter<string>();
  @Output() binGroupName = new EventEmitter<string>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() minPageSize = 0;





  emitBinGroupNameView(binGroupCode) {
    this.binGroupNameView.emit(binGroupCode);
  }
  emitBinGroupName(binGroupCode) {
    this.binGroupName.emit(binGroupCode);
  }

  trackBy(index: number, item: BinGroupDetails) {
    return item.binGroupCode;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
