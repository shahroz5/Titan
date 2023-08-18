import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Subject } from 'rxjs';
import { CorporateTown } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-corporate-town-list-items',
  templateUrl: './corporate-town-list-items.component.html'
})
export class CorporateTownListItemsComponent implements OnDestroy {
  @Input() corporateTownDetailsList: CorporateTown[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() corporateTownCode = new EventEmitter<number>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() minPageSize = 0;
  @Output() toggleEvent = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();


  emitCorporateTownCode(Code) {
    this.corporateTownCode.emit(Code);
  }
  emitToggleEvent(event) {
    this.toggleEvent.emit(event);
    console.log('check', event);
  }
  trackBy(index: number, item: CorporateTown) {
    return item.townCode;
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
