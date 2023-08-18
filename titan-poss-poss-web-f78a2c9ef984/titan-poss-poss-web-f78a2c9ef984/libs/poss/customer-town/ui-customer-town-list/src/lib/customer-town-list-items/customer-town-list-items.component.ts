import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { CustomerTown } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-customer-town-list-items',
  templateUrl: './customer-town-list-items.component.html'
})
export class CustomerTownListItemsComponent implements OnDestroy {
  @Input() customerTownDetailsList: CustomerTown[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() customerTownCode = new EventEmitter<number>();
  @Output() toggleEvent = new EventEmitter<any>();

  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() minPageSize = 0;

  emitCustomerTownCode(Code) {
    this.customerTownCode.emit(Code);
  }
  emitToggleEvent(event) {
    this.toggleEvent.emit(event);
    console.log('check', event);
  }
  trackBy(index: number, item: CustomerTown) {
    return item.townCode;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
