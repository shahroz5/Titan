import { Component, Input } from '@angular/core';
import { LocationMasterDetails, StateTypes } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-location-view',
  templateUrl: './location-view.component.html',
  styles: []
})
export class LocationViewComponent {
  @Input() locationDetails: LocationMasterDetails;
  @Input() locationStates: StateTypes[];
  @Input() locationTowns: StateTypes[];

  getState(stateId: string) {
    return this.locationStates.filter(val => val.id === stateId)[0].name;
  }

  getTown(townId: string) {
    return this.locationTowns.filter(val => val.id === townId)[0].name;
  }
}
