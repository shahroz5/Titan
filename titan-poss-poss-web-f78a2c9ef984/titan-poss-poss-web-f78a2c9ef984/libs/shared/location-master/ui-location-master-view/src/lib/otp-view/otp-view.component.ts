import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-otp-view',
  templateUrl: './otp-view.component.html',
  styles: []
})
export class OtpViewComponent  {

  @Input() locationDetails: LocationMasterDetails;


}
