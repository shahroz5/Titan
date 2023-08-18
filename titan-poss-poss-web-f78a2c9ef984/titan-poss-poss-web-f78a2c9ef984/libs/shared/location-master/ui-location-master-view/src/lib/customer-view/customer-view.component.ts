import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-customer-view',
  templateUrl: './customer-view.component.html',
  styles: []
})
export class CustomerViewComponent  {

  @Input() locationDetails: LocationMasterDetails;


}
