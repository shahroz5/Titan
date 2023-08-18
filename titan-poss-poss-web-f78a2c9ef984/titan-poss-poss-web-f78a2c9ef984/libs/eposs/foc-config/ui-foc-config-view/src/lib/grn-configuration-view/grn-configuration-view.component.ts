import { Component, Input } from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-grn-configuration-view',
  templateUrl: './grn-configuration-view.component.html',
  styles: []
})
export class GrnConfigurationViewComponent {

  @Input() schemeDetails: SchemeDetails;


}
