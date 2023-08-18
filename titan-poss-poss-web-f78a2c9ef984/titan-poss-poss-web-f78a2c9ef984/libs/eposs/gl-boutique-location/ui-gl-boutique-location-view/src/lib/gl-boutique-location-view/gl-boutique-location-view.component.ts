import { Component, Input } from '@angular/core';
import { GlBoutiqueLocationList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-gl-boutique-location-view',
  templateUrl: './gl-boutique-location-view.component.html'
})
export class GlBoutiqueLocationViewComponent {
  @Input() glBoutiqueLocations: GlBoutiqueLocationList;
}
