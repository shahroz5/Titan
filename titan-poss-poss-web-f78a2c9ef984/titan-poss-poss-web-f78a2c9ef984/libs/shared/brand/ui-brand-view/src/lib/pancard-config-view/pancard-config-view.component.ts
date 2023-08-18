import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-pancard-config-view',
  templateUrl: './pancard-config-view.component.html',
  styles: []
})
export class PancardConfigViewComponent  {

  @Input() brandMasterDetails: BrandMasterDetails;


}
