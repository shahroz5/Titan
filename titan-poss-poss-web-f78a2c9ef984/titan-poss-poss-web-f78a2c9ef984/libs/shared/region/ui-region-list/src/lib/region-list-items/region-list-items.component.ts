import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-region-list-items',
  templateUrl: './region-list-items.component.html'
})
export class RegionListItemsComponent implements OnDestroy {
  @Input() regionDetailsList;
  @Input() count;
  @Input() pageEvent: PageEvent;
  @Output() regionCode = new EventEmitter<any>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() minPageSize = 0;
  @Output() emitToggleValue = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();



  emitRegionCode(regionCode: string) {
    this.regionCode.emit(regionCode);
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
