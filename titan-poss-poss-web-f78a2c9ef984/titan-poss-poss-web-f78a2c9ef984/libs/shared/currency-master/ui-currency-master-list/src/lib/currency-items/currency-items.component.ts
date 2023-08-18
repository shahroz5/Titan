import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { CurrencyDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-currency-items',
  templateUrl: './currency-items.component.html'
})
export class CurrencyItemsComponent implements OnDestroy {
  @Input() currencyDetailsList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() currencyCode = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() emitToggleValue = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<boolean>();



  emitCurrencyCode(currencyCode) {
    this.currencyCode.emit(currencyCode);
  }
  trackBy(index: number, item: CurrencyDetails) {
    return item.currencyCode;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
