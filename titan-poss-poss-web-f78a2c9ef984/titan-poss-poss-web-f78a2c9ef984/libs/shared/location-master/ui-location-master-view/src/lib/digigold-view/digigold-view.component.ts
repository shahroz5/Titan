import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-digigold-view',
  templateUrl: './digigold-view.component.html',
  styles: []
})
export class DigigoldViewComponent  {

  @Input() locationDetails: LocationMasterDetails;


}
