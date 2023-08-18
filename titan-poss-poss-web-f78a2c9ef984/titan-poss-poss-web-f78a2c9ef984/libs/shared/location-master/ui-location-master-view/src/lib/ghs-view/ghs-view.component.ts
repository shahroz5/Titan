import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ghs-view',
  templateUrl: './ghs-view.component.html',
  styles: []
})
export class GhsViewComponent {

  @Input() locationDetails: LocationMasterDetails;


}
