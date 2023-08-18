import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CountryDetails } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-country-listing-items',
  templateUrl: './country-listing-items.component.html'
})
export class CountryListingItemsComponent implements OnChanges {
  @Input() countryDetailsList: CountryDetails;
  @Output() countryCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: any;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.countryDetailsList.isActive;
  }

  getCountryCode(countryCode: string) {
    this.countryCode.emit(countryCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      countryCode: this.countryDetailsList.countryCode,
      description: this.countryDetailsList.description,
      isdCode: this.countryDetailsList.isdCode,
      dateFormat: this.countryDetailsList.dateFormat,
      phoneLength: this.countryDetailsList.phoneLength,
      locale: this.countryDetailsList.locale,
      isActive: event.checked
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(countryCode) {
    this.viewPage.emit(countryCode);
  }
}
