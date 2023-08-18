import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payments-view',
  templateUrl: './payments-view.component.html',
  styles: []
})
export class PaymentsViewComponent  {

  @Input() locationDetails: LocationMasterDetails;


}
