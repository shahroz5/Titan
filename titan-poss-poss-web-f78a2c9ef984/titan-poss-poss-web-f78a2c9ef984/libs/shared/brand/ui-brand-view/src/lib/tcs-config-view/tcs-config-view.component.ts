import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tcs-config-view',
  templateUrl: './tcs-config-view.component.html',
  styles: []
})
export class TcsConfigViewComponent  {

  @Input() brandMasterDetails: BrandMasterDetails;


}
