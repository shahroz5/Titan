import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-brand-details-view',
  templateUrl: './brand-details-view.component.html'
})
export class BrandDetailsViewComponent {
  @Input() brandMasterDetails: BrandMasterDetails;
  expanded = true;

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
