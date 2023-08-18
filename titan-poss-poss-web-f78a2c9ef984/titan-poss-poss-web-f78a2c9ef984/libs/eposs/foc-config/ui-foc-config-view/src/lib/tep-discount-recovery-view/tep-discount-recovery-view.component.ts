import { Component, Input } from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-discount-recovery-view',
  templateUrl: './tep-discount-recovery-view.component.html',
  styles: []
})
export class TepDiscountRecoveryViewComponent  {

  @Input() schemeDetails: SchemeDetails;

  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
