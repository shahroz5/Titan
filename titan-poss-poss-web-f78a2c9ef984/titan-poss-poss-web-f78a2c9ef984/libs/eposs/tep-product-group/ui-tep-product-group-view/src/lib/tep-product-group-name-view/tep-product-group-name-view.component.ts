import { Component, Input } from '@angular/core';
import { TEPProductGroupConfigDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-product-group-name-view',
  templateUrl: './tep-product-group-name-view.component.html'
})
export class TepProductGroupNameViewComponent  {

  @Input() tepProductGroupConfigDetails: TEPProductGroupConfigDetails;

}
