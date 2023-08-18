import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-service-poss-view',
  templateUrl: './service-poss-view.component.html'
})
export class ServicePossViewComponent {
  @Input() locationDetails: LocationMasterDetails;
}
