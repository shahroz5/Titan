import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-customer-config-view',
  templateUrl: './customer-config-view.component.html',
  styles: []
})
export class CustomerConfigViewComponent  {

  @Input() brandMasterDetails: BrandMasterDetails;


}
