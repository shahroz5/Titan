import { Component, Input } from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-clubbing-other-offer-view',
  templateUrl: './clubbing-other-offer-view.component.html',
  styles: []
})
export class ClubbingOtherOfferViewComponent {

  @Input() schemeDetails: SchemeDetails;

  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
