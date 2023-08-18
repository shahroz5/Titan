import {
  Component,

  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CurrencyDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-currency-listing-items',
  templateUrl: './currency-listing-items.component.html'
})
export class CurrencyListingItemsComponent implements OnChanges {
  @Input() currencyDetailsList: CurrencyDetails;
  @Output() currencyCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.currencyDetailsList.isActive;
  }
  getCurrencyCode(currencyCode: string) {
    this.currencyCode.emit(currencyCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      currencyCode: this.currencyDetailsList.currencyCode
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(currencyCode) {
    this.viewPage.emit(currencyCode);
  }
}
