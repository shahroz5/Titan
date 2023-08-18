import { Component, Input } from '@angular/core';
import {
  LocationMasterDetails,
  StateTypes,
  BrandSummary,
  CurrencyTypes
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-location-details-view',
  templateUrl: './location-details-view.component.html',
  styleUrls: ['./location-details-view.component.scss']
})
export class LocationDetailsViewComponent  {


  @Input() locationDetails: LocationMasterDetails;
  @Input() locationTypes: any;
  @Input() ownerInfo: any;
  @Input() locationStates: StateTypes[];
  @Input() regions: any;
  @Input() brandName: BrandSummary[];
  @Input() subRegion$: Observable<any>;
  @Input() marketCode: any;
  @Input() currencyTypes: CurrencyTypes[];
  @Input() locationSize: StateTypes[];
  @Input() countryCode: string;

  @Input() curency$: Observable<any>;

  @Input() subBrandName$: Observable<any>;
  @Input() locationTowns: any;

  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
