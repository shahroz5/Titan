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
  selector: 'poss-web-sub-region-list-items',
  templateUrl: './sub-region-list-items.component.html'
})
export class SubRegionListItemsComponent implements OnDestroy {
  @Input() subRegionDetailsList;
  @Input() count;
  @Input() pageEvent: PageEvent;
  @Input() minPageSize = 0;
  @Output() regionCode = new EventEmitter<any>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();




  emitRegionCode(subRegionCode: string) {
    this.regionCode.emit(subRegionCode);
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
