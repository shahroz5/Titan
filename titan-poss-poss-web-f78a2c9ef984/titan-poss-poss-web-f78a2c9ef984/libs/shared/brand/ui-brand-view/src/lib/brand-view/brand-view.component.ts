import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-brand-view',
  templateUrl: './brand-view.component.html',
  styles: []
})
export class BrandViewComponent {

  @Input() brandMasterDetails: BrandMasterDetails;


}
