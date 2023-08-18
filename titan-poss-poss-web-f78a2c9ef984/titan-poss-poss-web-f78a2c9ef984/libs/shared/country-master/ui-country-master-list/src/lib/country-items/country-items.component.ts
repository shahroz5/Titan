import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Country } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-country-items',
  templateUrl: './country-items.component.html'
})
export class CountryItemsComponent implements OnDestroy {
  @Input() countryDetailsList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() countryCode = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();

  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;



  emitCountryCode(countryCode) {
    this.countryCode.emit(countryCode);
  }
  trackBy(index: number, item: Country) {
    return item.id;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
