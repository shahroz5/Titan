import { Component, Input } from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-abco-configuration-view',
  templateUrl: './abco-configuration-view.component.html',
  styles: []
})
export class AbcoConfigurationViewComponent  {

  @Input() schemeDetails: SchemeDetails;

  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
